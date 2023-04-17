import React, { useEffect, useContext, useState } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import RequestService from '../tools/requestService';
import ItemService from '../tools/itemsService';
import ReviewService from '../tools/reviewService';
import UserService from '../tools/userService';
import { socket } from '../tools/socketService';
import SocketService from '../tools/socketService';
import EmailService from '../tools/emailService';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';
import userContext from '../contexts/userContext';
import { Loading, LoadingSmall } from "../components/Loading";
import Post from "../components/post";

import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/homepage.css";
import "../styles/requestPage.css";

const DisplayReview = () => {
    const navigate = useNavigate();
    const authUser = useContext(userContext);
    const { id: reviewId } = useParams(); // id of request post

    /* --- Fetching info from the server --- */

    // Get info of user who asked for request
    const [reviewer, setReviewer] = useState({});

    // Get request to be shown from the server
    const [review, setReview] = useState({});

    // loading after submission of data
    const [loading, setLoading] = useState({ addItem: false });

    const [notifsOn, setNotifsOn] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const reviewData = await ReviewService.getReview(reviewId);
            setReview(reviewData.data);

            const reviewerData = await UserService.getUserData(reviewData.data.reviewerId);
            setReviewer(reviewerData.data);

            // check if user is logged in with sessionStorage, because checking authUser.user.isAuth doesn't work in useEffect
            const loggedInUser = JSON.parse(sessionStorage.getItem('curUser'));

            if (loggedInUser !== null) {
                // log in user automatically if session storage indicates they've already logged in, in another tab
                authUser.login(loggedInUser);

                // if user is logged in, fetch their info

                // load user info (minus items)
                const userInfoData = await UserService.getUserData(loggedInUser._id);

                const res2 = await UserService.getNotificationStatus(loggedInUser._id);

                const settings = { email: userInfoData.data.email };
                if (res2.data === 'notifications-on') {
                    settings.all = true;
                }
                else {
                    settings.all = false;
                }

                SocketService.connect();
                socket.emit('sendId', JSON.parse(sessionStorage.getItem('curUser')).email);
            }
        }
        fetchData();

    }, []);

    /* --- For editing request --- */
    const [isEditing, setIsEditing] = useState(false);

    // object that stores error messages for invalid inputs
    const [inputErrors, setInputErrors] = useState({ name: [], text: [] });

    const onRequestChange = (e) => {
        setReview({
            ...review,
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
                            const deleteResult = await RequestService.deleteRequest(review, authUser.user.user._id);
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
                RequestService.editRequest(review, authUser.user.user._id);
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
        if ((authUser.user.isAuth) && (authUser.user.user._id === review.ownerID)) {
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

    /* --- What to return/render --- */

    if (!Object.keys(review).length) { // if request hasn't loaded
        return <Loading />;
    }
    return (
        <div>
            <div className="m-3 font-bold yellowText">
                <h2>{isEditing ? 'Modify Review' : 'View Review'}</h2>
            </div>

            <EditButtonHeader />
            <div className='basicBorderDiv m-3'>

                <p>
                    <span className="font-bold yellowText">Created by: </span>

                    {(!Object.keys(reviewer).length) ? // if request poster hasn't loaded
                        "Loading..." :
                        <NavLink to={"/user/" + reviewer._id} className="lessStyledLink">{reviewer.name}</NavLink>
                    }

                    <span className="font-bold yellowText"> on </span>
                    {new Date(review.dateCreated).toLocaleString()}
                </p>

                <textarea className="mt-1 border rounded-md w-full text-sm block px-3 py-2 inputNoOutline" id="text" type="text" value={review.text} readOnly={isEditing ? false : true} rol={10} style={isEditing ? { background: "#f1f1f1", color: "black" } : { background: "none", color: "#545454" }} onChange={onRequestChange} />
                <p className="input-error">{inputErrors.text}</p>
            </div>
        </div >
    )
}

export default DisplayReview;