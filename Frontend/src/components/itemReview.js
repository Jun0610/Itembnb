import React, { useContext, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/post.css';
import { NavLink } from 'react-router-dom';
import ReviewService from "../tools/reviewService";

const ItemReview = ({ reviewObject, authUser }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [localReview, setLocalReview] = useState(null);

    // edit owner review
    const editOwnerReview = () => {
        const updateReview = async () => {
            // update in database and frontend
            localReview.dateModified = new Date(Date.now());
            await ReviewService.updateReview(localReview);
            setIsEditing(false);
            setLocalReview(null);
            alert("Successfully edited your review!");
        }

        console.log("clicked " + isEditing);
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

    const onDeleteReview = (reviewObject) => {
        const deleteReview = async (idx) => {
            await ReviewService.deleteReview(reviewObject.review._id, reviewObject.review.itemId)
            // setItemReviews(itemReviews.filter((_, i) => idx !== i))
            alert("Successfully deleted your review!");
        }
        // deleteReview(idx);
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

        if (reviewObject.user._id === authUser.user.user._id) {
            return (
                <div className="flex justify-end gap-4">
                    {cancelEditButton}

                    <button className={isEditing ? "place-self-end fa-solid fa-save mt-1 icon-3x" : "place-self-end fa-solid fa-pencil mt-1 icon-3x"} onClick={editOwnerReview}></button>

                    <button className="fa-solid fa-trash mt-1 icon-3x" onClick={() => { onDeleteReview(reviewObject) }}></button>
                </div>
            );
        }
        else {
            return <div></div>;
        }
    }

    return (
        <div key={reviewObject.review._id} className="grid border-2 rounded-3xl border-yellow-400 m-2 p-2">
            <div className="grid grid-cols-3 justify-start">
                <div>
                    <NavLink to={"/user/" + reviewObject.user._id}>
                        <img src={reviewObject.user.profilePic} alt="" className="object-scale-down h-16" style={{ cursor: "pointer" }} />
                    </NavLink>
                </div>
                <div className="grid grid-rows-2 ml-2">
                    <div>
                        <NavLink to={"/user/" + reviewObject.user._id} className="lessStyledLink">
                            {reviewObject.user.name}
                        </NavLink>
                    </div>
                    <div>
                        {new Date(reviewObject.review.dateModified).toDateString()}
                    </div>
                </div>
                {
                    reviewObject.user._id === authUser.user.user._id && isEditing ?
                        <div>
                            <input id="rating" className="mt-1 border border-slate-300 py-2 rounded-md" type="number" min="1" max="5" value={localReview.rating} onChange={onInputChange} />
                        </div>
                        :
                        <div className="justify-self-end">
                            {reviewObject.review.rating}/5
                        </div>
                }
            </div>
            {
                // Review Textbox (editable)
                reviewObject.user._id === authUser.user.user._id && isEditing ?
                    < div >
                        <input id="reviewTxt" className="mt-1 block border border-slate-300 w-full py-2 rounded-md" type="text" value={localReview.reviewTxt} onChange={onInputChange} />
                    </div>
                    :
                    <div className="mt-3">
                        {reviewObject.review.reviewTxt}
                    </div>
            }
            {editReviewButtons()}
        </div >
    );
};

export default ItemReview;

