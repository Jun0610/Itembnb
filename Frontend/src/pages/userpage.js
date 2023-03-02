import React, {useEffect, useContext, useState} from "react";
import { Link, useNavigate } from 'react-router-dom';
import ItemService from '../tools/itemsService';
import RequestService from '../tools/requestService';
import { confirmAlert } from 'react-confirm-alert'; // Import
import {useParams} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Post from "../components/post";
import userContext from '../contexts/userContext';

import "../styles/homepage.css";
import "../styles/userpage.css";

const url = "http://localhost:8888/api/user";

async function getUser(id) {
    console.log(url + "/profile-data/" + id);
    return new Promise((resolve, reject) => {
        fetch(`${url}/profile-data/${id}`)
        .then(res => res.json())
        .then((res) => {
            const data = res.data;
            console.log(res.data);
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
}

async function editProfile(newUserInfo, id) {
    console.log("edit a profile " + id);
    return new Promise((resolve, reject) => {
        fetch(`${url}/edit-profile/${id}`, {
            method: 'put', 
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(newUserInfo),
        }).then(res => res.json()).then(
            (result) => {
                console.log("edit res", result);
                resolve(result);
            }
        ).catch((err) => {
            reject(err);
        })
    })
}

async function deleteUser(id) {
    return new Promise((resolve, reject) => {
        fetch(`${url}/delete-user/${id}`, {
            method: 'delete', 
            headers: { 'content-type': 'application/json' },
        }).then(res => res.json()).then(
            (result) => {
                resolve(result);
            }
        ).catch((err) => {
            reject(err);
        })
    })
}

const Userpage = () => {
    const authUser = useContext(userContext);
    const {id} = useParams(); // id of user on webpage


    /* --- Fetching info from server --- */

    // Get user info from the server
    const [userInfo, setUserInfo] = useState({});
    const [userLoaded, setUserLoaded] = useState(false);

    // Get user's posted items from the server
    // Get user's posted items from the server
    const [userItems, setUserItems] = useState([]);
    const [itemsLoaded, setItemsLoaded] = useState(false);

    // Get user's requested items from the server
    const [userRequests, setUserRequests] = useState([]);
    const [requestsLoaded, setRequestsLoaded] = useState(false);

    // optimal way to fetch with arrays: combine Promise.all + map w/ async function
    async function loadUserItems(userInfo) {
        if (userInfo.postedItems.length === 0) {
            return <p>{userInfo.name} has no items!</p>
        }
        return Promise.all(userInfo.postedItems.map(async (id, index) => {
            const itemData = await ItemService.getItem(id);
           if (itemData !== undefined && itemData.success) {
                // if this doesn't work check if object is in itemData or itemData.data
                return <Post post={itemData.data} isRequest = {false} key={itemData.data._id} />;
           }
           return "Error!"; // should NOT HAPPEN - happens if return new Promise is not used in ItemService.getItem ?
        }));
    }

    async function loadUserRequests(userInfo) {
        if (userInfo.requestPosts.length === 0) {
            return <p>{userInfo.name} has no item requests!</p>
        }
        return Promise.all(userInfo.requestPosts.map(async id => {
            const request = await RequestService.getRequest(id);
            return <Post post={request} isRequest = {true} key={request._id} />;
        }));
    }

    useEffect(() => {

        async function fetchData() {
            // load user info (minus items/requests)
            const userInfo = await getUser(id);
            setUserInfo(userInfo);
            setUserLoaded(true);

            // load user items
            const userItems = await loadUserItems(userInfo);
            setUserItems(userItems);
            setItemsLoaded(true);

            // load user requests
            const userRequests = await loadUserRequests(userInfo);
            setUserRequests(userRequests);
            setRequestsLoaded(true);
        }

    fetchData();
    }, []);

    /* --- Profile editing functionality --- */

    const ProfileHeader = () => {
        const navigate = useNavigate(); // for redirect to homepage
        const handleDeleteUser= () => {

            console.log("deletion message");
            confirmAlert({
                name: 'Confirm to delete',
                message: "Are you sure you want to delete your account? Everything will be lost. This is irrevocable.",
                buttons: [
                    {
                        label: 'Yes',
                        onClick: () => {
                            async function fetchDeleteUser() {
                                const deleteResult = await deleteUser(id);
                                console.log("deleteresult", deleteResult);
                                if (deleteResult.success) {
                                    alert("Deletion successful.");
                                    return navigate("/");
                                }
                            } 
                            fetchDeleteUser();
                        }
                    }, 
                    {
                        label: 'No',
                        onClick: () => {},
                    }
                ],
            });
        }

        const [isEditing, setIsEditing] = useState(false);

        const [imagePreview, setImagePreview] = useState(userInfo.profilePic);
        // equivalent of userInfo but just for ProfileHeader so it doesn't update everything else when you change stuff
        const [localUserInfo, setLocalUserInfo] = useState(userInfo);

        const handleEditProfile = () => {
            async function sendData() {
                if (isEditing) {
                    const result = await editProfile(localUserInfo, id);
                    console.log("result", result);

                    if (result.success) {
                        setUserInfo(localUserInfo);
                        setIsEditing(false);

                        // to refresh navbar avatar image - todo find better way
                        window.location.reload();
                    }
                }
            }

            if (isEditing) {
                sendData();
            }
            else {
                setIsEditing(true);
            }
        }

        const handleEditCancel = () => {
            setLocalUserInfo(userInfo);
            setIsEditing(false);
        }

        const onProfileChange = (e) => {
            setLocalUserInfo({
                ...localUserInfo,
                [e.target.id]: e.target.value
            });
        }

        const handleImageChange = (e) => {
            if (e.target.files && e.target.files[0]) {
                let img = e.target.files[0];
                setImagePreview(URL.createObjectURL(img));

                let reader = new FileReader();
                reader.readAsDataURL(img);
                reader.onload = () => {
                    setLocalUserInfo({
                        ...localUserInfo,
                        profilePic: reader.result
                    });
                };
            }
        };

        const ImgUpload = ({
            onChange,
            src
        }) =>
        <label htmlFor="photo-upload" className="custom-file-upload fas">
            <div className="img-wrap" >
                <img for="photo-upload" src={src} alt="upload image here" />
            </div>
            <input id="photo-upload" type="file" onChange={onChange} />
        </label>

        if (isEditing) {
            return (
            <div className="add_padding">
                <h1>Editing Your Profile</h1>

                <div className="add_padding">
                    <button className="hover:bg-orange-200 text-white font-bold py-2 px-4 rounded-full m-2" onClick={() => handleEditProfile()}>Save Changes</button>
                    <button className="hover:bg-orange-200 text-white font-bold py-2 px-4 rounded-full m-2" onClick={() => handleEditCancel()}>Cancel</button>
                    <button className="hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full m-2" onClick={() => handleDeleteUser()}>Delete Account</button>
                </div>

                <label className="font-bold" style={{color: "#F0D061"}}>Avatar (click to upload)</label>
                <div id="center-img">
                    <ImgUpload onChange={handleImageChange} src={imagePreview} />
                </div>

                <div className="flex-none">
                <label htmlFor="name" className="font-bold" style={{color: "#F0D061"}}>Name</label>
                <input className="mt-1 block px-3 border border-slate-300 py-2 rounded-md text-sm shadow-sm placeholder-slate-400 bg-white" id="name" type="text" value={localUserInfo.name} onChange={onProfileChange} name="name"/>
                </div>

                <br/>

                <div className="flex-auto">
                <label htmlFor="profileDesc" className="font-bold" style={{color: "#F0D061"}}>Profile Description</label>
                <textarea className="mt-1 border border-slate-300 rounded-md w-full text-sm shadow-sm placeholder-slate-400 block px-3 py-8 bg-white" id="profileDesc" rol={10} value={localUserInfo.profileDesc} onChange={onProfileChange} name="profileDesc"/>
                </div>
            </div> )
        }
        else {
            return (
            <div className="add_padding">
                <h1>Profile - {userInfo.name}</h1>

                {(authUser.isAuth && authUser.user.user._id === userInfo._id ) &&
                (
                    <span>
                        <p><Link to="/favorite-items">Welcome, {userInfo.name}! See your favorite items!</Link></p>

                        <div className="add_padding">
                            <button className="hover:bg-orange-200 text-white font-bold py-2 px-4 rounded-full m-2" onClick={() => handleEditProfile()}>Edit Profile</button>
                        </div>
                    </span>
                )}

                <p><strong>Profile Description: </strong>{userInfo.profileDesc}</p>
            </div> )
        }
    }

    /* --- What to return/render --- */

    if (!userLoaded) {return (
        <div id="page_content_container">
            <h1>loading...</h1>
        </div>
    )}
    return (
    <div id="page_content_container">
        <div id="profile_leftbox" className="add_padding">
            <div>
                <img id="profilepic" src={userInfo.profilePic}/>

                <h6 className="user_stat">Borrower Rating: {userInfo.borrowerRating}/5</h6>
                <h6 className="user_stat">Lender Rating: {userInfo.lenderRating}/5</h6>
                <hr/>
                <h6 className="user_stat">{userInfo.name} has {userInfo.postedItems.length} items</h6>
                <h6 className="user_stat">{userInfo.name} has {userInfo.requestPosts.length} requests</h6>
            </div>
        </div>

        <div id="profile_main" className="add_padding">
            <ProfileHeader />

            <h3 className="item-post-header">{userInfo.name}'s Posted Items</h3>
            <div className="cardcontainer">
                {itemsLoaded ? userItems : "Loading..."}
            </div>

            <h3 className="item-post-header">{userInfo.name}'s Item Requests</h3>
            <div className="cardcontainer">
                {requestsLoaded ? userRequests : "Loading..."}
            </div>
        </div>
    </div>
    );

};

export default Userpage;