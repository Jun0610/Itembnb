import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import userContext from "../contexts/userContext";
import UserService from '../tools/userService';
import SocketService, { socket } from '../tools/socketService';

const EmailDisplayItemPost = () => {
    const { itemId, ownerId } = useParams();
    const authUser = useContext(userContext);
    const nav = useNavigate();

    async function loginUser() {
        const data = await UserService.getUserData(ownerId);
        authUser.login(data.data);
        sessionStorage.setItem('curUser', JSON.stringify(data.data));
        SocketService.connect();
        socket.emit('sendId', data.data.email)
        nav(`/display-item-post/${itemId}`)
    }

    loginUser();

}

export default EmailDisplayItemPost;