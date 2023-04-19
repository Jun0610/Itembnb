import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/post.css';
import '../styles/review.css';

import UserService from "../tools/userService.js";
import ItemService from "../tools/itemsService.js";
import ReviewService from "../tools/reviewService";
import { LoadingSmall } from "./Loading";
import { SmallUserInfo, SmallItemInfo } from "./smallInfoBox";
import { NavLink } from "react-router-dom";
import RatingStar from "../components/ratingStar.js";

export const ReviewOnSubjectPage = ({ reviewObject, authUser }) => {
    const userIsReviewOwner = () => {
        return authUser != undefined &&
            authUser.user.user != null &&
            reviewObject.user._id === authUser.user.user._id;
    }

    // Cancel Edit, Edit, Delete buttons
    // (only show up if you made the review)
    const editReviewButtons = () => {

        if (userIsReviewOwner()) {
            return (
                <div className="flex justify-end gap-4">
                    <NavLink className="lessStyledLink" to={`/display-review/` + reviewObject.review._id}><button className={"place-self-end fa-solid fa-pencil mt-1 icon-3x"}></button></NavLink>
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
                    <NavLink to={`/display-review/` + reviewObject.review._id} className="lessStyledLink">
                        {
                            reviewObject.review.rating + "/5"
                        }
                    </NavLink>
                </h5>
                <div>

                    <div>
                        {new Date(reviewObject.review.dateModified).toLocaleString()}
                    </div>

                    <div className="mt-3">
                        {reviewObject.review.text}
                    </div>
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

                let subjectInfo = await UserService.getUserDataMin(reviewObject.review.userId);
                setReviewSubject(subjectInfo);
            }
            else if (reviewObject.review.itemId != "" && reviewObject.review.userId == "") {
                setIsItemReview(true);

                let subjectInfo = await ItemService.getItemMin(reviewObject.review.itemId);
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

    return (
        <div key={reviewObject.review._id} className="border-2 rounded-3xl border-yellow-400 m-2 p-2">

            <h6><NavLink to={`/display-review/` + reviewObject.review._id} className="lessStyledLink">
                Review of {isItemReview ? "Item" : "Borrower"}
            </NavLink></h6>

            <div className="flex">
                <div>
                    {displayReviewSubject}
                </div>

                <div className="flex-1">
                    <div>
                        <h5><NavLink to={`/display-review/` + reviewObject.review._id} className="lessStyledLink">
                            {reviewObject.review.rating}/5
                        </NavLink></h5>
                    </div>
                    <div>
                        {new Date(reviewObject.review.dateModified).toLocaleString()}
                    </div>
                    <div className="mt-3">
                        {reviewObject.review.text}
                    </div>
                </div>

            </div>
        </div >
    );
}