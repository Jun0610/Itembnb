import {useContext} from 'react';
import userContext from "../contexts/userContext";
import {useNavigate, useParams} from 'react-router-dom';
import UserService from '../tools/userService';
import SocketService, {socket} from '../tools/socketService';

const EmailSelectedItemPost = () => {
  const { itemId, ownerId } = useParams();
  const authUser = useContext(userContext);
  const nav = useNavigate();

  async function loginUser() {
    const data = await UserService.getUserData(ownerId);
    authUser.login(data.data);
    sessionStorage.setItem('curUser', JSON.stringify(data.data)); 
    SocketService.connect();
    socket.emit('sendId', data.data.email)
    nav(`/selected-item-post/${itemId}`)
  }

  loginUser();
  
}

export default EmailSelectedItemPost;