import React, { useContext, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/post.css';
import '../styles/favpost.css';
import itemContext from '../contexts/itemContext';
import userContext from '../contexts/userContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import UserService from '../tools/userService.js';

const FavPost = ({ post, favItems, setFavItems, viewMode }) => {
    const title = post.name;
    const description = post.description;
    const price = post.price;

    const rating = 4;

    const selectedItem = useContext(itemContext);
    const selectedUser = useContext(userContext);

    //need to set the favorite status based on whether the item is favorited or not
    const [favStatus, setFavStatus] = useState('favorite')


    //grabbing favorite status from db
    useEffect(() => {
        async function getFavStatus() {
            if (sessionStorage.getItem('curUser') === null) {
                return;
            }
            const res = await UserService.getUserData(selectedUser.user.user._id)

            for (const item of res.data.favoritedItems) {
                if (item === post._id) {
                    setFavStatus('favorite');
                }
            }
        }
        getFavStatus();
    })

    const nav = useNavigate();

    const handleClick = () => {
        console.log('clicked');
        selectedItem.setSelectedItem(post);
        nav(`/selected-item-post/${post._id}`);
    };

    //onClick function to handle favoriting items
    const favoriteItem = async () => {
        try {
            if (sessionStorage.getItem('curUser') === null) {
                alert('Log in or sign up to favorite an item!')
                return;
            }
            if (favStatus === 'favorite') {
                const res = await UserService.unfavoritingItem(post._id, selectedUser.user.user._id);
                if (res.status === 400) {
                    throw new Error(res.data)
                }
                const newFavItems = favItems.filter(item => item._id !== post._id);
                setFavItems(newFavItems)
                setFavStatus('unfavorite');
            }
        } catch (err) {
            console.log(err);
        }
    };

    if (viewMode === 'Less Details') {
        return (
            <div className='card fav-card' onClick={handleClick} >
                {post.images && post.images[0] ?
                    <img src={post.images[0]['data_url'] ? post.images[0]['data_url'] : post.images[0]} className='card-img-top custom-card-img' alt='...' /> :
                    <img src='https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'
                        className='card-img-top custom-card-img'
                        alt='...' />
                }


                <FontAwesomeIcon icon={faHeart} className={favStatus} size='lg' onClick={favoriteItem} />

                <div className='row'>
                    <div className='card-body custom-card-body-left'>
                        <h4 className='card-title'> {title} </h4>
                        <p className='card-text item-desc'> {description} </p>
                        <button className='btn custom-card-button' onClick={handleClick}>
                            Read more
                        </button>
                    </div>

                    <div className='card-body custom-card-body-right'>
                        <p className='card-text item-pr'> ${price} </p>
                        <p className='card-text item-pr'> {rating}/5 </p>
                    </div>
                </div>
            </div>

        )
    } else {
        return (
            <>

                <div className='fav-item-pic-container'>

                    {post.images && post.images[0] ?
                        <img src={post.images[0]['data_url'] ? post.images[0]['data_url'] : post.images[0]} className='fav-item-image' alt='...' onClick={handleClick} /> :
                        <img src='https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'
                            className='fav-item-image'
                            alt='...' onClick={handleClick} />
                    }
                    <FontAwesomeIcon icon={faHeart} className={favStatus} size='lg' onClick={favoriteItem} />


                </div>
            </>

        );
    }


};

export default FavPost;
