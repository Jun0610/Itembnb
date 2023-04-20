import React, { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import userContext from '../contexts/userContext';
import ReviewService from "../tools/reviewService";
import ItemService from "../tools/itemsService";
import ReservationService from "../tools/reservationService";
import { BorrowingResLarge } from "../components/reservationComponents";
import { Loading } from "../components/Loading";

import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/homepage.css";

const CreateItemReview = () => {
    const { reservationId } = useParams();
    const navigate = useNavigate();

    const authUser = useContext(userContext);

    const blankReview = {
        rating: 5,
        text: "Enter your review here!",
        reviewerId: "",
        itemId: "",
        userId: "",
        reservationId: reservationId
        /* these get changed in reviewService.postReview
        dateModified: '',
        dateCreated: '',
        */
    };

    // dataObject is an object with full info of reservation, lender, and item borrowed (3 objects)
    // must be formatted like this because BorrowingResLarge expects it this way
    const [dataObject, setDataObject] = React.useState(null);

    const [review, setReview] = React.useState(blankReview);
    const startingErrors = { text: [], rating: [] };
    const [inputErrors, setInputErrors] = React.useState(startingErrors);

    useEffect(() => {

        const fetchData = async () => {
            const resData = await ReservationService.getReservationAndLender(reservationId);
            const borrowedItemData = await ItemService.getItemMin(resData.data.reservation.itemId, false);
            const dataObj = { reservation: resData.data.reservation, lender: resData.data.lender, item: borrowedItemData.data }
            setDataObject(dataObj);
        }

        fetchData();

    }, [])

    const handleEdit = (e) => {
        setReview({
            ...review,
            [e.target.id]: e.target.value,
        });
        validateField(e.target.id, e.target.value);
    }

    const getErrors = (fieldId, fieldValue) => {
        const errorArray = [];

        if (fieldId === "text" && fieldValue.length === 0) {
            errorArray.push(fieldId + " must have at least 1 character!");
        }
        else if (fieldId === "rating" && (fieldValue < 1 || fieldValue > 5)) {
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
            console.log("creation of" + review);
            review.reviewerId = authUser.user.user._id;
            review.itemId = dataObject.item._id;
            review.rating = Number(review.rating);

            await ReviewService.postReview(review, reservationId).then((res) => {
                if (res.success) {
                    alert("Review successfully posted!");
                    setReview(blankReview);
                }
                else {
                    alert("Sorry, an error occured.");
                }
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
    if (dataObject == null) {
        return <Loading />
    }
    return (
        <div>
            <div className="m-3 text-xl font-bold" style={{ color: "#F0D061" }}>Review the Item You Borrowed!</div>
            <BorrowingResLarge e={dataObject} i={reservationId} nav={navigate} />
            <div className="m-3">
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-6 mb-6">
                        <div className="flex-auto">
                            <label htmlFor="rating" className="font-bold" style={{ color: "#F0D061" }}>Rating</label>
                            <p className="input-error">{inputErrors.rating}</p>
                            <input className="mt-1 border border-slate-300 rounded-md w-full text-sm shadow-sm placeholder-slate-400 block px-3 py-2 bg-white" id="rating" type="number" min="1" max="5" value={review.rating} onChange={handleEdit} name="rating" />

                            <br />

                            <label htmlFor="description" className="font-bold" style={{ color: "#F0D061" }}>Text of Review</label>
                            <p className="input-error">{inputErrors.text}</p>
                            <textarea className="mt-1 border border-slate-300 rounded-md w-full text-sm shadow-sm placeholder-slate-400 block px-3 py-2 bg-white" id="text" rol={10} value={review.text} onChange={handleEdit} name="text" />
                        </div>
                    </div>
                    <button className="hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full" style={{ backgroundColor: '#F7D65A' }} type="submit" onClick={handleSubmit}>Submit</button>
                </form>
            </div>
        </div>
    );
};

export default CreateItemReview;
