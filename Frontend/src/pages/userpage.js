import React, {useEffect} from "react";
import ItemService from '../tools/itemsService';
import RequestService from '../tools/requestService';
import {useParams} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Post from "../components/post";

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

const Userpage = () => {
    const {id} = useParams(); // id of user on webpage

    // Get user info from the server
    const [userInfo, setUserInfo] = React.useState({});
    const [userLoaded, setUserLoaded] = React.useState(false);

    // Get user's posted items from the server
    const [userItems, setUserItems] = React.useState([]);
    const [itemsLoaded, setItemsLoaded] = React.useState(false);

    // Get user's requested items from the server
    const [userRequests, setUserRequests] = React.useState([]);
    const [requestsLoaded, setRequestsLoaded] = React.useState(false);

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

                <h6 className="user_stat">{userInfo.name} has {userInfo.postedItems.length} items</h6>
                <h6 className="user_stat">{userInfo.name} has {userInfo.requestPosts.length} requests</h6>
            </div>
        </div>

        <div id="profile_main" className="add_padding">
            <div className="add_padding">
                <h1>{userInfo.name}'s Profile</h1>
                <p>Borrower Rating: {userInfo.borrowerRating}/5</p>
                <p>Lender Rating: {userInfo.lenderRating}/5</p>
                <p><strong>Profile Description: </strong>{userInfo.profileDesc}</p>
            </div>

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