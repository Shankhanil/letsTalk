import React from 'react';

import './Message.css';
import Message from './Message';
import ScrollToBottom from 'react-scroll-to-bottom';

const Messages = ({messages, name}) => (
	<ScrollToBottom>
		{messages.map((message, i) => <div key={i}> <Message message={message} name={name}/></div>)}
	</ScrollToBottom>
);


export default Messages;