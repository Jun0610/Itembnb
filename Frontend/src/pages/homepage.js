import React, { useEffect } from "react";
import Post from "../components/post";

import "../styles/homepage.css";

const Homepage = () => {
  
  const [itemPosts, setItemPosts] = React.useState([]);
  const [itemRequests, setItemRequests] = React.useState([]);

  useEffect(() => {
  fetch("http://localhost:8888/api/item/get-item-posts")
  .then((response) => response.json())
  .then((data) => {console.log(data.data); setItemPosts(data.data); });
  });

  useEffect(() => {
  fetch("http://localhost:8888/api/request/get-request-posts")
  .then((response) => response.json())
  .then((data) => {console.log(data.data); setItemRequests(data.data); });
  });

  return (
    <div>
      <h1 className="item-post-header">Item posts</h1>
        <div className="cardcontainer">
          {itemPosts.map((item) => (<Post item={item} />))}
        </div>
        <h1 className="item-post-header">Item requests</h1>
        <div className="cardcontainer">
          {itemRequests.map((item) => (<Post item={item} />))}
          </div>
    </div>
  );
};

export default Homepage;