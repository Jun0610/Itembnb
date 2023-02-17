import React from "react";
import Post from "../components/post";

import "../styles/homepage.css";


const Homepage = () => {
  return (
    <div>
      <h1>Item posts</h1>
        <div className="cardcontainer">
          <Post item={
                {title: "Item 1",
                description: "This is item 1",
                price: 10,
                image: "",
                isRequest: false}
              } />
              <Post item={
                  {title: "Item 1",
                  description: "This is item 1",
                  price: 10,
                  image: "",
                  isRequest: false}
              } />
              <Post item={
                  {title: "Item 1",
                  description: "This is item 1",
                  price: 10,
                  image: "",
                  isRequest: false}
              } /><Post item={
                {title: "Item 1",
                description: "This is item 1",
                price: 10,
                image: "",
                isRequest: false}
              } />
              <Post item={
                  {title: "Item 1",
                  description: "This is item 1",
                  price: 10,
                  image: "",
                  isRequest: false}
              } />
              <Post item={
                  {title: "Item 1",
                  description: "This is item 1",
                  price: 10,
                  image: "",
                  isRequest: false}
              } />
        </div>
      <h1>Item requests</h1>
      <div className="cardcontainer">
          <Post item={
                {title: "Item 1",
                description: "This is item 1",
                price: 10,
                image: "",
                isRequest: false}
              } />
              <Post item={
                  {title: "Item 1",
                  description: "This is item 1",
                  price: 10,
                  image: "",
                  isRequest: false}
              } />
              <Post item={
                  {title: "Item 1",
                  description: "This is item 1",
                  price: 10,
                  image: "",
                  isRequest: false}
              } /><Post item={
                {title: "Item 1",
                description: "This is item 1",
                price: 10,
                image: "",
                isRequest: false}
              } />
              <Post item={
                  {title: "Item 1",
                  description: "This is item 1",
                  price: 10,
                  image: "",
                  isRequest: false}
              } />
              <Post item={
                  {title: "Item 1",
                  description: "This is item 1",
                  price: 10,
                  image: "",
                  isRequest: false}
              } />
        </div>
    </div>
  );
};

export default Homepage;