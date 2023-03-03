import React, { useContext, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/post.css';
import itemContext from '../contexts/itemContext';
import userContext from '../contexts/userContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { favoritingItem, unfavoritingItem, getUserData } from '../tools/userServices';

const Post = ({ post, isRequest }) => {
	const title = post.name;
	const description = post.description;
	const price = post.price;

	const rating = 4;

	const selectedItem = useContext(itemContext);
	console.log(selectedItem);
	const selectedUser = useContext(userContext);
	console.log(selectedUser);

	//need to set the favorite status based on whether the item is favorited or not
	const [favStatus, setFavStatus] = useState('unfavorite')

	//grabbing favorite status from db
	useEffect(() => {
		async function getFavStatus() {
			if (isRequest || sessionStorage.getItem('curUser') === null) {
				setFavStatus('unfavorite');
				return;
			}
			const res = await getUserData(selectedUser.user.user._id)

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
		if (!isRequest) {
			console.log('clicked');
			console.log(post);
			console.log(selectedItem);
			selectedItem.setSelectedItem(post);
			nav(`/selected-item-post/${post._id}`);
		}
		else {
			nav(`/display-request-post/${post._id}`)
		}
	};

	const handleOwnerClick = () => {
		if (!isRequest) {
			selectedItem.setSelectedItem(post);
			nav(`/display-item-post/${post._id}`);
		}
		else {
			nav(`/display-request-post/${post._id}`)
		}
	}

	//onClick function to handle favoriting items
	const favoriteItem = async () => {
		try {
			if (sessionStorage.getItem('curUser') === null) {
				alert('Log in or sign up to favorite an item!')
				return;
			}
			if (favStatus === 'favorite') {
				const res = await unfavoritingItem(post._id, selectedUser.user.user._id);
				if (res.status === 400) {
					throw new Error(res.data)
				}
				setFavStatus('unfavorite');
			} else {
				const res = await favoritingItem(post._id, selectedUser.user.user._id);
				if (res.status === 400) {
					throw new Error(res.data)
				}
				setFavStatus('favorite');
			}
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className='card'>
			{post.images && post.images[0] ?
				<img src={post.images[0]['data_url'] ? post.images[0]['data_url'] : post.images[0]} className='card-img-top custom-card-img' alt='...' /> :
				isRequest ?
					<img src={require('../resources/itembnb-website-favicon-color.png')} className='req-img' alt='...' /> :
					<img src='https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'
						className='card-img-top custom-card-img'
						alt='...' />
			}


			{!isRequest && <FontAwesomeIcon icon={faHeart} className={favStatus} size='lg' onClick={favoriteItem} />}

			<div className='row'>
				<div className='card-body custom-card-body-left'>
					<h4 className='card-title'> {title} </h4>
					<p className='card-text item-desc'> {description} </p>
					<button className='btn custom-card-button' onClick={selectedUser.user.user && selectedUser.user.user._id === post.ownerId ? handleOwnerClick : handleClick}>
						Read more
					</button>
				</div>

				{!isRequest &&
					<div className='card-body custom-card-body-right'>
						<p className='card-text item-pr'> ${price} </p>
						<p className='card-text item-pr'> {rating}/5 </p>
					</div>}
			</div>
		</div>
	);
};

export default Post;
