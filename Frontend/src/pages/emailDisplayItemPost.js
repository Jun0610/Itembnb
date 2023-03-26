import React, {useContext, useEffect} from 'react';
import userContext from "../contexts/userContext";
import {useNavigate, useParams} from 'react-router-dom';
import UserService from '../tools/userService';
import SocketService, {socket} from '../tools/socketService';

const EmailDisplayItemPost = () => {
  const { itemId, ownerId } = useParams();
  const authUser = useContext(userContext);
  const nav = useNavigate();

  useEffect(() => {
    async function loginUser() {
      const data = await UserService.getUserData(ownerId);
      authUser.login(data.data);
      sessionStorage.setItem('curUser', JSON.stringify(data.data)); 
      SocketService.connect();
      socket.emit('sendId', data.data.email);
    }
    // need to login the user and set to the authUser thing
    // need to redirect user
    loginUser().then(() => {
      nav(`/display-item-post/${itemId}`)
    });
  }, []);

  return (<div></div>)
}

export default EmailDisplayItemPost;