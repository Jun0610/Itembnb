import React, {useContext, useEffect} from 'react';
import userContext from "../contexts/userContext";
import {useNavigate, useParams} from 'react-router-dom';
import UserService from '../tools/userService';

const EmailDisplayItemPost = () => {
  const { userId, itemId } = useParams();
  const authUser = useContext(userContext);
  const nav = useNavigate();

  useEffect(() => {
    async function loginUser() {
        const data = await UserService.getUserData(userId);
        authUser.login(data.data);
        sessionStorage.setItem('curUser', JSON.stringify(data.data)); 
    }
    // need to login the user and set to the authUser thing
    // need to redirect user
    loginUser().then(() => nav(`display-item-post/${itemId}`));
  }, []);

  return (
    <div></div>
  )
}

export default EmailDisplayItemPost