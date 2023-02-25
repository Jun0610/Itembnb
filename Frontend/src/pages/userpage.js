import React, { useEffect } from "react";
import {useParams} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Post from "../components/post";

import "../styles/homepage.css";
import "../styles/userpage.css";

const Userpage = () => {

  // Get user info from the server
  const {id} = useParams(); // id of request post
  const [userInfo, setUserInfo] = React.useState([]);
  useEffect(() => {
  fetch("http://localhost:8888/user-profile-data/" + id)
  .then((response) => response.json())
  .then((data) => {console.log("Data received", data[0]); setUserInfo(data); });
  }, []);

  if (! Object.keys(userInfo).length) { // if user info hasn't loaded
    return ""; // just show a blank screen
  }

  return (
    <div id="page_content_container">
        <div id="profile_leftbox" className="add_padding">
            <div>
                <img id="profilepic" src="https://images.gr-assets.com/users/1674487597p6/614430.jpg"/>

                <h6 className="user_stat">{userInfo.postedItems.length} posted items</h6>

                <h6 className="user_stat">X item requests</h6>

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
            <Post item={
                    {title: "Item 1",
                    description: "This is item 1",
                    price: 10,
                    image: "https://s.imgur.com/images/logo-1200-630.jpg?2",
                    isRequest: false}
                } />
                <Post item={
                    {title: "Item 1",
                    description: "This is item 1This is item 1This is item 1This is item 1This is item 1This is item 1This is item 1This is item 1This is item 1This is item 1This is item 1This is item 1This is item 1This is item 1This is item 1",
                    price: 10,
                    image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8&w=1000&q=80",
                    isRequest: false}
                } />
                <Post item={
                    {title: "Item 1",
                    description: "This is item 1",
                    price: 10,
                    image: "https://www.shutterstock.com/image-photo/mountains-under-mist-morning-amazing-260nw-1725825019.jpg",
                    isRequest: false}
                } /><Post item={
                    {title: "Item 1",
                    description: "This is item 1",
                    price: 10,
                    image: "https://1.bp.blogspot.com/-kK7Fxm7U9o0/YN0bSIwSLvI/AAAAAAAACFk/aF4EI7XU_ashruTzTIpifBfNzb4thUivACLcBGAsYHQ/s1280/222.jpg",
                    isRequest: false}
                } />
                <Post item={
                    {title: "Item 1",
                    description: "This is item 1",
                    price: 10,
                    image: "https://burst.shopifycdn.com/photos/woman-dressed-in-white-leans-against-a-wall.jpg?width=1200&format=pjpg&exif=0&iptc=0",
                    isRequest: false}
                } />
                <Post item={
                    {title: "Item 1",
                    description: "This is item 1",
                    price: 10,
                    image: "https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg",
                    isRequest: false}
                } />
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