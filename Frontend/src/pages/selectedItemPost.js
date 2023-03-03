import React, { useContext, useEffect, useState } from "react";
import itemContext from "../contexts/itemContext";
import userContext from "../contexts/userContext";
import ItemService from "../tools/itemsService";
import { getUserData } from "../tools/userServices";
import "../styles/itempost.css";

const SelectedItemPost = () => {

    const selectedItem = useContext(itemContext);
    const authUser = useContext(userContext);
    const [owner, setOwner] = useState({});

    //make sure user is logged in and get item details
    useEffect(() => {
        if (sessionStorage.getItem('curUser') !== null) {
            authUser.login(JSON.parse(sessionStorage.getItem('curUser')))
            console.log('test');
        }
        const itemPageSetUp = async () => {
            const itemId = window.location.href.split('/')[4]
            console.log(itemId);
            const itemData = await ItemService.getItem(itemId);
            console.log('itemData:', itemData.data);
            selectedItem.setSelectedItem(itemData.data);

            if (itemData.data.ownerId) {
                const getOwnerData = async () => {
                    const res = await getUserData(itemData.data.ownerId);
                    setOwner(res.data);
                }

                getOwnerData();
            }
        }



        itemPageSetUp();
    }, [])

    console.log('selectedItem', selectedItem);
    console.log('user', authUser);
    if (selectedItem.item !== null) {
        return (
            <div className="itempost-outer">
                <div className="item-post-row">
                    <h1>{selectedItem.item.name}</h1>
                    {/* NEED TO FIX REVIEWS */}
                    <h1>4/5</h1>
                </div>

                <div className="cardcontainer">
                    <div className="grid grid-flow-col auto-cols-max">
                        {selectedItem.item.images ? selectedItem.item.images.map((image, i) => (<img className="custom-itempost-image mr-3" src={image['data_url'] ? image['data_url'] : image} alt="..." key={i} />)) :
                            <img className="custom-itempost-image" src="https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg" alt="..." />}
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <div className="item-post-row">
                            <h4>{selectedItem.item.description}</h4>

                            <h4>${selectedItem.item.price}/day</h4>
                        </div>
                        <div className="item-post-row">
                            <p>Date Posted: {new Date(selectedItem.item.dateCreated).toDateString()}</p>
                        </div>
                        <div className="owner">
                            <h3 className="about-owner">About the owner: {selectedItem.item.ownerId ? owner.name : "owner not shown"}</h3>
                            <img src={owner.profilePic} alt="" className="owner-img" />
                            <p className='owner-desc'>{owner.profileDesc} Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, temporibus animi. Ipsum ratione possimus explicabo placeat dolorum, eligendi, amet iste corrupti facilis rem porro eos. Accusamus, aliquid fugiat? Culpa, porro.</p>
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
    }

};

export default SelectedItemPost;