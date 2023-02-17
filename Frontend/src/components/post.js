import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/post.css";

const Post = ({item}) => {
    const {title, description, price, image, isRequest} = item;

    return ( 
        <div className="card">
        <img src={image} className="card-img-top" alt="..." />
        <div className="card-body">
          <h5 className="card-title"> {title} </h5>
          <p className="card-text"> {description} </p>
          <a href="#" class="btn btn-primary">Go somewhere</a>
        </div>
      </div>
    );
};

export default Post;