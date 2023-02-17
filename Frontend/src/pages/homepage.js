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
      <h1>Item requests</h1>
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
  );
};

export default Homepage;