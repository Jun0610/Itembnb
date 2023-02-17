import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/post.css";

const Post = ({item}) => {
    const {title, description, price, image, isRequest} = item;

    const rating = 4;

    return ( 
        <div className="card">
        <img src={image} className="card-img-top custom-card-img" alt="..." />
        <div className="row">
          <div className="card-body custom-card-body">
            <h5 className="card-title"> {title} </h5>
            <p className="card-text item-desc"> {description} </p>
            <a href="#" class="btn btn-primary">Go somewhere</a>
          </div>
          <div className="card-body custom-card-body">
            <p className="card-text"> {price} </p>
            <p className="card-text"> {rating}/5 </p>
          </div>
        </div>
      </div>
    );
};

export default Post;