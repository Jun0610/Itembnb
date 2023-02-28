import React, { useContext, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/post.css';
import itemContext from '../contexts/itemContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { favoritingItem, unfavoritingItem } from '../tools/userServices';

const Post = ({ post, isRequest, favorites }) => {
	const title = post.name;
	const description = post.description;
	const price = post.price;

	const rating = 4;

	const selectedItem = useContext(itemContext);

	const nav = useNavigate();

	const handleClick = () => {
		console.log('clicked');
		selectedItem.setSelectedItem(post);
		nav('/selected-item-post');
	};

	//need to set the favorite status based on whether the item is favorited or not
	const [favStatus, setFavStatus] = useState(() => {
		if (isRequest || favorites.length === 0) {
			return 'unfavorite';
		}
		for (const item of favorites) {
			if (item === post._id) {
				return 'favorite'
			}
		}
		return 'unfavorite'
	});


	//onClick function to handle favoriting items
	const favoriteItem = async () => {
		try {
			if (favStatus === 'favorite') {
				const res = await unfavoritingItem(post._id, '63fa909808cade2e5541a6ba');
				if (res.status === 400) {
					throw new Error(res.data)
				}
				setFavStatus('unfavorite');
			} else {
				const res = await favoritingItem(post._id, '63fa909808cade2e5541a6ba');
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
				<img src={post.images[0]['data_url']} className='card-img-top custom-card-img' alt='...' /> :
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
					{!isRequest &&
						<button className='btn custom-card-button' onClick={handleClick}>
							Read more
						</button>}
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
