import React, {useContext} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/post.css";
import itemContext from "../contexts/itemContext";
import { useNavigate } from "react-router-dom";

const Post = ({item, isRequest}) => {
    const title = item.name;
    const description = item.description;
    const price = item.price;
    /*let image=""; 
    if (item.images != null)
      image = item.images[0]['data_url'];
    else
      image = "";*/
    const rating = 4;

    const selectedItem = useContext(itemContext);

    const nav = useNavigate();

    const handleClick = () => {
      console.log("clicked");
      selectedItem.setSelectedItem(item);
      nav("/selected-item-post");
    }
    

    return ( 
        
      <div className="card">

        {item.images && item.images[0] ? <img src={item.images[0]['data_url']} className="card-img-top custom-card-img" alt="..." /> : 
        <img src="https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg" className="card-img-top custom-card-img" alt="..." />
        }
        
        {/* {image !== "" && 
          <img src={item.images[0].data_url} className="card-img-top custom-card-img" alt="..." />}
        {image === "" &&
          <img src="https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg" className="card-img-top custom-card-img" alt="..." />} */}
        
        <div className="row">

          <div className="card-body custom-card-body-left">
            <h5 className="card-title"> {title} </h5>
            <p className="card-text item-desc"> {description} </p>
            <button className="btn custom-card-button" onClick={handleClick}>Read more</button>
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