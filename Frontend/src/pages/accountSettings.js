import React, { useEffect, useContext, useState } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import UserService from '../tools/userService';
import 'react-confirm-alert/src/react-confirm-alert.css';
import userContext from '../contexts/userContext';
import { Loading, LoadingSmall } from "../components/Loading";
import SocketService, { socket } from '../tools/socketService';
import { confirmAlert } from 'react-confirm-alert'; // Import
import EmailService from '../tools/emailService';

import "../styles/homepage.css";
import "../styles/userpage.css";

const AccountSettings = () => {
    const navigate = useNavigate();
    const authUser = useContext(userContext);

    /* --- Fetching info from the server --- */
    const [settingData, setSettingData] = useState({});
    const [settingsLoaded, setSettingsLoaded] = useState(false);

    // equivalent of settingData for local (possibly edited from actual) values
    const [localSettings, setLocalSettings] = useState([]);
    // Checkboxes for selecting items
    const [checkBoxes, setCheckBoxes] = useState({});

    useEffect(() => {
        async function fetchData() {
            // check if user is logged in with sessionStorage, because checking authUser.user.isAuth doesn't work in useEffect
            const loggedInUser = JSON.parse(sessionStorage.getItem('curUser'));

            if (loggedInUser !== null) {
                // log in user automatically if session storage indicates they've already logged in, in another tab
                authUser.login(loggedInUser);

                // if user is logged in, fetch their info
                const userInfoData = await UserService.getUserData(loggedInUser._id);
                const res2 = await UserService.getNotificationStatus(loggedInUser._id);
                console.log(res2);
                console.log("notifi");

                const settings = { email: userInfoData.data.email };
                if (res2.data === 'notifications-on') {
                    settings.all = true;
                }
                else {
                    settings.all = false;
                }

                setSettingData(settings);
                setLocalSettings(settings);
                setCheckBoxes(settings);

                SocketService.connect();
                socket.emit('sendId', userInfoData.data.email);

                setSettingsLoaded(true);
            }
            else {
                navigate("/");
            }
        }
        fetchData();

    }, []);

    // TODO ADD VERIFICATION
    // right now if you logout w/ invalid email you can never login again
    const handleEditProfile = () => {
        async function sendData() {
            let userInfo = authUser.user.user;
            userInfo.email = localSettings['email'];
            // TODO THIS IS NOT A STABLE METHOD
            // THIS MAY BREAK LIVE NOTIFICATIONS

            console.log(userInfo);
            const result = await UserService.editProfile(userInfo, userInfo._id);
            console.log("result", result);

            if (result.success) {
                alert('Change made successfully. Confirmation email sent.');

                await EmailService.sendEmailRedirection2(
                    { name: 'Itembnb', email: 'itembnb2@gmail.com' },
                    authUser.user.user,
                    `Your Itembnb account "${authUser.user.user.name}" is now using this email!`,
                    `http://localhost:3000/user/${authUser.user.user._id}`);
            }
            else {
                alert('Change failed.');
            }
        }

        sendData();
    }

    const handleResetChanges = () => {
        setLocalSettings(settingData);
    }

    const onProfileChange = (e) => {
        setLocalSettings({
            ...localSettings,
            [e.target.id]: e.target.value
        });
    }

    const toggleCheckbox = (e) => {
        setCheckBoxes({
            ...checkBoxes,
            [e.target.id]: e.target.checked
        });
    }

    const submitNotifSettings = (e) => {
        console.log(authUser.user.user);

        async function submitData() {

            if (checkBoxes.all) {
                await UserService.turnOnNotifications(authUser.user.user._id);
            }
            else {
                await UserService.turnOffNotifications(authUser.user.user._id);
            }

            // to refresh navbar notif
            window.location.reload();
        }
        submitData();
    }

    const notificationSection = () => {
        return (
            <div className="basicBorderDiv flex-none">
                <label className="font-bold">Notification Settings</label>

                <div>
                    <input type="checkbox" onChange={toggleCheckbox} key="all" id="all" name="all" checked={checkBoxes['all']}></input>
                    <label for="all">&nbsp;All notifications</label>
                </div>

                <button className="defaultButton" onClick={submitNotifSettings}>Change Notification Settings</button>
            </div>
        );
    }

    const logout = () => {
        sessionStorage.removeItem('curUser')
        authUser.logout();
    };
    const handleDeleteUser = () => {
        confirmAlert({
            name: 'Confirm to delete',
            message: "Are you sure you want to delete your account? Everything will be lost. This is irrevocable.",
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        async function fetchDeleteUser() {
                            const deleteResult = await UserService.deleteUser(authUser.user.user._id);
                            console.log("deleteresult", deleteResult);
                            if (deleteResult.success) {
                                alert("Deletion successful.");
                                logout();
                                return navigate("/");
                            }
                        }
                        fetchDeleteUser();
                    }
                },
                {
                    label: 'No',
                    onClick: () => { },
                }
            ],
        });
    }

    if (authUser.user.user == null) {
        // TODO - if user not logged in (right now it redirects to homepage)
        return;
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
                        <button className="hover:bg-orange-400 text-white font-bold py-2 px-4 rounded-full m-2 user-page-btn" onClick={handleResetChanges}>Reset Changes</button>
                        <button className="hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full m-2 user-page-btn" onClick={handleDeleteUser}>Delete Account</button>
                    </div>

                    <div className="basicBorderDiv flex-none">
                        <label htmlFor="email" className="font-bold">Email</label>
                        <input className="mt-1 block px-8 border border-slate-300 py-2 rounded-md text-sm shadow-sm placeholder-slate-400 bg-white" id="email" type="email" value={localSettings.email} onChange={onProfileChange} name="email" />
                        <button className="defaultButton" onClick={handleEditProfile}>Change Email</button>
                    </div>

                    <br />

                    {notificationSection()}
                </div>
            </div>
        </div >
    );
}

export default AccountSettings;