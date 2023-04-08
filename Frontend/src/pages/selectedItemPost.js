import React, { useContext, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import userContext from "../contexts/userContext";
import ItemService from "../tools/itemsService";
import UserService from "../tools/userService.js";
import ReservationService from "../tools/reservationService";
import { Loading, LoadingSmall } from "../components/Loading";
import ItemCalendar from "../components/borrowerCalendar";
import "../styles/itempost.css";
import SocketService, { socket } from '../tools/socketService';
import ReviewService from "../tools/reviewService";
import { useNavigate } from 'react-router-dom';

const SelectedItemPost = () => {
    const { itemId } = useParams(); // id of selected item
    const authUser = useContext(userContext);
    const [owner, setOwner] = useState({});
    const [userReserv, setUserReserv] = useState({});
    const [reservSuccess, setReservSuccess] = useState(false);
    const [selectedItem, setSelectedItem] = useState({});
    const [itemReviews, setItemReviews] = useState([]);
    const [itemRating, setItemRating] = useState(null);
    const [editReviewIdx, setEditReviewIdx] = useState(null);
    const [review, setReview] = useState(null);
    const [rating, setRating] = useState(null);
    const nav = useNavigate();

    //make sure user is logged in and get item details
    useEffect(() => {

        const itemPageSetUp = async () => {
            // log in user automatically if session storage indicates they've already logged in, in another tab
            if (sessionStorage.getItem('curUser') !== null) {
                authUser.login(JSON.parse(sessionStorage.getItem('curUser')));
                //get reservation data for user
                setUserReserv(await ReservationService.getUserReservation(itemId, JSON.parse(sessionStorage.getItem('curUser'))._id));
                SocketService.connect();
                socket.emit('sendId', JSON.parse(sessionStorage.getItem('curUser')).email);
            }

            //get item data
            const itemData = await ItemService.getItem(itemId);
            setSelectedItem(itemData.data);

            if (itemData.data.ownerId) {
                const getOwnerData = async () => {
                    const res = await UserService.getUserData(itemData.data.ownerId);
                    setOwner(res.data);
                }

                getOwnerData();
            }
        }


        itemPageSetUp();

    }, [])

    //re-render reservation info part after item is reserved
    useEffect(() => {

        const reRender = async () => {
            //get reservation data for user
            if (sessionStorage.getItem('curUser') !== null) {
                setUserReserv(await ReservationService.getUserReservation(itemId, JSON.parse(sessionStorage.getItem('curUser'))._id));
            }
        }

        reRender();

    }, [reservSuccess])

    //checking item review
    useEffect(() => {
        const getItemReviews = async () => {
            //get reservation data for user
            if (sessionStorage.getItem('curUser') !== null) {
                const itemReviews = await ReviewService.getReviewByItem(itemId)
                setItemReviews(itemReviews.data)
                setItemRating(itemReviews.rating)
            }
        }
        getItemReviews();
    }, [])

    const reservationInfo = () => {
        if (!authUser.user.isAuth) {
            return (
                <div className="col-6" style={{ borderLeft: "2px solid #ffec18" }}>
                    <p>You are not logged in and cannot reserve this item!</p>
                </div>
            );
        }
        if (JSON.stringify(userReserv) !== "{}" && userReserv.data !== null) {
            if (userReserv.data.status === "pending") {
                return (
                    <div className="col-6" style={{ borderLeft: "2px solid #ffec18" }}>
                        <div className="item-post-row">
                            <h4 > {selectedItem.ownerId ? owner.name : "owner not shown"} has been notified of your reservation</h4>

                        </div>
                        <div className="item-post-row">
                            <p >Please be patient as they process your request!</p>
                        </div>

                        {/* <div className='pendingContainter'>
                        </div> */}

                    </div>
                );
            }
            else if (userReserv.data.status === "approved" || userReserv.data.status === "active") {
                return (
                    <div className="col-6" style={{ borderLeft: "2px solid #ffec18" }}>
                        <div className="item-post-row">
                            <h4 > {selectedItem.ownerId ? owner.name : "owner not shown"} has approved your reservation!</h4>

                        </div>
                        <div className="item-post-row">
                            <p>Enjoy using {selectedItem.ownerId ? owner.name : "owner not shown"}'s {selectedItem.name} and make sure to return it on time!</p>
                        </div>


                        {/* <div className='pendingContainter'>
                            </div> */}

                    </div>);
            }

        } else {
            return (
                <div className="col-6">
                    <ItemCalendar itemOwner={owner} selectedItem={selectedItem} setReservSuccess={setReservSuccess} />
                </div>
            );
        }

    }

    const ownerInfo = () => {
        if (Object.keys(owner).length)
            return (
                <div className="owner">
                    <div className="owner-details">
                        <NavLink to={"/user/" + owner._id}>
                            <h4 className='owner-name'>Owner: <span style={{ fontWeight: "600" }}>{selectedItem.ownerId ? owner.name : "owner not shown"}</span> </h4>

                        </NavLink>
                        <p className='owner-desc'>{owner.profileDesc || "This user has no profile description."}</p>
                    </div>

                    <img src={owner.profilePic} alt="" className="owner-img" />

                </div>);

        return (
            <div className="owner">
                <div className="owner-details">
                    <NavLink to={"/user/" + owner._id}>
                        <h4 className='owner-name'>Owner: <span style={{ fontWeight: "600" }}></span> </h4>

                    </NavLink>
                    <p className='owner-desc'>Loading...</p>
                </div>

                <LoadingSmall />

            </div>
        );
    }

    // edit owner review
    const editOwnerReview = (i) => {
        const updateReview = async () => {
            // update in database and frontend
            itemReviews[i].review.reviewTxt = review
            itemReviews[i].review.rating = rating
            itemReviews[i].review.dateModified = new Date(Date.now())
            await ReviewService.updateReview(itemReviews[i].review)
            setEditReviewIdx(null)
            setReview(null)
            setRating(null)
            alert("Successfully edited your review!")
        }

        if (editReviewIdx === i) updateReview()
        else {
            setEditReviewIdx(i)
            setReview(itemReviews[i].review.reviewTxt)
            setRating(itemReviews[i].review.rating)
        }
    }

    const onDeleteReview = (idx) => {
        const deleteReview = async (idx) => {
            await ReviewService.deleteReview(itemReviews[idx].review._id, itemId)
            setItemReviews(itemReviews.filter((_, i) => idx !== i))
            alert("Successfully deleted your review!");
        }
        deleteReview(idx);
    }

    const onInputChange = (e) => {
        if (e.target.id === "review") setReview(e.target.value)
        else setRating(e.target.value)
    }

    if (selectedItem !== null) {

        return (
            <div>
                <div className="itempost-outer">
                    <div className="item-post-row">
                        <h1>{selectedItem.name}</h1>
                        <h1>{itemRating}/5</h1>
                    </div>

                    <div className="cardcontainer">
                        <div className="grid grid-flow-col auto-cols-max">
                            {selectedItem.images ? selectedItem.images.map((image, i) => (<img className="custom-itempost-image mr-3" src={image['data_url'] ? image['data_url'] : image} alt="..." key={i} />)) :
                                <img className="custom-itempost-image" src="https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg" alt="..." />}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6" style={{ borderRight: "2px solid #ffec18" }}>
                            <div className="item-post-row">
                                <h5>{selectedItem.description}</h5>
                                <div style={{ paddingLeft: "4rem" }}>

                                </div>
                                <h4>${selectedItem.price}/day</h4>
                            </div>
                            <div className="item-post-row">
                                <p>Date Posted: {new Date(selectedItem.dateCreated).toDateString()}</p>
                            </div>
                            {ownerInfo()}
                            <div className="font-bold">
                                Reviews
                            </div>
                            <div className="m-3 h-48 overflow-auto grid grid-rows-auto rounded-lg">
                                {itemReviews.map((e, i) => (
                                    <div key={i} className="grid border-2 rounded-3xl border-yellow-400 m-2 p-2">
                                        <div className="grid grid-cols-3 justify-start">
                                            <div>
                                                <img onClick={() => {nav(`/user/${e.user._id}`)}} src={e.user.profilePic} alt="" className="object-scale-down h-16" style={{ cursor: "pointer" }}/>
                                            </div>
                                            <div className="grid grid-rows-2 ml-2">    
                                                <div>   
                                                    {e.user.name}
                                                </div>
                                                <div>   
                                                    {new Date(e.review.dateModified).toDateString()}
                                                </div>
                                            </div>
                                            {
                                                e.user._id === authUser.user.user._id && editReviewIdx === i ? 
                                                <div>
                                                    <input id="rating" className="mt-1 border border-slate-300 py-2 rounded-md" type="number" min="1" max="5" value={rating} onChange={onInputChange} />
                                                </div>
                                                : 
                                                <div className="justify-self-end">   
                                                        {e.review.rating}/5
                                                </div>
                                            }
                                        </div>
                                        {
                                            e.user._id === authUser.user.user._id && editReviewIdx === i ? 
                                            <div>
                                                <input id="review" className="mt-1 block border border-slate-300 w-full py-2 rounded-md" type="text" value={review} onChange={onInputChange} />
                                            </div>
                                            : 
                                            <div className="mt-3"> 
                                                {e.review.reviewTxt}
                                            </div>
                                        }
                                        {e.user._id === authUser.user.user._id ? 
                                        <div className="flex justify-end gap-4">
                                            <i className="fa-solid fa-trash mt-1 icon-3x" style={{ cursor: "pointer" }} onClick={() => {onDeleteReview(i)}}></i>
                                            <i className={editReviewIdx && editReviewIdx === i ? "place-self-end fa-solid fa-save mt-1 icon-3x" : "place-self-end fa-solid fa-pencil mt-1 icon-3x"} style={{ cursor: "pointer" }} onClick={() => editOwnerReview(i)}></i>
                                        </div>
                                         : <div></div>}
                                    </div>))}
                            </div>
                        </div>
                        {reservationInfo()}
                    </div>
                </div >
            </div>
        );
    } else {
        return <Loading />
    }

};

export default SelectedItemPost;