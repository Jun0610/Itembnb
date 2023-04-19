import React, { useContext, useEffect, useState, useRef } from 'react';
import userContext from '../contexts/userContext';
import UserService from '../tools/userService.js';
import ItemService from '../tools/itemsService';
import FavPost from "../components/FavPost";
import Loading from '../components/Loading';
import '../styles/favItemPage.css';

const FavoriteItems = () => {

    const [favItems, setFavItems] = useState([]);
    const [viewMode, setViewMode] = useState('More Details');
    const [isLoading, setIsLoading] = useState(true);
    const curUser = useContext(userContext);

    //keep user logged in on page load, get user data, load favorited items
    useEffect(() => {
        async function onLoad() {

            if (sessionStorage.getItem('curUser') === null) {
                return
            }
            try {
                curUser.login(JSON.parse(sessionStorage.getItem('curUser')));
                const userId = JSON.parse(sessionStorage.getItem('curUser'))._id;
                const res = await UserService.getUserData(userId);
                const userData = res.data;
                let newFavItems = [];

                for (const item of userData.favoritedItems) {
                    const data = await ItemService.getItemMin(item);
                    if (data.data != null) {
                        newFavItems.push(data.data);
                    }

                }
                setFavItems(newFavItems);
                setIsLoading(false);


            } catch (err) {
                console.log(err);
            }

        }

        onLoad();

    }, [useRef(favItems)])


    //only display favorited items if user is logged in
    if (sessionStorage.getItem('curUser') !== null) {
        const handleViewMode = () => {
            if (viewMode === 'More Details') {
                setViewMode('Less Details');
            } else {
                setViewMode('More Details');
            }

        }
        if (isLoading) {
            return <Loading />
        } else {
            return (
                <>
                    <div className='heading'>
                        <div></div>
                        <h1 className='title'>Favorited Items</h1>
                        <button className='btn-mode' onClick={handleViewMode}>{viewMode}</button>
                    </div>

                    <div className='fav-item-page-container'>
                        {favItems.map((item) => (
                            <FavPost key={item._id} post={item} isRequest={false} favItems={favItems} setFavItems={setFavItems} viewMode={viewMode} />
                        ))}

                    </div>
                    {favItems.length === 0 && <h2 className='no-fav'>You have no favorited items yet!</h2>}


                </>
            )
        }



    } else {
        return <h1>You must be logged in to access your favorite items.</h1>
    }



}

export default FavoriteItems