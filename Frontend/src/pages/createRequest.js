import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RequestService from '../tools/requestService';
import userContext from '../contexts/userContext';

import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/homepage.css";

const CreateRequest = () => {
    const navigate = useNavigate();

    const authUser = useContext(userContext);

    const blankRequest = {
        name: '',
        description: '',
        dateCreated: '',
        ownerID: "TODO",
        resolved: false,
        recommendedItems: []
    };

    const [request, setRequest] = React.useState(blankRequest);
    const startingErrors = { name: [], description: [] };
    const [inputErrors, setInputErrors] = React.useState(startingErrors);

    const handleRequest = (e) => {
        setRequest({
            ...request,
            [e.target.id]: e.target.value,
        });
        validateField(e.target.id, e.target.value);
    }

    const getErrors = (fieldId, fieldValue) => {
        const errorArray = [];

        if (fieldId === "name" && fieldValue.length > 20) {
            errorArray.push(fieldId + " cannot be more than 20 characters long!");
        }
        if (fieldValue.length === 0) {
            errorArray.push(fieldId + " must have at least 1 character!");
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
            newInputErrors[key] = getErrors(key, request[key]);
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
            console.log("creation of " + request);
            request.ownerID = authUser.user.user._id;
            await RequestService.postRequest(request, authUser.user.user._id).then((res) => {
                alert("Request successfully posted!");
                setRequest(blankRequest);
            });
            navigate('/')
        }
    }

    // show error messages by default
    if (inputErrors === startingErrors) {
        validateAllFields();
    }

    if (authUser.user.user == null) {
        return navigate("/");
    }
    return (
        <div>
            <div className="m-3 text-xl font-bold" style={{ color: "#F0D061" }}>Request an Item</div>
            <div><p>&nbsp;If you'd like to borrow an item you can't find, you can put out a request and other users will try to fulfill it!</p></div>
            <div className="m-3">
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-6 mb-6">
                        <div className="flex-none">
                            <label htmlFor="name" className="font-bold" style={{ color: "#F0D061" }}>Name</label>
                            <p className="input-error">{inputErrors.name}</p>
                            <input className="mt-1 block px-3 border border-slate-300 py-2 rounded-md text-sm shadow-sm placeholder-slate-400 bg-white" id="name" type="text" value={request.name} onChange={handleRequest} name="name" />
                        </div>
                        <div className="flex-auto">
                            <label htmlFor="description" className="font-bold" style={{ color: "#F0D061" }}>Description</label>
                            <p className="input-error">{inputErrors.description}</p>
                            <textarea className="mt-1 border border-slate-300 rounded-md w-full text-sm shadow-sm placeholder-slate-400 block px-3 py-2 bg-white" id="description" rol={10} value={request.description} onChange={handleRequest} name="description" />
                        </div>
                    </div>
                    <button className="hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full" style={{ backgroundColor: '#F7D65A' }} type="submit" onClick={handleSubmit}>Submit</button>
                </form>
            </div>
        </div>
    );
};

export default CreateRequest;
