import Talk from 'talkjs';
import { useEffect, useState, useRef } from 'react';

const ChatComponent = ( {user, otherUser} )  =>  {

    const chatboxEl = useRef();
  
    // wait for TalkJS to load
    const [talkLoaded, markTalkLoaded] = useState(false);
  
    useEffect(() => {
      Talk.ready.then(() => markTalkLoaded(true));
  
      console.log(user);
  
      if (talkLoaded) {
        const currentUser = new Talk.User({
          id: user.user._id,
          name: user.user.name,
          email: user.user.email,
          role: 'default',
        });
  
        const otherUser = new Talk.User({
          id: '3',
          name: 'Adam Sandler',
          email: 'adam@example.com',
          role: 'default',
        });
  
        const session = new Talk.Session({
          appId: 'tnfFYmAK',
          me: currentUser,
        });
  
        const conversationId = Talk.oneOnOneId(currentUser, otherUser);
        const conversation = session.getOrCreateConversation(conversationId);
        conversation.setParticipant(currentUser);
        conversation.setParticipant(otherUser);
  
        const inbox = session.createInbox();
        inbox.select(conversation);
        inbox.mount(chatboxEl.current);

        inbox.onSendMessage (message => {
            console.log(message.message.text);
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