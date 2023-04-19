import React, { useEffect, useContext } from "react";
import userContext from "../contexts/userContext";
import SocketService, { socket } from '../tools/socketService';
import ItemService from '../tools/itemsService';
import Post from "../components/post";
import { Loading } from "../components/Loading";
import Browsing from "../components/Browsing";

import "../styles/homepage.css";

const Homepage = () => {

    const [itemPosts, setItemPosts] = React.useState([]);
    const [itemRequests, setItemRequests] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isLoadingItem, setIsLoadingItem] = React.useState(true);
    const selectedUser = useContext(userContext);

    useEffect(() => {
        if (sessionStorage.getItem('curUser') !== null) {
            selectedUser.login(JSON.parse(sessionStorage.getItem('curUser')))
            SocketService.connect();
            socket.emit('sendId', JSON.parse(sessionStorage.getItem('curUser')).email);
        }
    }, [])

    useEffect(() => {
        async function getItemPosts() {
            // load items from database
            const itemInfo = await ItemService.getItemPosts();
            setItemPosts(itemInfo.data);
            setIsLoadingItem(false);
        }
        getItemPosts();
    }, []);

    useEffect(() => {
        async function getRequestPosts() {
            await fetch("http://localhost:8888/api/request/get-request-posts")
                .then((response) => response.json())
                .then((data) => { console.log(data.data); setItemRequests(data.data); setIsLoading(false) });
        }
        getRequestPosts();
    }, []);

    if (isLoading || isLoadingItem) return (<Loading />);

    else
        return (
            <div>
                <Browsing />
                <div className='h1-container'>
                    <h1 className='item-post-header'>Item posts</h1>
                </div>

                <div className='cardcontainer'>
                    {itemPosts.map((item) => (
                        <Post key={item._id} post={item} isRequest={false} />
                    ))}
                </div>
                <div className='h1-container' style={{ width: "20rem" }}>
                    <h1 className='item-post-header'>Item requests</h1>

                </div>

                <div className='cardcontainer' >
                    {itemRequests.map((request) => (
                        <Post key={request._id} post={request} isRequest={true} />
                    ))}
                </div>
            </ div>
        );
};

export default Homepage;