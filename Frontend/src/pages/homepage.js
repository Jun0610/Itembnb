import React, { useEffect } from "react";
import Post from "../components/post";

import "../styles/homepage.css";

const Homepage = () => {
  
  const [itemPosts, setItemPosts] = React.useState([]);
  const [itemRequests, setItemRequests] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    async function getItemPosts() {
      await fetch("http://localhost:8888/api/item/get-item-posts")
      .then((response) => response.json())
      .then((data) => {console.log(data.data); setItemPosts(data.data) });
    }
    getItemPosts();
  }, []);

  useEffect(() => {
    async function getRequestPosts() {
      await fetch("http://localhost:8888/api/request/get-request-posts")
      .then((response) => response.json())
      .then((data) => {console.log(data.data); setItemRequests(data.data); setIsLoading(false) });
    }
    getRequestPosts();
  }, []);

  if (isLoading) return (<div>Bruh</div>);
  else
  return (
    <div>
      <h1 className="item-post-header">Item posts</h1>
        <div className="cardcontainer">
          {itemPosts.map((item, i) => (<Post key={i} item={item} isRequest={false}/>))}
        </div>
        <h1 className="item-post-header">Item requests</h1>
        <div className="cardcontainer">
          {itemRequests.map((item, i) => (<Post key={i} item={item} isRequest={true}/>))}
          </div>
    </div>
  );
};

export default Homepage;