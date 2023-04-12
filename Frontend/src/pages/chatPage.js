import { useEffect, useContext } from 'react';
import userContext from '../contexts/userContext';
import SocketService, { socket } from '../tools/socketService';
import ChatComponent from '../components/chatComp';
import chatContext from '../contexts/chatContext';
import '../styles/chatPage.css'



const ChatPage = ()  =>  {

  	const authUser = useContext(userContext);
  	const currChat = useContext(chatContext);

  	currChat.setUser(authUser.user);

	const OtherUserView =  () => {

		return (
			<div className='other-user-view'>
					<h2>
						Example username
					</h2>
					<h3>
						example email
					</h3>
			</div>
		)
	}
	
	useEffect(() => {
		if (sessionStorage.getItem('curUser') !== null) {
			authUser.login(JSON.parse(sessionStorage.getItem('curUser')));

			SocketService.connect();
			socket.emit('sendId', JSON.parse(sessionStorage.getItem('curUser')).email);
		}
	}, []);

	return (
		<div className='chat-page' >
			<ChatComponent user={authUser.user} />
			<OtherUserView otherUser={currChat.otherUser}/>
			<button onClick={() => {console.log(currChat.otherUser)}}>ClickMe</button>
		</div>
	);
	
}

export default ChatPage;

