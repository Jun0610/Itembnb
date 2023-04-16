import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/post.css';
import '../styles/review.css';

import UserService from "../tools/userService.js";
import ItemService from "../tools/itemsService.js";
import ReviewService from "../tools/reviewService";
import { LoadingSmall } from "./Loading";
import { SmallUserInfo, SmallItemInfo } from "./smallInfoBox";

export const ReviewOnSubjectPage = ({ reviewObject, authUser, onDeleteReview, onEditReview, idx }) => {
    const [isEditing, setIsEditing] = useState(false);

    // local copy of the review that the user edits when isEditing = true
    const [localReview, setLocalReview] = useState(null);

    const userIsReviewOwner = () => {
        return authUser != undefined &&
            authUser.user.user != null &&
            reviewObject.user._id === authUser.user.user._id;
    }

    // edit owner review
    const editOwnerReview = () => {
        const updateReview = async () => {
            // update in database and frontend
            localReview.dateModified = new Date(Date.now());
            await ReviewService.updateReview(localReview);
            reviewObject.review = localReview
            onEditReview(reviewObject.review, idx)
            setIsEditing(false)
            setLocalReview(null);
            alert("Successfully edited your review!");
        }

        if (isEditing) {
            updateReview();
        }
        else {
            setIsEditing(true);
            setLocalReview(reviewObject.review);
        }
    }

    const cancelEdit = () => {
        setIsEditing(false);
        setLocalReview(null);
    }

    const onInputChange = (e) => {
        setLocalReview({
            ...localReview,
            [e.target.id]: e.target.value
        });
    }

    // Cancel Edit, Edit, Delete buttons
    // (only show up if you made the review)
    const editReviewButtons = () => {
        let cancelEditButton = "";
        if (isEditing) {
            cancelEditButton =
                <button className={isEditing ? "place-self-end fa-solid fa-xmark mt-1 icon-3x" : "place-self-end fa-solid fa-border-none mt-1 icon-3x"} onClick={cancelEdit}></button>
                ;
        }

        if (userIsReviewOwner()) {
            return (
                <div className="flex justify-end gap-4">
                    {cancelEditButton}

                    <button className={isEditing ? "place-self-end fa-solid fa-save mt-1 icon-3x" : "place-self-end fa-solid fa-pencil mt-1 icon-3x"} onClick={editOwnerReview}></button>

                    <button className="fa-solid fa-trash mt-1 icon-3x" onClick={() => onDeleteReview(reviewObject, idx)}></button>
                </div>
            );
        }
        else {
            return <div></div>;
        }
    }

    return (
        <div key={reviewObject.review._id} className="border-2 rounded-3xl border-yellow-400 m-2 p-2 flex">

            <SmallUserInfo user={reviewObject.user} />

            <div className="flex-auto">
                <h5>
                    {
                        userIsReviewOwner() && isEditing ?
                            <input id="rating" className="mt-1 border border-slate-300 py-2 rounded-md" type="number" min="1" max="5" value={localReview.rating} onChange={onInputChange} />
                            :
                            reviewObject.review.rating + "/5"
                    }
                </h5>
                <div>

                    <div>
                        {new Date(reviewObject.review.dateModified).toDateString()}
                    </div>


                    {
                        // Review Textbox (editable)
                        userIsReviewOwner() && isEditing ?
                            < div >
                                <input id="text" className="mt-1 block border border-slate-300 w-full py-2 rounded-md" type="text" value={localReview.text} onChange={onInputChange} />
                            </div>
                            :
                            <div className="mt-3">
                                {reviewObject.review.text}
                            </div>
                    }
                </div>

                {editReviewButtons()}
            </div>
        </div >
    );
};

// Display a single review this user has made
export const ReviewOnReviewerPage = ({ reviewObject }) => {
    // Get info about what is reviewed from database
    const [reviewSubject, setReviewSubject] = useState();
    const [isItemReview, setIsItemReview] = useState(false);
    useEffect(() => {
        async function getReviewSubject() {
            console.log("Get Review Subject");
            if (reviewObject.review.userId != "" && reviewObject.review.itemId == "") {
                setIsItemReview(false);

                let subjectInfo = await UserService.getUserData(reviewObject.review.userId);
                setReviewSubject(subjectInfo);
            }
            else if (reviewObject.review.itemId != "" && reviewObject.review.userId == "") {
                setIsItemReview(true);

                let subjectInfo = await ItemService.getItem(reviewObject.review.itemId);
                setReviewSubject(subjectInfo);
            }
            else {
                console.error("Improperly formatted review! " + reviewObject.review);
            }
        }
        getReviewSubject();
    }, []);

    let displayReviewSubject = "";
    if (reviewSubject == undefined) {
        displayReviewSubject = <LoadingSmall />;
    }
    else {
        if (!isItemReview) {
            displayReviewSubject = (
                <SmallUserInfo user={reviewSubject.data} />
            );
        }
        else if (isItemReview) {
            displayReviewSubject = (
                <SmallItemInfo item={reviewSubject.data} />
            );
        }
    }

    console.log("review on userPage");
    return (
        <div key={reviewObject.review._id} className="border-2 rounded-3xl border-yellow-400 m-2 p-2">

            <h6>Reviewed {isItemReview ? "Item" : "Borrower"}</h6>

            <div className="flex">
                <div>
                    {displayReviewSubject}
                </div>

                <div className="flex-1">
                    <div>
                        <h5>{reviewObject.review.rating}/5</h5>
                    </div>
                    <div>
                        {new Date(reviewObject.review.dateModified).toDateString()}
                    </div>
                    <div className="mt-3">
                        {reviewObject.review.text}
                    </div>
                </div>

            </div>
        </div >
    );
}