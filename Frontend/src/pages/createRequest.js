import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import userContext from '../contexts/userContext';
import RequestService from '../tools/requestService';

import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/createRequest.css";

const CreateRequest = () => {
    const navigate = useNavigate();

    const authUser = useContext(userContext);

    const blankRequest = {
        name: '',
        description: '',
        dateCreated: '',
        ownerID: '',
        resolved: false,
        recommendedItems: []
    };

    const [request, setRequest] = React.useState(blankRequest);
    const [nameError, setNameError] = useState('');
    const [descError, setDescError] = useState('');
    const [nameErrorStyle, setNameErrorStyle] = useState("no-error")
    const [descriptionErrorStyle, setDescriptionErrorStyle] = useState("no-error")



    const handleSubmit = async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value

        console.log(name, description);
        let errors = false;
        if (name === '') {
            setNameErrorStyle('has-error')
            setNameError('Request name must have at least 1 character!')
            errors = true;
        } else if (name.length > 20) {
            setNameErrorStyle('has-error')
            setNameError("Request name cannot be more than 20 characters long!");
            errors = true;
        } else {
            setNameError('');
        }

        if (description === '') {
            setDescriptionErrorStyle('has-error')
            setDescError("Request description must have at least 1 character!");
            errors = true;
        } else {
            setDescriptionErrorStyle('has-error')
            setDescError('');
        }
        console.log(nameErrorStyle);

        if (!errors) {

            console.log("creation of " + request);
            request.ownerID = authUser.user.user._id;
            await RequestService.postRequest(request, authUser.user.user._id).then((res) => {
                alert("Request successfully posted!");
                setRequest(blankRequest);
            });
            navigate('/')
        }
    }

    if (authUser.user.user == null) {
        return navigate("/login-required");
    }
    return (
        <div style={{ marginLeft: "1rem" }}>
            <div className="m-3 text-xl font-bold" style={{ color: "#F0D061", fontSize: '20px' }}>Request an Item</div>
            <div className="m-3" style={{ fontSize: '20px' }}><p>If you'd like to borrow an item you can't find, you can put out a request and other users will try to fulfill it!</p></div>
            <div className="m-3">
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-6 mb-6">
                        <div className="flex-none">
                            <label htmlFor="name" className="font-bold" style={{ color: "#F0D061", fontSize: '20px', marginBottom: "0.5rem" }}>Name</label>
                            <br />
                            <p className={nameErrorStyle}>{nameError}</p>
                            <input id="name" type="text" autoComplete="off" />
                        </div>
                        <div className="flex-auto" style={{ marginLeft: "4rem" }}>
                            <label htmlFor="description" className="font-bold" style={{ color: "#F0D061", fontSize: '20px', marginBottom: "0.5rem" }}>Description</label>
                            <br />
                            <p className={descriptionErrorStyle}>{descError}</p>

                            <textarea id="description" rol={10} />


                        </div>
                    </div>
                    <button className="hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full" style={{ backgroundColor: '#F7D65A' }} type="submit" onClick={handleSubmit}>Submit</button>
                </form>
            </div>
        </div>
    );
};

export default CreateRequest;
