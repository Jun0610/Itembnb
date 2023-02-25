import React, { useEffect } from "react";
import ItemService from '../tools/itemsService';
import {useParams} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Post from "../components/post";

import "../styles/homepage.css";
import "../styles/userpage.css";

const url = "http://localhost:8888/api/user";

class UserService {
    static async getUser(id) {
        console.log(url + "/profile-data/" + id);
        return new Promise((resolve, reject) => {
            fetch(`${url}/profile-data/${id}`)
            .then(res => res.json())
            .then((res) => {
                const data = res.data;
                resolve(data);
            }).catch((err) => {
                reject(err);
            })
        })
    }
}

const Userpage = () => {
  const {id} = useParams(); // id of user

  // Get user info from the server
  const [userInfo, setUserInfo] = React.useState([]);
  useEffect(() => {
    async function fetchData() {
        const data = await UserService.getUser(id);
        setUserInfo(data);
    } 
    fetchData();
  }, []);

  if (! Object.keys(userInfo).length) { // if user info hasn't loaded
    return ""; // just show a blank screen
  }

  const returnUserItems = () => {
    if (userInfo.postedItems.length == 0) {
        return <div>{userInfo.name} has no items!</div>
    }

    let userItems = [];
    for (let i = 0; i < userInfo.postedItems.length; i++) {
        let itemData = ItemService.getItem(userInfo.postedItems[i]);
        userItems.push(
            <Post item={
                {name: itemData.name,
                description: itemData.description,
                price: itemData.price,
                image: itemData.image,
                isRequest: false}
            } />
        );
    }
    return userItems;
  }


  return (
    <div id="page_content_container">
        <div id="profile_leftbox" className="add_padding">
            <div>
                <img id="profilepic" src="https://images.gr-assets.com/users/1674487597p6/614430.jpg"/>

                <h6 className="user_stat">{userInfo.postedItems.length} posted items</h6>

                <h6 className="user_stat">USERNAME has left X reviews</h6>
            </div>
        </div>

        <div id="profile_main" className="add_padding">
            <div className="add_padding">
                <h1>{userInfo.name}'s Profile</h1>
                <p>Borrower Rating: {userInfo.borrowerRating}/5</p>
                <p>Lender Rating: {userInfo.lenderRating}/5</p>
                <p><strong>Profile Description: </strong>{userInfo.profileDesc}</p>
            </div>

        <h3 className="item-post-header">USERNAME's Posted Items</h3>
            <div className="cardcontainer">
                {returnUserItems()}
            </div>
        <h3 className="item-post-header">USERNAME's Item Requests</h3>
        <div className="cardcontainer">
            <Post item={
                    {title: "Item 1",
                    description: "This is item 1",
                    price: 10,
                    image: "",
                    isRequest: true}
                } />
                <Post item={
                    {title: "Item 1",
                    description: "This is item 1",
                    price: 10,
                    image: "",
                    isRequest: true}
                } />
                <Post item={
                    {title: "Item 1",
                    description: "This is item 1",
                    price: 10,
                    image: "",
                    isRequest: true}
                } /><Post item={
                    {title: "Item 1",
                    description: "This is item 1",
                    price: 10,
                    image: "",
                    isRequest: true}
                } />
                <Post item={
                    {title: "Item 1",
                    description: "This is item 1",
                    price: 10,
                    image: "",
                    isRequest: true}
                } />
                <Post item={
                    {title: "Item 1",
                    description: "This is item 1",
                    price: 10,
                    image: "",
                    isRequest: true}
                } />
            </div>
        </div>
    </div>
  );

};

export default Userpage;