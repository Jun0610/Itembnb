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
import { SmallUserInfo, SmallItemInfo, UserInfo } from "../components/smallInfoBox";
import RatingStar from "../components/ratingStar.js";

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
    const [originalReview, setOriginalReview] = useState({});
    const [displayedReview, setDisplayedReview] = useState({});
    const [reviewSubject, setReviewSubject] = useState();
    const [isItemReview, setIsItemReview] = useState(false);

    // loading after submission of data
    const [loading, setLoading] = useState({ addItem: false });

    const [notifsOn, setNotifsOn] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const reviewDataObject = await ReviewService.getReview(reviewId);
            const reviewData = reviewDataObject.data;
            setOriginalReview(reviewData);
            setDisplayedReview(reviewData);

            if (reviewData.userId != "" && reviewData.itemId == "") {
                setIsItemReview(false);

                let subjectInfo = await UserService.getUserDataMin(reviewData.userId);
                setReviewSubject(subjectInfo);
            }
            else if (reviewData.itemId != "" && reviewData.userId == "") {
                setIsItemReview(true);

                let subjectInfo = await ItemService.getItemMin(reviewData.itemId);
                setReviewSubject(subjectInfo);
            }
            else {
                console.error("Improperly formatted review! " + reviewData);
            }

            const reviewerData = await UserService.getUserData(reviewData.reviewerId);
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
    const startingErrors = { name: [], text: [] };
    const [inputErrors, setInputErrors] = useState(startingErrors);

    const userIsReviewOwner = () => {
        return authUser != undefined &&
            authUser.user.user != null &&
            originalReview.reviewerId === authUser.user.user._id;
    }

    const onInputChange = (e) => {
        setDisplayedReview({
            ...displayedReview,
            [e.target.id]: e.target.value
        });
        validateField(e.target.id, e.target.value);
    }

    const handleDeleteRequest = () => {

        confirmAlert({
            name: 'Confirm to delete',
            message: "Are you sure you want to delete this review?",
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {

                        async function deleteRequest() {
                            const deleteResult = await ReviewService.deleteReview(originalReview._id);
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

    const handleEdit = () => {
        if (isEditing) {
            if (noInputErrors()) {

                const sendEdit = async () => {
                    const result = await ReviewService.updateReview(displayedReview);
                    if (result.success) {
                        setIsEditing(false);
                    }
                    else {
                        alert("An error occured. Edit failed. Sorry.");
                    }
                }
                sendEdit();

            }
        }
        else {
            setIsEditing(true);
        }
    }

    const cancelEdit = () => {
        setIsEditing(false);
        setDisplayedReview(originalReview);
        setInputErrors(startingErrors);
    }

    const validateField = (fieldId, fieldValue) => {
        if (fieldId === "rating") {
            if (fieldValue < 1 || fieldValue > 5) {
                setInputErrors({
                    ...inputErrors,
                    [fieldId]: [" Rating must be between 1 and 5!"]
                });
            }
            else {
                setInputErrors({
                    ...inputErrors,
                    [fieldId]: []
                });
            }
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
        if (userIsReviewOwner()) {
            return (
                <div className="m-4">
                    <button className="hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-sm m-2" style={{ backgroundColor: '#F7D65A' }} onClick={handleEdit}>{isEditing ? 'Save' : 'Edit'}</button>
                    {!isEditing ||
                        <button className="hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-sm m-2" style={{ backgroundColor: '#F7D65A' }} onClick={cancelEdit}>Cancel</button>}
                    <button className="hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-sm m-2" style={{ backgroundColor: '#F7D65A' }} onClick={handleDeleteRequest}>Delete</button>
                </div>
            )
        }
        return;
    }

    const ratingSection = () => {
        if (userIsReviewOwner() && isEditing) {
            return <input id="rating" className="mt-1 border border-slate-300 py-2 rounded-md" type="number" min="1" max="5" value={displayedReview.rating} onChange={onInputChange} />
        }
        else {
            return <RatingStar rating={displayedReview.rating} />
        }
    }

    /* --- REVIEW SUBJECT --- */

    const displayReviewSubject = () => {
        let divContents = "";

        if (reviewSubject == undefined) {
            divContents = <LoadingSmall />;
        }
        else {
            if (!isItemReview) {
                divContents = (
                    <UserInfo user={reviewSubject.data} />
                );
            }
            else if (isItemReview) {
                divContents = (
                    <Post post={reviewSubject.data} isRequest={false} />
                );
            }
        }

        return (
            <div className="m-2">
                {divContents}
            </div>
        );
    }

    /* --- What to return/render --- */

    if (!Object.keys(originalReview).length) { // if request hasn't loaded
        return <Loading />;
    }
    return (
        <div>
            <div className="m-3 font-bold yellowText">
                <h2>{isEditing ? 'Modify Review of' : 'Review of'}</h2>
            </div>

            {displayReviewSubject()}

            <div className='basicBorderDiv m-3'>

                <h4>{ratingSection()} <span className="input-error text-xs">{inputErrors.rating}</span></h4>

                <p>
                    <span className="font-bold yellowText">Review created by: </span>

                    {(!Object.keys(reviewer).length) ? // if request poster hasn't loaded
                        "Loading..." :
                        <NavLink to={"/user/" + reviewer._id} className="lessStyledLink">{reviewer.name}</NavLink>
                    }

                    <span className="font-bold yellowText"> on </span>
                    {new Date(displayedReview.dateCreated).toLocaleString()}
                </p>

                <textarea className="mt-1 border rounded-md w-full text-sm block px-3 py-2 inputNoOutline" id="text" type="text" value={displayedReview.text} readOnly={isEditing ? false : true} rol={10} style={isEditing ? { background: "#f1f1f1", color: "black" } : { background: "none", color: "#545454" }} onChange={onInputChange} />
                <p className="input-error">{inputErrors.text}</p>
            </div>


            <EditButtonHeader />
        </div >
    )
}

export default DisplayReview;