import { useContext } from 'react';
import userContext from "../contexts/userContext";
import { useNavigate, useParams } from 'react-router-dom';
import UserService from '../tools/userService';
import SocketService, { socket } from '../tools/socketService';

const EmailChatPage = () => {
    const { id } = useParams();
    const authUser = useContext(userContext);
    const nav = useNavigate();

    async function loginUser() {
        console.log(id);
        const data = await UserService.getUserData(id);
        authUser.login(data.data);
        sessionStorage.setItem('curUser', JSON.stringify(data.data));
        SocketService.connect();
        socket.emit('sendId', data.data.email);
        nav(`/chat`);
    }

    loginUser();

}

export default EmailChatPage;