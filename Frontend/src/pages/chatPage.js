import { useEffect, useContext, useState } from 'react';
import userContext from '../contexts/userContext';
import SocketService, { socket } from '../tools/socketService';
import ChatComponent from '../components/chatComp';
import chatContext from '../contexts/chatContext';
import { NavLink } from 'react-router-dom';
import '../styles/chatPage.css'
import ChatSearchBar from '../components/ChatSearchBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const ChatPage = ()  =>  {

  	const authUser = useContext(userContext);
  	const currChat = useContext(chatContext);
	const [invChat, setInvChat] = useState(null);

  	currChat.setUser(authUser.user);

	const UserPanel = (user) => {

		const handleAdd = () => {
			console.log(user.user.profilePic, user.user.name);
			setInvChat(user.user);
		}

		return (
			<div className='user-info'>
				<div className='user-info-left'>
					<img src={user.user.profilePic} alt="" className='user-img'/>
					<h5>{user.user.name}</h5>
				</div>
				<div className='user-info-right'>
					<button className='add-btn' onClick={handleAdd}>
					<FontAwesomeIcon icon={faPlus} />
				</button>
				</div>
				
			</div>
		)
	}

	const OtherUserView =  () => {

		return (
			<div className='other-user-view'>
				{currChat.otherUser != null &&
					<div>
						<h2>
							{currChat.otherUser.name}
						</h2>
						<NavLink to={`/user/${currChat.otherUser._id}`}>
							<button className='view-profile-btn'>
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

	const UserSearch =  () => {
		const [userList, setUserList] = useState([]);
		const exmUser1 = {
			name: 'John Doe',
			_id: '123',
			profilePic: 'https://www.w3schools.com/howto/img_avatar.png'
		}	
		const exmUser2 = {	
			name: 'Jane Doe',
			_id: '456',	
			profilePic: 'https://www.w3schools.com/howto/img_avatar.png'
		}
		const exmUser3 = {
			name: 'John Smith',
			_id: '789',
			profilePic: 'https://www.w3schools.com/howto/img_avatar.png'
		}

		useEffect(() => {
			setUserList([exmUser1, exmUser2, exmUser1, exmUser2, exmUser1, exmUser2, exmUser1, exmUser2, exmUser1, exmUser2,exmUser1, exmUser2,exmUser1, exmUser2, exmUser3]);
		}, []);

		return (
			<div className='user-search-view'>
				<ChatSearchBar placeholderText={"Search users"}/>
				{userList.length > 0 &&
					<div className='user-list'>
						{userList.map((user) =>{
							return (<UserPanel user={user} />)
						})}	
					</div>
				}
				{userList.length === 0 &&
						<span>Search results will appear here</span>
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
			<ChatComponent user={authUser.user} otherUser={invChat}/>
			<div className='chat-right-panel'>
				<OtherUserView otherUser={currChat.otherUser}/>
				<UserSearch />
			</div>
			
		</div>
	);
	
}

export default ChatPage;

