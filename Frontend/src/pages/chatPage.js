import Talk from 'talkjs';
import { useEffect, useContext } from 'react';
import userContext from '../contexts/userContext';
import SocketService, { socket } from '../tools/socketService';
import ChatComponent from '../components/chatComp';
import '../styles/chatPage.css'

const ChatPage = ()  =>  {

  const authUser = useContext(userContext);

  useEffect(() => {
    if (sessionStorage.getItem('curUser') !== null) {
      authUser.login(JSON.parse(sessionStorage.getItem('curUser')));

      SocketService.connect();
      socket.emit('sendId', JSON.parse(sessionStorage.getItem('curUser')).email);
    }
  }, []);

  return (
    <div className='chat-page' >
      <h1>Chat Page</h1>
      <ChatComponent user={authUser.user} />
      
    </div>
  );
  
}

export default ChatPage;

