import React, { useEffect, useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RequestService from '../tools/requestService';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';
import userContext from '../contexts/userContext';

import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/homepage.css";

const DisplayRequestPost = () => {
    const navigate = useNavigate();
    const userAuth = useContext(userContext);

    const [isEditing, setIsEditing] = useState(false);
    const { id } = useParams(); // id of request post

    // object that stores error messages for invalid inputs
    const [inputErrors, setInputErrors] = useState({ name: [], description: [] });

    // Get request to be shown from the server
    const [request, setRequest] = useState({});
    useEffect(() => {

        async function fetchRequest() {
            const data = await RequestService.getRequest(id);
            setRequest(data);
        }
        fetchRequest();

    }, []);

    if (!Object.keys(request).length) { // if request hasn't loaded
        return ""; // just show a blank screen
    }

    const onRequestChange = (e) => {
        setRequest({
            ...request,
            [e.target.id]: e.target.value
        });
        validateField(e.target.id, e.target.value);
    }

    const handleDeleteRequest = () => {

        console.log("deletion message");
        confirmAlert({
            name: 'Confirm to delete',
            message: "Are you sure you want to delete this request?",
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {

                        async function deleteRequest() {
                            const deleteResult = await RequestService.deleteRequest(request, userAuth.user.user._id);
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

    const handleEditRequest = () => {
        if (isEditing) {
            if (noInputErrors()) {
                RequestService.editRequest(request, userAuth.user.user._id);
                setIsEditing(false);
            }
        }
        else {
            setIsEditing(true);
        }
    }

    const validateField = (fieldId, fieldValue) => {
        if (fieldId === "name" && fieldValue.length > 20) {
            setInputErrors({
                ...inputErrors,
                [fieldId]: [fieldId + " cannot be more than 20 characters long!"]
            });
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

    return (
        <div>
            <div className="m-3 font-bold" style={{ color: "#F0D061" }}>{isEditing ? 'Modify Item Request' : 'View Item Request'}</div>
            {(userAuth.user.user._id === request.ownerID) && (
                <div>
                    <button className="hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full m-2" style={{ backgroundColor: '#F7D65A' }} onClick={handleEditRequest}>{isEditing ? 'Save' : 'Edit'}</button>
                    <button className="hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full m-2" style={{ backgroundColor: '#F7D65A' }} onClick={handleDeleteRequest}>Delete</button>
                </div>)}
            <div className='m-3'>
                <div className="flex gap-6 mb-6">
                    <div className="flex-none">
                        <label htmlFor='name' className="font-bold" style={{ color: "#F0D061" }}>Name</label>
                        <p className="input-error">{inputErrors.name}</p>
                        <input className="mt-1 block px-3 rounded-md" id="name" type="text" value={request.name} name="name" readOnly={isEditing ? false : true} style={isEditing ? { background: "white", color: "black" } : { background: "#F1F1F1", color: "#545454" }} onChange={onRequestChange} />
                    </div>
                    <div className="flex-auto">
                        <label htmlFor='description' className="font-bold" style={{ color: "#F0D061" }}>Description</label>
                        <p className="input-error">{inputErrors.description}</p>
                        <textarea className="mt-1 border rounded-md w-full text-sm block px-3 py-2" id="description" type="text" value={request.description} readOnly={isEditing ? false : true} rol={10} style={isEditing ? { background: "white", color: "black" } : { background: "#F1F1F1", color: "#545454" }} onChange={onRequestChange} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DisplayRequestPost;