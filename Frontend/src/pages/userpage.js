import React, {lazy, useEffect} from "react";
import ItemService from '../tools/itemsService';
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

    const [userItems, setUserItems] = React.useState([]);
    const [itemsLoaded, setItemsLoaded] = React.useState(false);

    // optimal way to fetch with arrays: combine Promise.all + map w/ async function
    async function loadUserItems(userInfo) {
        return Promise.all(userInfo.postedItems.map(async id => {
            const itemData = await ItemService.getItem(id);
            return <Post post={itemData} isRequest = {false} favorites={[]} />;
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
        }

    fetchData();
    }, []);

    if (!userLoaded) {return ""}
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
                {itemsLoaded ? userItems : "loading..."}
            </div>
        <h3 className="item-post-header">{userInfo.name}'s Item Requests</h3>
        <div className="cardcontainer">
        </div>
        </div>
    </div>
    );

};

export default Userpage;