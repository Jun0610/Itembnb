import React, { useContext, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import ReactMarkdown from 'react-markdown';

import userContext from "../contexts/userContext";
import ItemService from "../tools/itemsService";
import UserService from "../tools/userService.js";
import ReservationService from "../tools/reservationService";
import ReviewService from "../tools/reviewService";
import SocketService, { socket } from '../tools/socketService';
import ItemCalendar from "../components/borrowerCalendar";
import RatingStar from "../components/ratingStar";
import { UserInfo } from "../components/smallInfoBox";
import { ReviewOnSubjectPage } from '../components/reviewComponents';
import { Loading, LoadingSmall } from "../components/Loading";

import "../styles/itempost.css";

const SelectedItemPost = () => {
    const { itemId } = useParams(); // id of selected item
    const authUser = useContext(userContext);
    const [owner, setOwner] = useState({});
    const [userReserv, setUserReserv] = useState({});
    const [reservSuccess, setReservSuccess] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // for handling reviews/ratings
    const [rating, setRating] = useState(null);
    const [originalItemReviews, setOriginalItemReviews] = useState(null);
    const [displayedItemReviews, setDisplayedItemReviews] = useState([]);
    const stars = [1, 2, 3, 4, 5];

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

    }, [itemId])

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

    //========== review section start ===========

    //checking item review
    useEffect(() => {
        const getItemReviews = async () => {
            //get reservation data for user
            const itemReviews = await ReviewService.getReviewsForItem(itemId);
            console.log("item reviews: ", itemReviews)
            setDisplayedItemReviews(itemReviews.data);
            setOriginalItemReviews(itemReviews.data);
            setRating(itemReviews.rating);
        }
        getItemReviews();
    }, [])

    const filterStar = (i) => {
        setDisplayedItemReviews(originalItemReviews.filter((e) => e.review.rating === i));
    }

    const resetFilter = () => {
        setDisplayedItemReviews(originalItemReviews);
    }

    // TODO, update function and create backend functions
    // so that this returns true if can review ?
    const canBeReviewed = () => {
        return false;
    }

    //========== review section end ============

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

    const userIsOwner = () => {
        return authUser !== undefined &&
            authUser.user.user !== null &&
            selectedItem.ownerId === authUser.user.user._id;
    }

    const ownerButton = () => {

        // links to the owner view of the item post page (display-item-post)
        if (userIsOwner()) {
            return <NavLink to={`/display-item-post/` + selectedItem._id}><button className="defaultButton text-base" style={{ display: "inline-block" }} >Owner View</button></NavLink >
        }
    }

    const reviewSection = () => {
        if (originalItemReviews == null) {
            return <LoadingSmall />
        }

        if (originalItemReviews.length === 0) {
            return (<div>
                <div className="font-bold">
                    <br />
                    <h4>Reviews ({originalItemReviews.length})</h4>

                    {canBeReviewed() &&
                        <NavLink to={"/create-item-review/" + itemId} className="plainLink"><button className="defaultButton">Make Review</button></NavLink>
                    }
                </div>

                <p className="grayText">There are no reviews!</p>
            </div>)
        }

        return (
            <div  >
                <div className="font-bold">
                    <br />
                    <h4>Reviews ({originalItemReviews.length})</h4>

                    {canBeReviewed() &&
                        <NavLink to={"/create-item-review/" + itemId} className="plainLink"><button className="defaultButton">Make Review</button></NavLink>
                    }

                </div>

                <div className='flex gap-4'>
                    {stars.map((e, i) => (<div onClick={() => filterStar(e)} className="items-center font-medium text-sm p-2 bg-yellow-100 rounded-lg" style={{ cursor: "pointer" }}>{e}-star</div>))}
                    <div className="items-center font-medium text-sm p-2 bg-yellow-100 rounded-lg" onClick={resetFilter} style={{ cursor: "pointer" }}>Reset</div>
                </div>
                <div className="m-3 overflow-auto grid grid-rows-auto rounded-lg item-review">
                    {displayedItemReviews.length > 0 ?
                        displayedItemReviews.map((e, i) => (
                            <ReviewOnSubjectPage reviewObject={e} authUser={authUser} />
                        )) :
                        <p className="grayText">There are no reviews!</p>
                    }
                </div>
            </div>
        );
    }

    if (selectedItem !== null) {
        return (
            <div>
                <div className="itempost-outer" style={{ paddingBottom: "2rem" }}>
                    <div className="item-post-row">
                        <h1>
                            {selectedItem.name}
                            &nbsp;{ownerButton()}
                        </h1>

                        <h1><RatingStar rating={rating} /></h1>
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
                                <div className="p-3" style={{ "max-height": "500px", "overflow-y": "scroll" }}>
                                    <ReactMarkdown>{selectedItem.description}</ReactMarkdown>
                                </div>
                                <div style={{ paddingLeft: "2rem" }}>

                                </div>
                                <h4>${selectedItem.price}/day</h4>
                            </div>
                            <div className="item-post-row">
                                <p>Date Posted: {new Date(selectedItem.dateCreated).toDateString()}</p>
                            </div>
                            <UserInfo user={owner} />

                            {reviewSection()}
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