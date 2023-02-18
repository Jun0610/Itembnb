import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import Post from "../components/post";

import "../styles/homepage.css";
import "../styles/userpage.css";

const Userpage = () => {
  return (
    <div id="page_content_container">
        <div id="profile_leftbox">
            <div>
                <img id="profilepic" src="https://images.gr-assets.com/users/1674487597p6/614430.jpg"/>

                <h6 class="user_stat">X posted items</h6>

                <h6 class="user_stat">X item requests</h6>

                <h6 class="user_stat">USERNAME has left X reviews</h6>
            </div>
        </div>

        <div id="profile_main">
            <div class="content_block">
                <h1>USERNAME's Profile</h1>
                <p>Borrower rating: X/5</p>
                <p>Lender rating: X/5</p>
                <p>User description: lorem ipsum dolor sit amet consecutiro ipsit adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
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