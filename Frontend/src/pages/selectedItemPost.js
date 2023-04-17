import React, { useContext, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import userContext from "../contexts/userContext";
import ItemService from "../tools/itemsService";
import UserService from "../tools/userService.js";
import ReservationService from "../tools/reservationService";
import { Loading } from "../components/Loading";
import ItemCalendar from "../components/borrowerCalendar";
import { UserInfo } from "../components/smallInfoBox";
import RatingStar from "../components/ratingStar";
import "../styles/itempost.css";
import SocketService, { socket } from '../tools/socketService';
import ReviewService from "../tools/reviewService";
import { ReviewOnSubjectPage } from '../components/reviewComponents';

const SelectedItemPost = () => {
    const { itemId } = useParams(); // id of selected item
    const authUser = useContext(userContext);
    const [owner, setOwner] = useState({});
    const [userReserv, setUserReserv] = useState({});
    const [reservSuccess, setReservSuccess] = useState(false);
    const [selectedItem, setSelectedItem] = useState({});

    // for handling reviews/ratings
    const [rating, setRating] = useState(null);
    const [originalItemReviews, setOriginalItemReviews] = useState([]);
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

    //========== review section start ===========

    //checking item review
    useEffect(() => {
        const getItemReviews = async () => {
            //get reservation data for user
            const itemReviews = await ReviewService.getReviewsForItem(itemId);
            setDisplayedItemReviews(itemReviews.data);
            setOriginalItemReviews(itemReviews.data);
            setRating(itemReviews.rating);
        }
        getItemReviews();
    }, [])

    const onEditReview = (review, idx) => {
        // update the average rating on item
        displayedItemReviews[idx].review = review;
        setDisplayedItemReviews(displayedItemReviews);
        setOriginalItemReviews(displayedItemReviews);

        var totalRating = 0;
        for (const ir of displayedItemReviews) totalRating += parseInt(ir.review.rating);

        setRating(1.0 * totalRating / displayedItemReviews.length)
    }

    const onDeleteReview = (review, idx) => {
        const deleteReview = async (review, idx) => {
            await ReviewService.deleteReview(review._id);
            setDisplayedItemReviews(displayedItemReviews.filter((_, i) => idx !== i));
            setOriginalItemReviews(originalItemReviews.filter((_, i) => idx !== i));

            // update the average rating of the item
            var totalRating = 0;
            const newItemReviews = displayedItemReviews.filter((_, i) => idx !== i);
            for (const ir of newItemReviews) totalRating += parseInt(ir.review.rating);

            setRating(1.0 * totalRating / newItemReviews.length);

            alert("Successfully deleted your review!");
        }
        deleteReview(review, idx);
    }

    const filterStar = (i) => {
        setDisplayedItemReviews(originalItemReviews.filter((e) => e.review.rating === i));
    }

    const resetFilter = () => {
        setDisplayedItemReviews(originalItemReviews);
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

    const userIsOwner = () => {
        return authUser != undefined &&
            authUser.user.user != null &&
            selectedItem.ownerId === authUser.user.user._id;
    }

    const ownerButton = () => {

        // links to the owner view of the item post page (display-item-post)
        if (userIsOwner()) {
            return <NavLink to={`/display-item-post/` + selectedItem._id}><button className="defaultButton text-base" style={{ display: "inline-block" }} >Owner View</button></NavLink >
        }
    }

    if (selectedItem !== null) {
        return (
            <div>
                <div className="itempost-outer">
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
                                <h5>{selectedItem.description}</h5>
                                <div style={{ paddingLeft: "4rem" }}>

                                </div>
                                <h4>${selectedItem.price}/day</h4>
                            </div>
                            <div className="item-post-row">
                                <p>Date Posted: {new Date(selectedItem.dateCreated).toDateString()}</p>
                            </div>
                            <UserInfo user={owner} />
                            <div className="font-bold">
                                Reviews ({originalItemReviews.length})
                                <NavLink to={"/create-item-review/" + itemId} className="plainLink"><button className="defaultButton">Make Review</button></NavLink>
                            </div>
                            <div className='flex gap-4'>
                                {stars.map((e, i) => (<div onClick={() => filterStar(e)} style={{ cursor: "pointer" }}>{e}-star</div>))}
                                <div onClick={resetFilter} style={{ cursor: "pointer" }}>Reset</div>
                            </div>
                            <div className="m-3 h-48 overflow-auto grid grid-rows-auto rounded-lg">
                                {displayedItemReviews.length > 0 ?
                                    displayedItemReviews.map((e, i) => (
                                        <ReviewOnSubjectPage key={i} reviewObject={e} authUser={authUser} onDeleteReview={onDeleteReview} onEditReview={onEditReview} idx={i} />
                                    )) :
                                    <p>There are no reviews!</p>
                                }
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