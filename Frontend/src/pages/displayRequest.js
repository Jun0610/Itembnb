import React, { useEffect, useContext, useState } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import 'react-confirm-alert/src/react-confirm-alert.css';
import { confirmAlert } from 'react-confirm-alert';
import ReactMarkdown from 'react-markdown';

import userContext from '../contexts/userContext';
import RequestService from '../tools/requestService';
import ItemService from '../tools/itemsService';
import UserService from '../tools/userService';
import EmailService from '../tools/emailService';
import SocketService, { socket } from '../tools/socketService';
import { Loading, LoadingSmall } from "../components/Loading";
import Post from "../components/post";

import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/homepage.css";
import "../styles/requestPage.css";

const DisplayRequestPost = () => {
    const navigate = useNavigate();
    const authUser = useContext(userContext);
    const { id: requestId } = useParams(); // id of request post

    /* --- Fetching info from the server --- */

    // Get info of user who asked for request
    const [requestUser, setRequestUser] = useState({});

    // Get request to be shown from the server
    const [request, setRequest] = useState({});

    // loading after submission of data
    const [loading, setLoading] = useState({ addItem: false });

    // Get user's posted items from the server
    const [userItems, setUserItems] = useState([]);
    const [itemsLoaded, setItemsLoaded] = useState(false);
    // Checkboxes for selecting items
    const [checkBoxes, setCheckBoxes] = useState({});

    // Get items that have been linked to this request
    const [linkedItems, setLinkedItems] = useState([]);
    const [linkedItemsLoaded, setLinkedItemsLoaded] = useState(false);

    const [notifsOn, setNotifsOn] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const requestData = await RequestService.getRequest(requestId);
            setRequest(requestData);

            const requestUserData = await UserService.getUserData(requestData.ownerID);
            setRequestUser(requestUserData.data);

            const linkedItemData = await ItemService.getItemsFromList(requestData.recommendedItems);
            setLinkedItems(linkedItemData);
            setLinkedItemsLoaded(true);

            // check if user is logged in with sessionStorage, because checking authUser.user.isAuth doesn't work in useEffect
            const loggedInUser = JSON.parse(sessionStorage.getItem('curUser'));

            if (loggedInUser !== null) {
                // log in user automatically if session storage indicates they've already logged in, in another tab
                authUser.login(loggedInUser);

                // if user is logged in, fetch their info

                // load user info (minus items)
                const userInfoData = await UserService.getUserData(loggedInUser._id);

                // load user items
                // must use userInfoData instead of userInfo or it doesn't load
                const userItemData = await ItemService.getItemsFromList(userInfoData.data.postedItems);
                setUserItems(userItemData);

                const res2 = await UserService.getNotificationStatus(loggedInUser._id);

                const settings = { email: userInfoData.data.email };
                if (res2.data === 'notifications-on') {
                    settings.all = true;
                }
                else {
                    settings.all = false;
                }

                // Set checkboxes for selecting items to recommend
                let checkBoxes = {};
                userItemData.forEach(
                    item => checkBoxes[item._id] = requestData.recommendedItems.includes(item._id)
                );
                setCheckBoxes(checkBoxes);
                setItemsLoaded(true);

                SocketService.connect();
                socket.emit('sendId', JSON.parse(sessionStorage.getItem('curUser')).email);
            }
        }
        fetchData();

    }, []);

    /* --- For editing request --- */
    const [isEditing, setIsEditing] = useState(false);

    // object that stores error messages for invalid inputs
    const [inputErrors, setInputErrors] = useState({ name: [], description: [] });

    const onRequestChange = (e) => {
        setRequest({
            ...request,
            [e.target.id]: e.target.value
        });
        validateField(e.target.id, e.target.value);
    }

    const handleDeleteRequest = () => {

        confirmAlert({
            name: 'Confirm to delete',
            message: "Are you sure you want to delete this request?",
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {

                        async function deleteRequest() {
                            const deleteResult = await RequestService.deleteRequest(request, authUser.user.user._id);
                            console.log("deleteresult", deleteResult);
                            if (deleteResult.success) {
                                alert("Deletion successful.");
                                return navigate("/");
                            }
                            else {
                                alert("Deletion failed. Sorry.");
                            }
                        }
                        deleteRequest();
                    }
                },
                {
                    label: 'No',
                    onClick: () => { },
                }
            ],
        });
    }

    const handleEditRequest = () => {
        if (isEditing) {
            if (noInputErrors()) {
                RequestService.editRequest(request, authUser.user.user._id);
                setIsEditing(false);
            }
        }
        else {
            setIsEditing(true);
        }
    }

    const cancelEdit = () => {
        setIsEditing(false);
        console.log("TODO");
        // TODO - snap back to old request when cancel button is pressed
    }

    const validateField = (fieldId, fieldValue) => {
        if (fieldId === "name" && fieldValue.length > 20) {
            setInputErrors({
                ...inputErrors,
                [fieldId]: [fieldId + " cannot be more than 20 characters long!"]
            });
        }
        else if (fieldValue.length === 0) {
            setInputErrors({
                ...inputErrors,
                [fieldId]: [fieldId + " must have at least 1 character!"]
            });
        }
        else {
            setInputErrors({
                ...inputErrors,
                [fieldId]: []
            });
        }
    }
    // check that every error array in inputErrors is empty
    // from https://stackoverflow.com/questions/27709636/determining-if-all-attributes-on-a-javascript-object-are-null-or-an-empty-string 
    const noInputErrors = () => {
        return Object.values(inputErrors).every(x => x.length === 0);
    }

    const EditButtonHeader = () => {
        if ((authUser.user.isAuth) && (authUser.user.user._id === request.ownerID)) {
            return (
                <div>
                    <button className="hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full m-2" style={{ backgroundColor: '#F7D65A' }} onClick={handleEditRequest}>{isEditing ? 'Save' : 'Edit'}</button>
                    {!isEditing ||
                        <button className="hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full m-2" style={{ backgroundColor: '#F7D65A' }} onClick={cancelEdit}>Cancel</button>}
                    <button className="hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full m-2" style={{ backgroundColor: '#F7D65A' }} onClick={handleDeleteRequest}>Delete</button>
                </div>
            )
        }
        return;
    }

    /* --- List of items that have been linked to the request --- */
    const LinkedItemList = () => {
        let linkedItemDisplay;
        if (!linkedItemsLoaded) {
            linkedItemDisplay = <LoadingSmall />;
        }
        else if (linkedItems.length === 0) {
            linkedItemDisplay = <p>No items have been recommended for this request!</p>;
        }
        else {
            linkedItemDisplay = linkedItems.map(itemData =>
                <Post post={itemData} isRequest={false} key={itemData._id} />
            );
        }

        return (
            <div className="basicBorderDiv m-3">
                <p className="yellowText">Items recommended for this request</p>

                {linkedItemDisplay}
            </div>
        )
    }

    /* --- List of items that can be linked to the request --- */
    const [itemView, setItemView] = useState("big");

    const switchView = () => {
        if (itemView === "small") {
            setItemView("big");
        }
        else if (itemView === "big") {
            setItemView("small");
        }
    }

    const toggleCheckbox = (e) => {
        setCheckBoxes({
            ...checkBoxes,
            [e.target.id]: e.target.checked
        });
    }

    const submitRecommendation = () => {
        // Get item ids of all items to add
        const checkedItems = [];
        const nonCheckedItems = [];
        for (let key in checkBoxes) {
            if (checkBoxes[key]) {
                checkedItems.push(key);
            }
            else {
                nonCheckedItems.push(key);
            }
        }

        async function updateRecommendedItems() {
            // Remove already recommended items to avoid dupes
            const itemsToAdd = checkedItems.filter(x => !request.recommendedItems.includes(x));
            const result = await RequestService.addRecommendedItems(request, itemsToAdd, requestUser);

            // if items were actually added
            console.log(itemsToAdd);
            if (itemsToAdd.length > 0) {
                // handle email notification or live notification here
                // if any items have actually been added, notify user
                const message = { name: authUser.user.user.name, recipient: requestUser.email, msg: "request_additems", request_obj: request };
                console.log(message);
                SocketService.emit('emitRequestAddItem',
                    message);

                const newUser = await UserService.getUserData(requestUser._id)
                if (newUser.data.isNotification) await EmailService.sendEmailRedirection(authUser, requestUser, `${authUser.user.user.name} has recommended item(s) for your item request "${request.name}"!`, `http://localhost:3000/display-request-post/${request._id}`);
            }

            // Remove already non-recommended items to avoid dupes
            const itemsToRemove = nonCheckedItems.filter(x => request.recommendedItems.includes(x));
            const result2 = await RequestService.deleteRecommendedItems(request, itemsToRemove);
            const final_result = result.concat(result2);
            if (final_result.every((item) => item.success)) {
                alert("Recommended items updated successfully.");

                // to refresh recommended items list
                window.location.reload(false);
                // TODO THIS BREAKS THE LIVE NOTIFS
            }
            else {
                alert("Recommended items failed to update. Sorry.");
            }
        }
        updateRecommendedItems();
    }

    const ItemBig = (itemData) => {
        const BottomComponent = () => {
            return (<div>lol</div>);
        }

        return (
            <div className='item-big'>
                <Post post={itemData} isRequest={false} key={itemData._id} BottomComponent={BottomComponent}></Post>
                <div className='recommend-div'>
                    <label>Recommend this item&nbsp;
                        <input type="checkbox" onChange={toggleCheckbox} key={itemData._id} id={itemData._id} name={itemData.name} checked={checkBoxes[itemData._id]}></input>
                    </label>
                </div>
            </div>
        );
    }

    const ItemSmall = (itemData) => {
        let itemDescription = itemData.description;
        if (itemDescription.length > 20) {
            itemDescription = itemDescription.substring(0, 17) + "...";
        }

        return (
            <div className="item-small" key={itemData._id}>
                <NavLink to={"/selected-item-post/" + itemData._id} className="lessStyledLink">{itemData.name}</NavLink>

                <p className="item-descr">{itemDescription}</p>

                <label>Recommend this item&nbsp;
                    <input type="checkbox" onChange={toggleCheckbox} key={itemData._id} id={itemData._id} name={itemData.name} checked={checkBoxes[itemData._id]}></input>
                </label>
            </div>
        );
    }

    // Render list of user's items from userItems (a list of item data jsons)
    // Only use this function if user's logged in + authorized
    const displayUserItems = () => {
        if (!itemsLoaded) {
            return <LoadingSmall />
        }
        if (userItems.length === 0) {
            return <p>You have no items!</p>
        }

        // Actually display items, according to view
        if (itemView === "small") {
            return userItems.map(itemData => ItemSmall(itemData));
        }
        if (itemView === "big") {
            return userItems.map(itemData => ItemBig(itemData));
        }
    }

    const YourItemList = () => {
        if (authUser.user.isAuth) { // if logged in

            // if request creator and currently logged in user are different people
            if (authUser.user.user._id !== request.ownerID) {
                return (
                    <div className="basicBorderDiv m-3">
                        <div>
                            <p className="yellowText">Which items would you like to recommend for this request?</p>
                            <button className="defaultButton" onClick={switchView}>Switch View</button>
                        </div>

                        {displayUserItems()}

                        <button className="defaultButton" onClick={submitRecommendation}>Submit</button>
                    </div>
                )
            }

            // if request belongs to currently logged in user
            return (
                <div className="basicBorderDiv m-3">
                    <p>This is your request, so you can't recommend any items for it.</p>
                </div>
            )
        }

        // if user is not logged in
        return (
            <div className="basicBorderDiv m-3">
                <p>You are not logged in, so you can't try to fulfill this request!</p>
            </div>
        )
    }

    /* --- What to return/render --- */

    if (!Object.keys(request).length) { // if request hasn't loaded
        return <Loading />;
    }
    return (
        <div>
            <div className="m-3 font-bold yellowText">
                <h2>{isEditing ? 'Modify Item Request' : 'View Item Request'}</h2>
            </div>

            <EditButtonHeader />
            <div className='basicBorderDiv m-3'>
                <label htmlFor='name' className="font-bold yellowText">Name: </label>
                <input className="mt-1 px-2 rounded-md inputNoOutline" id="name" type="text" value={request.name} name="name" readOnly={isEditing ? false : true} style={isEditing ? { background: "#f1f1f1", color: "black" } : { background: "none", color: "#545454" }} onChange={onRequestChange} />
                <p className="input-error">{inputErrors.name}</p>

                <p>
                    <span className="font-bold yellowText">Created by: </span>

                    {(!Object.keys(requestUser).length) ? // if request poster hasn't loaded
                        "Loading..." :
                        <NavLink to={"/user/" + requestUser._id} className="lessStyledLink">{requestUser.name}</NavLink>
                    }

                    <span className="font-bold yellowText"> on </span>
                    {new Date(request.dateCreated).toLocaleString()}
                </p>

                <textarea className="mt-1 border rounded-md w-full text-sm block px-3 py-2 inputNoOutline" id="description" type="text" value={request.description} readOnly={isEditing ? false : true} rol={10} style={isEditing ? { background: "#f1f1f1", color: "black" } : { background: "none", color: "#545454" }} onChange={onRequestChange} />
                <p className="input-error">{inputErrors.description}</p>
            </div>

            <LinkedItemList />

            <YourItemList />
        </div >
    )
}

export default DisplayRequestPost;