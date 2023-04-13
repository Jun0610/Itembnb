import Talk from 'talkjs';
import { useEffect, useState, useRef, useContext, useCallback } from 'react';
import chatContext from '../contexts/chatContext';

const ChatComponent = ( {user, otherUser} )  =>  {

	const chatboxEl = useRef();
	const currChat = useContext(chatContext);

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
			inbox.mount(chatboxEl.current);

			inbox.onSelectConversation(conversation => {
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
	}, [talkLoaded]);

	return (
		<div className='chat-comp' ref={chatboxEl} />
	);
	
}

export default ChatComponent;