import React, { useEffect, useContext, useState } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import RequestService from '../tools/requestService';
import ItemService from '../tools/itemsService';
import UserService from '../tools/userService';
import { socket } from '../tools/socketService';
import SocketService from '../tools/socketService';
import EmailService from '../tools/emailService';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';
import userContext from '../contexts/userContext';
import { Loading, LoadingSmall } from "../components/Loading";
import Post from "../components/post";

import "../styles/homepage.css";
import "../styles/userpage.css";

const AccountSettings = () => {
    const navigate = useNavigate();
    const authUser = useContext(userContext);
    const { id: requestId } = useParams(); // id of request post

    /* --- Fetching info from the server --- */
    const [settingData, setSettingData] = useState({});
    const [settingsLoaded, setSettingsLoaded] = useState({});

    useEffect(() => {
        async function fetchData() {
            // check if user is logged in with sessionStorage, because checking authUser.user.isAuth doesn't work in useEffect
            const loggedInUser = JSON.parse(sessionStorage.getItem('curUser'));

            if (loggedInUser !== null) {
                // log in user automatically if session storage indicates they've already logged in, in another tab
                authUser.login(loggedInUser);

                // if user is logged in, fetch their info

                // load user info (minus items)
                const userInfoData = await UserService.getUserData(loggedInUser._id);
            }

            setSettingsLoaded(true);
        }
        fetchData();

    }, []);

    /*
    const [selectedImage, setSelectedImage] = useState(null);
    const [imgFile, setImgFile] = useState(null);
    const [description, setDescription] = useState(null);
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [confirmPass, setConfirmPass] = useState(true);
    const [emailError, setEmailError] = useState(false);
    const [signUpSuccess, setSignUpSuccess] = useState("Sign Up");

    var xhr = new XMLHttpRequest();

    const nav = useNavigate();

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            let img = e.target.files[0];
            setSelectedImage(URL.createObjectURL(img));

            let reader = new FileReader();
            reader.readAsDataURL(img);
            reader.onload = () => {
                setImgFile(reader.result);
            };
        }
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPassword = (e) => {
        if (password === e.target.value) {
            setConfirmPass(true);
        } else {
            setConfirmPass(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (confirmPass) {
            var user = {
                "name": name,
                "email": email,
                "password": password,
                "favoritedItems": [],
                "postedItems": [],
                "requestPosts": [],
                "profileDesc": description,
                "reservHist": [],
                "chatId": "12345",
                "borrowerRating": 5,
                "lenderRating": 5,
                "profilePic": imgFile
            };
            fetch("http://localhost:8888/api/user/register-user", {
                method: "POST",
                body: JSON.stringify(user),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => {
                if (res.status === 201) {
                    console.log("success");
                    setSignUpSuccess("Sign up successful! Redirecting...");
                    setTimeout(() => {
                        nav("/");
                    }, 2000);
                } else {
                    console.log(user);
                    console.log(xhr.status);
                    setEmailError(true);
                }
            });
        }
        else
            console.log("passwords not matching");
    };
    */


    const handleSubmit = (e) => {
    }

    const [settingState, setSettingState] = useState([]);
    // equivalent of userInfo but just for ProfileHeader so it doesn't update everything else when you change stuff
    const [localUserInfo, setLocalUserInfo] = useState(settingState);

    // object that stores error messages for invalid inputs
    const [inputErrors, setInputErrors] = useState({ name: [], profileDesc: [] });

    const handleEditCancel = () => {
        setLocalUserInfo(settingState);
        setInputErrors({ name: [], profileDesc: [] });
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

    // Checkboxes for selecting items
    const [checkBoxes, setCheckBoxes] = useState({
        requestAddItem: true,
        borrowDeadline: true,
        other: true,
    });

    const toggleCheckbox = (e) => {
        setCheckBoxes({
            ...checkBoxes,
            [e.target.id]: e.target.checked
        });
    }

    const notificationSection = () => {
        return (
            <div className="basicBorderDiv flex-none">
                <label className="font-bold">Notification Settings</label>
                <p><em>Notify me when:</em></p>

                <div>
                    <input type="checkbox" onChange={toggleCheckbox} key="requestAddItem" id="requestAddItem" name="requestAddItem" checked={checkBoxes['requestAddItem']}></input>
                    <label for="requestAddItem">&nbsp;Someone recommends a new item for a request</label>
                </div>

                <div>
                    <input type="checkbox" onChange={toggleCheckbox} key="borrowDeadline" id="borrowDeadline" name="borrowDeadline" checked={checkBoxes['borrowDeadline']}></input>
                    <label for="borrowDeadline">&nbsp;One of your borrowing deadlines is a day away</label>
                </div>

                <div>
                    <input type="checkbox" onChange={toggleCheckbox} key="other" id="other" name="other" checked={checkBoxes['other']}></input>
                    <label for="other">&nbsp;Other</label>
                </div>
                <button className="defaultButton">Change Notification Settings</button>
            </div>
        );
    }

    if (authUser.user.user == null) {
        return navigate("/");
    }
    if (!settingsLoaded) {
        return (
            <Loading />
        )
    }
    return (
        <div id="page_content_container">
            <div id="profile_main" className="add_padding">
                <div className="add_padding">
                    <h1>Account Settings</h1>
                    <p><NavLink to={"/user/" + authUser.user.user._id}>To User Profile</NavLink></p>

                    <div className="add_padding">
                        <button className="hover:bg-orange-400 text-white font-bold py-2 px-4 rounded-full m-2 user-page-btn" onClick={() => console.log()}>Reset Changes</button>
                        <button className="hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full m-2 user-page-btn" onClick={() => console.log()}>Delete Account</button>
                    </div>

                    <div className="basicBorderDiv flex-none">
                        <label htmlFor="email" className="font-bold">Email</label>
                        <p className="input-error">{inputErrors.email}</p>
                        <input className="mt-1 block px-8 border border-slate-300 py-2 rounded-md text-sm shadow-sm placeholder-slate-400 bg-white" id="email" type="text" value={localUserInfo.email} onChange={onProfileChange} name="email" />
                        <button className="defaultButton">Change Email</button>
                    </div>

                    <br />

                    {notificationSection()}
                </div>
            </div>
        </div >
    );
}

export default AccountSettings;