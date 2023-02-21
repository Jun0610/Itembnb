import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/post.css";

const Post = ({item}) => {
    const title = item.title;
    const description = item.description;
    const price = item.price;
    const image = item.image;
    const isRequest = item.isRequest;

    const rating = 4;

    return ( 
        
      <div className="card">

        {image != "" && 
          <img src={image} className="card-img-top custom-card-img" alt="..." />}
        {image === "" &&
          <img src="https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg" className="card-img-top custom-card-img" alt="..." />}
        
        <div className="row">

          <div className="card-body custom-card-body-left">
            <h5 className="card-title"> {title} </h5>
            <p className="card-text item-desc"> {description} </p>
            <a href="#" class="btn custom-card-button">Read more</a>
          </div>

        {isRequest === false &&
          <div className="card-body custom-card-body-right">
            <p className="card-text item-pr"> ${price} </p>
            <p className="card-text item-pr"> {rating}/5 </p>
          </div>}

        </div>
      </div>
    );
};

export default Post;