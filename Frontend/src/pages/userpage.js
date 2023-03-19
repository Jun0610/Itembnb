import React, { useEffect, useContext, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

import ItemService from '../tools/itemsService';
import RequestService from '../tools/requestService';
import UserService from '../tools/userService.js';

import { confirmAlert } from 'react-confirm-alert'; // Import
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Loading from "../components/Loading";
import Post from "../components/post";
import userContext from '../contexts/userContext';

import "../styles/homepage.css";
import "../styles/userpage.css";

const Userpage = () => {
    const authUser = useContext(userContext);
    const { id } = useParams(); // id of user on webpage


    /* --- Fetching info from server --- */

    // Get user info from the server
    const [userInfo, setUserInfo] = useState({});
    const [userLoaded, setUserLoaded] = useState(false);

    // Get user's posted items from the server
    // Get user's posted items from the server
    const [userItems, setUserItems] = useState([]);
    const [itemsLoaded, setItemsLoaded] = useState(false);

    // Get user's requested items from the server
    const [userRequests, setUserRequests] = useState([]);
    const [requestsLoaded, setRequestsLoaded] = useState(false);

    // optimal way to fetch with arrays: combine Promise.all + map w/ async function
    async function loadUserItems(userInfo) {
        if (userInfo.postedItems.length === 0) {
            return <p>{userInfo.name} has no items!</p>
        }
        return Promise.all(userInfo.postedItems.map(async (id, index) => {
            const itemData = await ItemService.getItem(id);
            if (itemData !== undefined && itemData.success) {
                // if this doesn't work check if object is in itemData or itemData.data
                console.log("item data: ", itemData.data);
                if (itemData && itemData.data) return <Post post={itemData.data} isRequest={false} key={itemData.data._id} />;
            }
            //return "Error!"; // should NOT HAPPEN - happens if return new Promise is not used in ItemService.getItem ?
        }));
    }

    async function loadUserRequests(userInfo) {
        if (userInfo.requestPosts.length === 0) {
            return <p>{userInfo.name} has no item requests!</p>
        }
        return Promise.all(userInfo.requestPosts.map(async id => {
            const request = await RequestService.getRequest(id);
            return <Post post={request} isRequest={true} key={request._id} />;
        }));
    }

    useEffect(() => {

        async function fetchData() {
            // load user info (minus items/requests)
            let userInfo = await UserService.getUserData(id);
            userInfo = userInfo.data;
            setUserInfo(userInfo);
            setUserLoaded(true);

            // load user items
            const userItems = await loadUserItems(userInfo);
            setUserItems(userItems);
            setItemsLoaded(true);

            // load user requests
            const userRequests = await loadUserRequests(userInfo);
            setUserRequests(userRequests);
            setRequestsLoaded(true);
        }

        fetchData();
    }, []);

    /* --- Profile editing functionality --- */

    const ProfileHeader = () => {
        const navigate = useNavigate(); // for redirect to homepage

        const logout = () => {
            sessionStorage.removeItem('curUser')
            authUser.logout();
        };

        const handleDeleteUser = () => {

            console.log("deletion message");
            confirmAlert({
                name: 'Confirm to delete',
                message: "Are you sure you want to delete your account? Everything will be lost. This is irrevocable.",
                buttons: [
                    {
                        label: 'Yes',
                        onClick: () => {
                            async function fetchDeleteUser() {
                                const deleteResult = await UserService.deleteUser(id);
                                console.log("deleteresult", deleteResult);
                                if (deleteResult.success) {
                                    alert("Deletion successful.");
                                    logout();
                                    return navigate("/");
                                }
                            }
                            fetchDeleteUser();
                        }
                    },
                    {
                        label: 'No',
                        onClick: () => { },
                    }
                ],
            });
        }

        const [isEditing, setIsEditing] = useState(false);

        const [imagePreview, setImagePreview] = useState(userInfo.profilePic);
        // equivalent of userInfo but just for ProfileHeader so it doesn't update everything else when you change stuff
        const [localUserInfo, setLocalUserInfo] = useState(userInfo);

        // object that stores error messages for invalid inputs
        const [inputErrors, setInputErrors] = useState({ name: [], profileDesc: [] });

        const handleEditProfile = () => {
            async function sendData() {
                const result = await UserService.editProfile(localUserInfo, id);
                console.log("result", result);

                if (result.success) {
                    setUserInfo(localUserInfo);
                    setIsEditing(false);

                    // to refresh navbar avatar image - todo find better way
                    window.location.reload();
                }
            }

            if (isEditing) {
                if (noInputErrors()) {
                    sendData();
                }
            }
            else {
                setIsEditing(true);
            }
        }

        const handleEditCancel = () => {
            setLocalUserInfo(userInfo);
            setInputErrors({ name: [], profileDesc: [] });
            setIsEditing(false);
        }

        const onProfileChange = (e) => {
            setLocalUserInfo({
                ...localUserInfo,
                [e.target.id]: e.target.value
            });

            validateField(e.target.id, e.target.value);
        }

        const validateField = (fieldId, fieldValue) => {
            if (fieldId === "name" && fieldValue.length > 20) {
                setInputErrors({
                    ...inputErrors,
                    [fieldId]: [fieldId + " cannot be more than 20 characters long!"]
                });
            }
            else if (fieldId === "name" && fieldValue.length === 0) {
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

        const displayProfileDescription = () => {
            console.log(userInfo.profileDesc);
            if (userInfo.profileDesc === "") {
                return "This user has no profile description.";
            }
            return userInfo.profileDesc;
        }

        const handleImageChange = (e) => {
            if (e.target.files && e.target.files[0]) {
                let img = e.target.files[0];
                setImagePreview(URL.createObjectURL(img));

                let reader = new FileReader();
                reader.readAsDataURL(img);
                reader.onload = () => {
                    setLocalUserInfo({
                        ...localUserInfo,
                        profilePic: reader.result
                    });
                };
            }
        };

        const ImgUpload = ({
            onChange,
            src
        }) =>
            <label htmlFor="photo-upload" className="custom-file-upload fas">
                <div className="img-wrap" >
                    <img for="photo-upload" src={src} alt="upload image here" />
                </div>
                <input id="photo-upload" type="file" onChange={onChange} />
            </label>

        if (isEditing) {
            return (
                <div className="add_padding">
                    <h1>Editing Your Profile</h1>

                    <div className="add_padding">
                        <button className="hover:bg-orange-200 text-white font-bold py-2 px-4 rounded-full m-2" onClick={() => handleEditProfile()}>Save Changes</button>
                        <button className="hover:bg-orange-200 text-white font-bold py-2 px-4 rounded-full m-2" onClick={() => handleEditCancel()}>Cancel</button>
                        <button className="hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full m-2" onClick={() => handleDeleteUser()}>Delete Account</button>
                    </div>

                    <label className="font-bold" style={{ color: "#F0D061" }}>Avatar (click to upload)</label>
                    <div id="center-img">
                        <ImgUpload onChange={handleImageChange} src={imagePreview} />
                    </div>

                    <div className="flex-none">
                        <label htmlFor="name" className="font-bold" style={{ color: "#F0D061" }}>Name</label>
                        <p className="input-error">{inputErrors.name}</p>
                        <input className="mt-1 block px-3 border border-slate-300 py-2 rounded-md text-sm shadow-sm placeholder-slate-400 bg-white" id="name" type="text" value={localUserInfo.name} onChange={onProfileChange} name="name" />
                    </div>

                    <br />

                    <div className="flex-auto">
                        <label htmlFor="profileDesc" className="font-bold" style={{ color: "#F0D061" }}>Profile Description</label>
                        <p className="input-error">{inputErrors.profileDesc}</p>
                        <textarea className="mt-1 border border-slate-300 rounded-md w-full text-sm shadow-sm placeholder-slate-400 block px-3 py-8 bg-white" id="profileDesc" rol={10} value={localUserInfo.profileDesc} onChange={onProfileChange} name="profileDesc" />
                    </div>
                </div>)
        }
        else {
            return (
                <div className="add_padding">
                    <h1>Profile - {userInfo.name}</h1>

                    {(authUser.isAuth && authUser.user.user._id === userInfo._id) &&
                        (
                            <span>
                                <p><Link to="/favorite-items">Welcome, {userInfo.name}! See your favorite items!</Link></p>

                                <div className="add_padding">
                                    <button className="hover:bg-orange-200 text-white font-bold py-2 px-4 rounded-full m-2" onClick={() => handleEditProfile()}>Edit Profile</button>
                                </div>
                            </span>
                        )}

                    <p><strong>Profile Description: </strong>{userInfo.profileDesc ? userInfo.profileDesc : <em>This user has no profile description.</em>}</p>
                </div>)
        }
    }

    /* --- What to return/render --- */

    if (!userLoaded) {
        return (
            <Loading />
        )
    }
    return (
        <div id="page_content_container">
            <div id="profile_leftbox" className="add_padding">
                <div>
                    <img id="profilepic" src={userInfo.profilePic} />

                    <h6 className="user_stat">Borrower Rating: {userInfo.borrowerRating}/5</h6>
                    <h6 className="user_stat">Lender Rating: {userInfo.lenderRating}/5</h6>
                    <hr />
                    <h6 className="user_stat">{userInfo.name} has {userInfo.postedItems.length} items</h6>
                    <h6 className="user_stat">{userInfo.name} has {userInfo.requestPosts.length} requests</h6>
                </div>
            </div>

            <div id="profile_main" className="add_padding">
                <ProfileHeader />

                <hr />

                <h3 className="item-post-header">{userInfo.name}'s Posted Items</h3>
                <div className="cardcontainer">
                    {itemsLoaded ? userItems : "Loading..."}
                </div>

                <h3 className="item-post-header">{userInfo.name}'s Item Requests</h3>
                <div className="cardcontainer">
                    {requestsLoaded ? userRequests : "Loading..."}
                </div>
            </div>
        </div>
    );

};

export default Userpage;