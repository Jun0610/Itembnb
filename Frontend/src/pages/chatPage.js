import { useEffect, useContext } from 'react';
import userContext from '../contexts/userContext';
import SocketService, { socket } from '../tools/socketService';
import ChatComponent from '../components/chatComp';
import chatContext from '../contexts/chatContext';
import { NavLink } from 'react-router-dom';
import '../styles/chatPage.css'

const ChatPage = ()  =>  {

  	const authUser = useContext(userContext);
  	const currChat = useContext(chatContext);

  	currChat.setUser(authUser.user);

	const OtherUserView =  () => {

		return (
			<div className='other-user-view'>
				{currChat.otherUser != null &&
					<div>
						<h2>
							{currChat.otherUser.name}
						</h2>
						<NavLink to={`/user/${currChat.otherUser._id}`}>
							<button className='profile-btn'>
								View profile
							</button>
						</NavLink>
					</div>
				}
				{currChat.otherUser == null &&
					<h2>
						No user selected
					</h2>
				}
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
			
		</div>
	);
	
}

export default ChatPage;

