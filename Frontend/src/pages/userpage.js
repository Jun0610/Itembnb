import React, { useEffect, useContext, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import UserService from '../tools/userService';
import ItemService from '../tools/itemsService';
import RequestService from '../tools/requestService';
import { confirmAlert } from 'react-confirm-alert'; // Import
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Loading, LoadingSmall } from "../components/Loading";
import userContext from '../contexts/userContext';
import Post from "../components/post";

import "../styles/homepage.css";
import "../styles/userpage.css";

const Userpage = () => {
    const authUser = useContext(userContext);
    const { id } = useParams(); // id of user on webpage

    /* --- Fetching info from server --- */

    // Get user info from the server
    const [userInfo, setUserInfo] = useState({});
    const [userLoaded, setUserLoaded] = useState(false);

    // Get list of data jsons for user's posted items from the server
    const [userItems, setUserItems] = useState([]);
    const [itemsLoaded, setItemsLoaded] = useState(false);

    // Get list of data jsons for user's requests from the server
    const [userRequests, setUserRequests] = useState([]);
    const [requestsLoaded, setRequestsLoaded] = useState(false);


    useEffect(() => {
        async function fetchData() {
            // load user info (minus items/requests)
            let userInfoData = await UserService.getUserData(id);
            userInfoData = userInfoData.data;
            setUserInfo(userInfoData);
            setUserLoaded(true);

            // load user items
            // must use userInfoData instead of userInfo or it doesn't load because of how await works
            const userItemData = await ItemService.getItemsFromList(userInfoData.postedItems);
            setUserItems(userItemData);
            setItemsLoaded(true);

            // load user requests
            const userRequestData = await RequestService.getRequestsFromList(userInfoData.requestPosts);
            setUserRequests(userRequestData);
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
                        <button className="hover:bg-orange-200 text-white font-bold py-2 px-4 rounded-full m-2 user-page-btn" onClick={() => handleEditProfile()}>Save Changes</button>
                        <button className="hover:bg-orange-200 text-white font-bold py-2 px-4 rounded-full m-2 user-page-btn" onClick={() => handleEditCancel()}>Cancel</button>
                        <button className="hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full m-2 user-page-btn" onClick={() => handleDeleteUser()}>Delete Account</button>
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
                                    <button className="hover:bg-orange-200 text-white font-bold py-2 px-4 rounded-full m-2 user-page-btn" onClick={() => handleEditProfile()}>Edit Profile</button>
                                </div>
                            </span>
                        )}

                    <p><strong>Profile Description: </strong>{userInfo.profileDesc ? userInfo.profileDesc : <em>This user has no profile description.</em>}</p>
                </div>)
        }
    }

    /* --- What to return/render --- */

    // Render list of user's items from userItems (a list of item data jsons)
    const displayUserItems = () => {
        if (!itemsLoaded) {
            return <LoadingSmall />
        }
        if (userItems.length === 0) {
            return <p>{userInfo.name} has no items!</p>
        }
        return userItems.map(itemData =>
            <Post post={itemData} isRequest={false} key={itemData._id} />
        );
    }

    // Render list of user's requests from userRequests (a list of request data jsons)
    const displayUserRequests = () => {
        if (!requestsLoaded) {
            return <LoadingSmall />
        }
        if (userRequests.length === 0) {
            return <p>{userInfo.name} has no requests!</p>
        }
        return userRequests.map(request =>
            <Post post={request} isRequest={true} key={request._id} />
        );
    }

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
                    <h6 className="user_stat">{userInfo.name} has {userInfo.postedItems.length} {userInfo.postedItems.length === 1 ? "item" : "items"}</h6>
                    <h6 className="user_stat">{userInfo.name} has {userInfo.requestPosts.length} {userInfo.requestPosts.length === 1 ? "request" : "requests"}</h6>
                </div>
            </div>

            <div id="profile_main" className="add_padding">
                <ProfileHeader />

                <hr />

                <h3 className="item-post-header">{userInfo.name}'s Posted Items</h3>
                <div className="cardcontainer">
                    {displayUserItems()}
                </div>

                <h3 className="item-post-header">{userInfo.name}'s Item Requests</h3>
                <div className="cardcontainer">
                    {displayUserRequests()}
                </div>
            </div>
        </div>
    );

};

export default Userpage;