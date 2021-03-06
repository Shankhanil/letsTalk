import React, {useState, useEffect} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import './Chat.css';

import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';

let socket;
const Chat = ({ location }) => {
	const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
	
	const ENDPOINT = 'https://lets-talk-server.herokuapp.com/';
	useEffect( ()=>{
		
		const {name, room}= queryString.parse(location.search);
		// console.log(location.search);
		// console.log(name, room);
		
		socket = io(ENDPOINT);
		
		setName(name);
		setRoom(room);
		
		console.log(socket);
		socket.emit('join', {name, room}, ()=>{
			
		});
		return ()=>{
			socket.emit('disconnect');
			socket.off();
		};
	}, [ENDPOINT, location.search] )
	
	useEffect(( ) => {
		socket.on("message", message => {
		  setMessages(msgs => [...msgs, message]);
		});
	},  [ ]);
	//function for sending message
	
	const sendMessage = (event) =>{
		event.preventDefault();
		if(message){
			socket.emit('sendMessage', {name, message}, () => setMessage(''));
		}
	}
	
	console.log(message, messages);
	
    return(
        <div className ="outerContainer">
            <div className ="container">
                <InfoBar room = {room}/>
                <Messages messages={messages} name={name}/>
				<Input message = {message} setMessage = {setMessage} sendMessage = {sendMessage} />
                
            </div>
        </div>
    )
}

export default Chat;