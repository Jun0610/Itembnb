import Talk from 'talkjs';
import { useEffect, useState, useRef, useContext } from 'react';
import chatContext from '../contexts/chatContext';
import ChatSearchBar from './ChatSearchBar';
import { faBell, faBellSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ChatComponent = ( {user, otherUser} )  =>  {

	const chatboxEl = useRef();
	const currChat = useContext(chatContext);
	const [filter, setFilter] = useState(null);
	const [selectConv, setSelectConv] = useState(null);	
	const [notifications, setNotifications] = useState(null);	

	// wait for TalkJS to load
	const [talkLoaded, markTalkLoaded] = useState(false);

	useEffect(() => {
		Talk.ready.then(() => markTalkLoaded(true)); 

		currChat.setOtherUser(null);
		if (talkLoaded) {
			const currentUser = new Talk.User({
			id: user.user._id,
			name: user.user.name,
			email: user.user.email,
			role: 'default',
			});

			const session = new Talk.Session({
			appId: 'tnfFYmAK',
			me: currentUser,
			});
			
			const inbox = session.createInbox();
			
			if (otherUser != null) {
				console.log("runnning otheruser");
				console.log(otherUser);
				const otherTalkUser = new Talk.User({
					id: otherUser._id,
					name: otherUser.name,
					email: otherUser.email,
					role: 'default',
				});

				const convId = Talk.oneOnOneId(currentUser, otherTalkUser);
				const conversation = session.getOrCreateConversation(convId);
				conversation.setParticipant(currentUser);
				conversation.setParticipant(otherTalkUser);
				conversation.setAttributes({custom: {
					firstUser: currentUser.name.localeCompare(otherTalkUser.name) < 0 ? currentUser.name : otherTalkUser.name,
					secondUser: currentUser.name.localeCompare(otherTalkUser.name) < 0 ? otherTalkUser.name : currentUser.name
				}});

				inbox.select(conversation);
			}
			
			inbox.mount(chatboxEl.current);
			if (filter != null) {
				inbox.setFeedFilter({custom: {
					firstUser: ["==", currentUser.name.localeCompare(filter) < 0 ? currentUser.name : filter],
					secondUser: ["==", currentUser.name.localeCompare(filter) < 0 ? filter : currentUser.name]
				}});
			} else {
				inbox.setFeedFilter({});
			}

			inbox.onSelectConversation(conversation => {
				console.log(conversation);
				let currOtherUser = {
					_id: conversation.others[0].id,
					name: conversation.others[0].name,
					email: conversation.others[0].email,
				}
				currChat.setOtherUser(currOtherUser);
				setSelectConv(conversation);
				fetch(`https://api.talkjs.com/v1/tnfFYmAK/conversations/${conversation.conversation.id}`,
				{
					method: "GET",
					headers: {
						"Authorization": "Bearer sk_test_qz67J0mBMzQs3RGs3OvwrJmXFBReuebY"
					}
				})
				.then(res => res.json())
				.then(data => {
					let notify = false;
					let obj = data.participants;
					for (var key in obj) {
						if (key === user.user._id) {
							notify = obj[key].notify;
						}
					}
					setNotifications(notify);
				})
			});

			inbox.onSendMessage (message => {
				if (message.message.text.search("fuck") !== -1) {
					message.override( { text: 'Message deleted due to bad content.' } );
				}
			});

			return () => session.destroy();
		}
	}, [talkLoaded, otherUser, filter]);

	const handleNotifBell = () => {
		if (notifications) {
			setNotifications(false);
			if (selectConv != null) {
				fetch(`https://api.talkjs.com/v1/tnfFYmAK/conversations/${selectConv.conversation.id}/participants/${user.user._id}`, {
					method: "PATCH",
					body: JSON.stringify({
						"notify": false
					}),
					headers: {
						"Content-type": "application/json",
						"Authorization": "Bearer sk_test_qz67J0mBMzQs3RGs3OvwrJmXFBReuebY"
					}
				})
				.then(res => console.log(res))
			}
		}
		else {
			setNotifications(true);
			if (selectConv != null) {
				fetch(`https://api.talkjs.com/v1/tnfFYmAK/conversations/${selectConv.conversation.id}/participants/${user.user._id}`, {
					method: "PATCH",
					body: JSON.stringify({
						"notify": true,
						"access": "ReadWrite"
					}),
					headers: {
						"Content-type": "application/json",
						"Authorization": "Bearer sk_test_qz67J0mBMzQs3RGs3OvwrJmXFBReuebY"
					}
				})
				.then(res => console.log(res))
			}
		}
			
	}

	return (
		<div>
			<div className='row'>
				<div className='chat-search-bar'><ChatSearchBar placeholderText={"Search chats"} searchFunc={setFilter}/></div>
				<button className='notif-btn' onClick={handleNotifBell}>
					{notifications &&
					<FontAwesomeIcon icon={faBell}/>}
					{!notifications &&
					<FontAwesomeIcon icon={faBellSlash}/>}
				</button>
			</div>
			<div className='chat-comp' ref={chatboxEl} />
		</div>
	);
	
}

export default ChatComponent;