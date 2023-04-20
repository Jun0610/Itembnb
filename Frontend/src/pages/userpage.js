import React, { useEffect, useContext, useState } from "react";
import { NavLink, Link, useNavigate, useParams } from 'react-router-dom';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { confirmAlert } from 'react-confirm-alert';
import ReactMarkdown from 'react-markdown';

import userContext from '../contexts/userContext';
import UserService from '../tools/userService';
import ItemService from '../tools/itemsService';
import RequestService from '../tools/requestService';
import ReviewService from '../tools/reviewService';
import SocketService, { socket } from '../tools/socketService';
import Post from "../components/post";
import RatingStar from "../components/ratingStar.js";
import { ReviewOnSubjectPage, ReviewOnReviewerPage } from "../components/reviewComponents.js";
import { Loading, LoadingSmall } from "../components/Loading";

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
    const stars = [1, 2, 3, 4, 5]; // for filtering
    const [originalReviewsForUser, setOriginalReviewsForUser] = useState([]); // TODO implement
    const [originalReviewsByUser, setOriginalReviewsByUser] = useState(null); // TODO implement
    const [borrowerRating, setBorrowerRating] = useState("...");
    const [lenderRating, setLenderRating] = useState("..."); // TODO implement

    useEffect(() => {
        async function fetchData() {
            // load user info (minus items/requests)
            let userInfoData = await UserService.getUserData(id);
            userInfoData = userInfoData.data;
            setUserInfo(userInfoData);

            // load user items
            // must use userInfoData instead of userInfo or it doesn't load because of how await works
            const userItemData = await ItemService.getItemsFromList(userInfoData.postedItems);
            console.log(userItemData);
            setUserItems(userItemData);

            // load user requests
            const userRequestData = await RequestService.getRequestsFromList(userInfoData.requestPosts);
            setUserRequests(userRequestData);
        }
        fetchData();

        const getUserReviews = async () => {
            // get reviews for this user
            const reviewsForUser = await ReviewService.getReviewsForUser(id);
            console.log(reviewsForUser);
            setOriginalReviewsForUser(reviewsForUser.data);
            setBorrowerRating(reviewsForUser.rating);

            // get reviews made by this user
            const reviewsByUser = await ReviewService.getReviewsByUser(id);
            setOriginalReviewsByUser(reviewsByUser.data);
        }
        getUserReviews();

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
    // TODO - return true only if user can be reviewed
    const canBeReviewed = () => {
        return false;
        return (
            authUser.user.user !== null && // user must be logged in
            authUser.user.user._id !== id // user must not be viewing their own profile
        );
    }

    // Reviews of user (as borrower)
    const DisplayReviewsOfUser = ({ originalReviewsForUser }) => {

        const [displayedReviewsForUser, setDisplayedReviewsForUser] = useState(originalReviewsForUser);

        const filterReviews = (starNum) => {
            setDisplayedReviewsForUser(originalReviewsForUser.filter((e) => e.review.rating === starNum));
        }

        const resetFilter = () => {
            setDisplayedReviewsForUser(originalReviewsForUser);
        }

        if (originalReviewsForUser === null) {
            return <LoadingSmall />;
        }
        if (originalReviewsForUser.length === 0) {
            return <p className="grayText">There are no reviews!</p>;
        }
        return (
            <div>
                <div className='flex gap-4'>
                    {stars.map((starNum, i) => (
                        <div onClick={() => filterReviews(starNum)} className="items-center font-medium text-sm p-2 bg-yellow-100 rounded-lg" style={{ cursor: "pointer" }} key={i}>
                            {starNum}-star
                        </div>
                    ))}
                    <div onClick={resetFilter} className="items-center font-medium text-sm p-2 bg-yellow-100 rounded-lg" style={{ cursor: "pointer" }}>
                        Reset
                    </div>
                </div>

                {displayedReviewsForUser.length > 0 ?
                    displayedReviewsForUser.map((e, i) => (
                        <ReviewOnSubjectPage key={i} reviewObject={e} authUser={authUser} />
                    )) :
                    <p className="grayText">There are no reviews!</p>
                }
            </div>
        );
    }

    // Reviews user has made
    const DisplayReviewsMadeByUser = ({ originalReviewsByUser }) => {

        const [displayedReviewsByUser, setDisplayedReviewsByUser] = useState(originalReviewsByUser);

        const filterReviews = (starNum) => {
            setDisplayedReviewsByUser(originalReviewsByUser.filter((e) => e.review.rating === starNum));
            console.log(displayedReviewsByUser);
        }

        const resetFilter = () => {
            setDisplayedReviewsByUser(originalReviewsByUser);
        }

        if (originalReviewsByUser == null) {
            return <LoadingSmall />;
        }
        if (originalReviewsByUser.length === 0) {
            return <p className="grayText">There are no reviews!</p>
        }

        console.log("display", displayedReviewsByUser);
        console.log("display 2 ", originalReviewsByUser);

        return (
            <div>
                <div className='flex gap-4'>
                    {stars.map((starNum, i) => (
                        <div onClick={() => filterReviews(starNum)} className="items-center font-medium text-sm p-2 bg-yellow-100 rounded-lg" style={{ cursor: "pointer" }} key={i}>
                            {starNum}-star
                        </div>
                    ))}
                    <div className="items-center font-medium text-sm p-2 bg-yellow-100 rounded-lg" onClick={resetFilter} style={{ cursor: "pointer" }}>
                        Reset
                    </div>
                </div>

                {displayedReviewsByUser.length > 0 ?
                    displayedReviewsByUser.map((e, i) => (
                        <ReviewOnReviewerPage key={i} reviewObject={e} />
                    )) :
                    <p className="grayText">There are no reviews!</p>
                }
            </div>
        );
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
            if (userInfo.profileDesc === null || userInfo.profileDesc === "") {
                return <p className="grayText"><strong>This user has no profile description.</strong></p>;
            }
            else {
                return (<div className="p-3" style={{ "max-height": "600px", "overflow-y": "scroll" }}>
                    <ReactMarkdown>{userInfo.profileDesc}</ReactMarkdown>
                </div>);
            }
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
                    <img for="photo-upload" src={src} alt="Upload here" />
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

                    {displayProfileDescription()}
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
            return <p className="grayText">{userInfo.name} has no items!</p>
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
            return <p className="grayText">{userInfo.name} has no requests!</p>
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
                    <img id="profilepic" src={userInfo.profilePic} alt="Profile" />

                    <h6 className="user_stat">Borrower Rating: <RatingStar rating={borrowerRating} /></h6>
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

                <br />

                <h3 className="item-post-header">{userInfo.name}'s Item Requests</h3>
                <div className="cardcontainer">
                    {displayUserRequests()}
                </div>

                <div>
                    <h3 className="item-post-header">Reviews of {userInfo.name}</h3>
                    <DisplayReviewsOfUser originalReviewsForUser={originalReviewsForUser} />

                    <h3 className="item-post-header">Reviews Made By {userInfo.name}</h3>
                    <DisplayReviewsMadeByUser originalReviewsByUser={originalReviewsByUser} />
                </div>
            </div>
        </div>
    );

};

export default Userpage;