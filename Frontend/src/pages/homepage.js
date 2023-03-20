import React, { useEffect, useContext } from "react";
import Post from "../components/post";
import Loading from "../components/Loading";
import userContext from "../contexts/userContext";

import "../styles/homepage.css";
import {socket} from "../tools/socketService";

const Homepage = () => {

    const [itemPosts, setItemPosts] = React.useState([]);
    const [itemRequests, setItemRequests] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isLoadingItem, setIsLoadingItem] = React.useState(true);
    const selectedUser = useContext(userContext);


    useEffect(() => {
        if (sessionStorage.getItem('curUser') !== null) {
            selectedUser.login(JSON.parse(sessionStorage.getItem('curUser')))
        }
    }, [])

    useEffect(() => {
        async function getItemPosts() {
            await fetch("http://localhost:8888/api/item/get-item-posts")
                .then((response) => response.json())
                .then((data) => { console.log(data.data); setItemPosts(data.data); setIsLoadingItem(false) });
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

    useEffect(() => {
        if (socket.connected) {
            console.log('user: ', selectedUser);
            socket.on(`emitAnotherUser`, (response) => alert(`Hi! ${response}`));
        }
    }, [selectedUser])

    if (isLoading || isLoadingItem) return (<Loading />);

    else
        return (
            <div>
                <h1 className='item-post-header'>Item posts</h1>
                <div className='cardcontainer'>
                    {itemPosts.map((item) => (
                        <Post key={item._id} post={item} isRequest={false} />
                    ))}
                </div>
                <h1 className='item-post-header'>Item requests</h1>
                <div className='cardcontainer'>
                    {itemRequests.map((request) => (
                        <Post key={request._id} post={request} isRequest={true} />
                    ))}
                </div>
            </div>
        );
};

export default Homepage;