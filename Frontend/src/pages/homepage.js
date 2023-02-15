import React from "react";
import Post from "../components/post";

const Homepage = () => {
  return (
    <div>
      <h1>Item posts</h1>
        <Post item={
            {title: "Item 1",
            description: "This is item 1",
            price: 10,
            image: "",
            isRequest: false}
        } />
      <h1>Item requests</h1>
    </div>
  );
};

export default Homepage;