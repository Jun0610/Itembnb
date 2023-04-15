import Talk from 'talkjs';
import { useEffect, useState, useRef, useContext } from 'react';
import chatContext from '../contexts/chatContext';
import ChatSearchBar from './ChatSearchBar';

const ChatComponent = ( {user, otherUser} )  =>  {

	const chatboxEl = useRef();
	const currChat = useContext(chatContext);
	const [filter, setFilter] = useState(null);

	// wait for TalkJS to load
	const [talkLoaded, markTalkLoaded] = useState(false);

	useEffect(() => {
		console.log("running chat component");
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
			});

			inbox.onSendMessage (message => {
				if (message.message.text.search("fuck") !== -1) {
					message.override( { text: 'Message deleted due to bad content.' } );
				}
			});

			return () => session.destroy();
		}
	}, [talkLoaded, otherUser, filter]);

	return (
		<div>
			<div className='chat-search-bar'><ChatSearchBar placeholderText={"Search chats"} searchFunc={setFilter}/></div>
			<div className='chat-comp' ref={chatboxEl} />
		</div>
	);
	
}

export default ChatComponent;