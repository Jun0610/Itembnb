import React, { useEffect, useContext, useState } from "react";
import { NavLink, Link, useNavigate, useParams } from 'react-router-dom';
import userContext from '../contexts/userContext';
import { confirmAlert } from 'react-confirm-alert'; // Import
import { Loading, LoadingSmall } from "../components/Loading";
import Post from "../components/post";
import ItemReview from "../components/itemReview";

import UserService from '../tools/userService';
import ItemService from '../tools/itemsService';
import RequestService from '../tools/requestService';
import ReviewService from '../tools/reviewService';
import SocketService, { socket } from '../tools/socketService';

import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/homepage.css";
import "../styles/userpage.css";

const Userpage = () => {
    const authUser = useContext(userContext);
    const { id } = useParams(); // id of user on webpage

    /* --- Fetching info from server --- */

    // Get user info from the server
    const [userInfo, setUserInfo] = useState(null);

    // Get list of data jsons for user's posted items from the server
    const [userItems, setUserItems] = useState(null);

    // Get list of data jsons for user's requests from the server
    const [userRequests, setUserRequests] = useState(null);

    // for handling reviews/ratings
    const [reviewsForUser, setReviewsForUser] = useState(null);
    const [OGReviewsForUser, setOGReviewsForUser] = useState([]); // TODO implement
    const [borrowerRating, setBorrowerRating] = useState("...");
    const [lenderRating, setLenderRating] = useState("..."); // TODO implement
    const [reviewsByUser, setReviewsByUser] = useState(null); // TODO implement

    useEffect(() => {
        async function fetchData() {
            // load user info (minus items/requests)
            let userInfoData = await UserService.getUserData(id);
            userInfoData = userInfoData.data;
            setUserInfo(userInfoData);

            // load user items
            // must use userInfoData instead of userInfo or it doesn't load because of how await works
            const userItemData = await ItemService.getItemsFromList(userInfoData.postedItems);
            setUserItems(userItemData);

            // load user requests
            const userRequestData = await RequestService.getRequestsFromList(userInfoData.requestPosts);
            setUserRequests(userRequestData);
        }
        fetchData();

        async function connectSocket() {
            // check if user is logged in with sessionStorage, because checking authUser.user.isAuth doesn't work in useEffect
            const loggedInUser = JSON.parse(sessionStorage.getItem('curUser'));

            if (loggedInUser !== null) {
                // log in user automatically if session storage indicates they've already logged in, in another tab
                authUser.login(loggedInUser);

                SocketService.connect();
                socket.emit('sendId', JSON.parse(sessionStorage.getItem('curUser')).email);
            }
        }
        connectSocket();

    }, []);

    /* --- Review Section --- */

    // get borrower reviews + rating
    useEffect(() => {
        const getUserReviews = async () => {
            //get reservation data for user
            const reviews = await ReviewService.getReviewByUser(id);
            setReviewsForUser(reviews.data);
            setOGReviewsForUser(reviews.data);
            setBorrowerRating(reviews.rating);
        }
        getUserReviews();
    }, []);

    // TODO - return true only if user can be reviewed
    const canBeReviewed = () => {
        return (
            authUser.user.user != null && // user must be logged in
            authUser.user.user._id != id // user must not be viewing their own profile
        );
    }

    // Reviews of user (as borrower)
    const displayReviewsOfUser = () => {
        if (reviewsForUser == null) {
            return <LoadingSmall />;
        }
        return (
            <div>
                {reviewsForUser.length > 0 ?
                    reviewsForUser.map((e, i) => (
                        <ItemReview key={i} reviewObject={e} authUser={authUser} onDeleteReview={onDeleteReview} onEditReview={onEditReview} idx={i} />
                    )) :
                    <p>There are no reviews!</p>
                }
            </div>
        );
    }

    // Reviews user has made
    const displayReviewsMadeByUser = () => {
        if (reviewsByUser == null) {
            return <LoadingSmall />;
        }
        return (
            <div>
                {reviewsByUser.length > 0 ?
                    reviewsByUser.map((e, i) => (
                        <ItemReview key={i} reviewObject={e} authUser={authUser} onDeleteReview={console.log("delete")} onEditReview={console.log("edit")} idx={i} />
                    )) :
                    <p>There are no reviews!</p>
                }
            </div>
        );
    }

    // TODO
    const onEditReview = () => {
    }

    // TODO
    const onDeleteReview = () => {
    }

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
                        <button className="hover:bg-orange-400 text-white font-bold py-2 px-4 rounded-full m-2 user-page-btn" onClick={() => handleEditProfile()}>Save Changes</button>
                        <button className="hover:bg-orange-400 text-white font-bold py-2 px-4 rounded-full m-2 user-page-btn" onClick={() => handleEditCancel()}>Cancel</button>
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
                                <div className="add_padding">
                                    <button className="hover:bg-orange-400 text-white font-bold py-2 px-4 rounded-full m-2 user-page-btn" onClick={() => handleEditProfile()}>Edit Profile</button>

                                    <Link to="/settings">
                                        <button className="hover:bg-orange-400 text-white font-bold py-2 px-4 rounded-full m-2 user-page-btn">Account Settings</button>
                                    </Link>

                                    <Link to="/favorite-items">
                                        <button className="hover:bg-orange-400 text-white font-bold py-2 px-4 rounded-full m-2 user-page-btn">Favorite Items</button>
                                    </Link>
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
        if (userItems == null) {
            return <LoadingSmall />
        }
        if (userItems.length === 0) {
            return <p>{userInfo.name} has no items!</p>
        } else {
            const filteredUserItems = userItems.filter(item => item !== undefined)
            return filteredUserItems.map(itemData =>
                <Post post={itemData} isRequest={false} key={itemData._id} />
            );
        }

    }

    // Render list of user's requests from userRequests (a list of request data jsons)
    const displayUserRequests = () => {
        if (userRequests == null) {
            return <LoadingSmall />
        }
        if (userRequests.length === 0) {
            return <p>{userInfo.name} has no requests!</p>
        }
        return userRequests.map(request =>
            <Post post={request} isRequest={true} key={request._id} />
        );
    }

    if (userInfo == null) {
        return (
            <Loading />
        )
    }
    return (
        <div id="page_content_container">
            <div id="profile_leftbox" className="add_padding">
                <div>
                    <img id="profilepic" src={userInfo.profilePic} />

                    <h6 className="user_stat">Borrower Rating: {borrowerRating}/5</h6>
                    <h6 className="user_stat">Lender Rating: {userInfo.lenderRating}/5</h6>
                    <hr />
                    <h6 className="user_stat">{userInfo.name} has {userInfo.postedItems.length} {userInfo.postedItems.length === 1 ? "item" : "items"}</h6>
                    <h6 className="user_stat">{userInfo.name} has {userInfo.requestPosts.length} {userInfo.requestPosts.length === 1 ? "request" : "requests"}</h6>
                </div>
            </div>

            <div id="profile_main" className="add_padding">
                <ProfileHeader />

                {canBeReviewed() ?
                    <NavLink to={"/create-user-review/" + id} className="plainLink"><button className="defaultButton">Review this User</button></NavLink>
                    : <div></div>
                }

                <hr />

                <h3 className="item-post-header">{userInfo.name}'s Posted Items</h3>
                <div className="cardcontainer">
                    {displayUserItems()}
                </div>

                <h3 className="item-post-header">{userInfo.name}'s Item Requests</h3>
                <div className="cardcontainer">
                    {displayUserRequests()}
                </div>

                <h3 className="item-post-header">Reviews of {userInfo.name}</h3>
                {displayReviewsOfUser()}
            </div>
        </div>
    );

};

export default Userpage;