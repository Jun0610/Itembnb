import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink, useParams } from "react-router-dom";
import ReviewService from "../tools/reviewService";
import userContext from '../contexts/userContext';
import UserService from "../tools/userService";
import UserInfo from "../components/userInfo";
import Post from "../components/post";

import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/homepage.css";

const CreateUserReview = () => {
    const { userId } = useParams(); // id of selected borrower
    const navigate = useNavigate();

    const authUser = useContext(userContext);

    const blankReview = {
        rating: 5,
        text: "Enter your review here!",
        reviewerId: "",
        itemId: "",
        userId: userId
        /* these get changed in reviewService.postReview
        dateModified: '',
        dateCreated: '',
        */
    };

    const [user, setSelectedUser] = React.useState({});
    const [review, setReview] = React.useState(blankReview);
    const startingErrors = { text: [], rating: [] };
    const [inputErrors, setInputErrors] = React.useState(startingErrors);

    //make sure user is logged in and get user details
    useEffect(() => {

        const fetchData = async () => {
            const dataObject = await UserService.getUserData(userId);
            setSelectedUser(dataObject.data);
        }

        fetchData();

    }, [])

    const handleReview = (e) => {
        setReview({
            ...review,
            [e.target.id]: e.target.value,
        });
        validateField(e.target.id, e.target.value);
    }

    const getErrors = (fieldId, fieldValue) => {
        const errorArray = [];

        if (fieldId == "text" && fieldValue.length === 0) {
            errorArray.push(fieldId + " must have at least 1 character!");
        }
        else if (fieldId == "rating" && (fieldValue < 1 || fieldValue > 5)) {
            errorArray.push(fieldId + " must be from 1-5!");
        }

        return errorArray;
    }

    const validateField = (fieldId, fieldValue) => {
        setInputErrors({
            ...inputErrors,
            [fieldId]: getErrors(fieldId, fieldValue)
        });
    }

    // show error messages by default with useEffect
    // setstate with new object instead of calling validateField in loop
    // because setInputErrors relies on the previous value of inputErrors from the last render (I think)
    // therefore calling validateField in a loop only updates the error message for the last field, not all of them, because it uses the empty inputErrors as default
    const validateAllFields = () => {
        let newInputErrors = startingErrors;
        for (let key in newInputErrors) {
            newInputErrors[key] = getErrors(key, review[key]);
        }
        setInputErrors(newInputErrors);
    }

    // check that every error array in inputErrors is empty
    // from https://stackoverflow.com/questions/27709636/determining-if-all-attributes-on-a-javascript-object-are-null-or-an-empty-string 
    const noInputErrors = () => {
        return Object.values(inputErrors).every(x => x.length === 0);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (noInputErrors()) {
            console.log("creation of " + review);
            review.reviewerId = authUser.user.user._id;
            await ReviewService.postReview(review, authUser.user.user._id).then((res) => {
                alert("Review successfully posted!");
                setReview(blankReview);
            });
        }
    }

    // show error messages by default
    if (inputErrors === startingErrors) {
        validateAllFields();
    }

    if (authUser.user.user == null) {
        return navigate("/login-required");
    }
    return (
        <div>
            <div className="m-3 text-xl font-bold" style={{ color: "#F0D061" }}>Review this Borrower!</div>
            <div><UserInfo user={user} /></div>
            <div className="m-3">
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-6 mb-6">
                        <div className="flex-auto">
                            <label htmlFor="rating" className="font-bold" style={{ color: "#F0D061" }}>Rating</label>
                            <p className="input-error">{inputErrors.rating}</p>
                            <input className="mt-1 border border-slate-300 rounded-md w-full text-sm shadow-sm placeholder-slate-400 block px-3 py-2 bg-white" id="rating" type="number" min="1" max="5" value={review.rating} onChange={handleReview} name="rating" />

                            <br />

                            <label htmlFor="description" className="font-bold" style={{ color: "#F0D061" }}>Text of Review</label>
                            <p className="input-error">{inputErrors.text}</p>
                            <textarea className="mt-1 border border-slate-300 rounded-md w-full text-sm shadow-sm placeholder-slate-400 block px-3 py-2 bg-white" id="text" rol={10} value={review.text} onChange={handleReview} name="text" />
                        </div>
                    </div>
                    <button className="hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full" style={{ backgroundColor: '#F7D65A' }} type="submit" onClick={handleSubmit}>Submit</button>
                </form>
            </div>
        </div>
    );
};

export default CreateUserReview;
