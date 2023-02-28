import React, {useContext} from "react";
import itemContext from "../contexts/itemContext";
import "../styles/itempost.css";

const SelectedItemPost = () => {

    const selectedItem = useContext(itemContext);

    return (
        <div className="itempost-outer">
            <div className="item-post-row">
                <h1>{selectedItem.item.name}</h1>
                <h1>{selectedItem.item.rating ? selectedItem.item.rating : 4.5}/5</h1>
            </div>
        
            <div className="cardcontainer">
            {selectedItem.item.images ? selectedItem.item.images.map((image, i) => (<img className="custom-itempost-image" src={image['data_url']} alt="..." />)) : 
            <img className="custom-itempost-image" src="https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg" alt="..." />}
            </div>
            <div className="row">
                <div className="col-6">
                    <div className="item-post-row">
                        <h3>{selectedItem.item.owner ? selectedItem.item.owner : "owner not shown"}</h3>
                        <h1>${selectedItem.item.price}</h1>
                    </div>
                    <div className="item-post-row">
                        <p>{selectedItem.item.description}</p>
                    </div>
                </div>
                <div className="col-6">
                    <h1>Placeholder for future components</h1>
                    <h1>Placeholder for future components</h1>
                    <h1>Placeholder for future components</h1>
                    <h1>Placeholder for future components</h1>
                </div>
            </div>
        </div>
    );
};

export default SelectedItemPost;