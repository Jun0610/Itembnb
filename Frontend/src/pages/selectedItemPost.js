import React, { useContext, useEffect, useState } from "react";
import itemContext from "../contexts/itemContext";
import userContext from "../contexts/userContext";
import ItemService from "../tools/itemsService";
import ReservationService from "../tools/reservationService";
import { getUserData } from "../tools/userServices";
import Loading from "../components/Loading";
import "../styles/itempost.css";
import BorrowingRequestList from "../components/borrowingRequestList";

const brList = [
    {
        start_date: "04-13-2023", 
        end_date: "04-14-2023",
        borrower: {
            id: 1, 
            name: 'Borrower 1',
            email: 'Borrower1@gmail.com',
        }
    },
    {
        
        start_date: "04-15-2023", 
        end_date: "04-16-2023",
        borrower: {
            id: 1, 
            name: 'Borrower 2',
            email: 'Borrower2@gmail.com',
        }
    },
    {
        
        start_date: "04-17-2023", 
        end_date: "04-18-2023",
        borrower: {
            id: 1, 
            name: 'Borrower 3',
            email: 'Borrower3@gmail.com',
        }
    },
  ];


const SelectedItemPost = () => {

    const selectedItem = useContext(itemContext);
    const authUser = useContext(userContext);
    const [owner, setOwner] = useState({});
    const [userReserv, setUserReserv] = useState({});

    //make sure user is logged in and get item details
    useEffect(() => {
        if (sessionStorage.getItem('curUser') !== null) {
            authUser.login(JSON.parse(sessionStorage.getItem('curUser')))
        }
        const itemPageSetUp = async () => {
            const itemId = window.location.href.split('/')[4]
            const userId = window.location.href.split('/')[6]

            //get item data
            const itemData = await ItemService.getItem(itemId);
            selectedItem.setSelectedItem(itemData.data);

            //get reservation data for user
            setUserReserv(await ReservationService.getUserReservation(itemId, userId));

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

    if (selectedItem.item !== null && JSON.stringify(userReserv) !== '{}' && JSON.stringify(owner) !== '{}') {
        console.log(userReserv);
        if (userReserv.data != null && userReserv.data.status === "pending") {
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
                        <div className="col-6" style={{ borderRight: "2px solid #ffec18" }}>
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
                        <div className="col-6" style={{ borderLeft: "2px solid #ffec18" }}>
                            <div className="item-post-row">
                                <h4 > {selectedItem.item.ownerId ? owner.name : "owner not shown"} has been notified of your reservation</h4>

                            </div>
                            <div className="item-post-row">
                                <p >Please be patient as they process your request!</p>
                            </div>


                            {/* <div className='pendingContainter'>


                            </div> */}

                        </div>
                    </div>
                </div>
            );

        } else if (userReserv.data !== null && (userReserv.data.status === "approved" || userReserv.data.status === "active")) {
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
                        <div className="col-6" style={{ borderRight: "2px solid #ffec18" }}>
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
                        <div className="col-6" style={{ borderLeft: "2px solid #ffec18" }}>
                            <div className="item-post-row">
                                <h4 > {selectedItem.item.ownerId ? owner.name : "owner not shown"} has approved your reservation!</h4>

                            </div>
                            <div className="item-post-row">
                                <p>Enjoy using {selectedItem.item.ownerId ? owner.name : "owner not shown"}'s {selectedItem.item.name} and make sure to return it on time!</p>
                            </div>


                            {/* <div className='pendingContainter'>


                            </div> */}

                        </div>
                    </div>
                </div>
            );
        } else {
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
                        <div className="col-6" style={{ borderRight: "2px solid #ffec18" }}>
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
                        <div className="col-6" style={{ borderLeft: "2px solid #ffec18" }}>
                            <BorrowingRequestList />
                            <h1>Placeholder for future components</h1>
                            <h1>Placeholder for future components</h1>
                            <h1>Placeholder for future components</h1>
                        </div>
                    </div>
                </div>
            );
        }

    } else {
        return <Loading />
    }

};

export default SelectedItemPost;