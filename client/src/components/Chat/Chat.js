import React, {useState, useEffect} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import './Chat.css';

import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

let socket;
const Chat = ({ location }) => {
	const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
	
	const ENDPOINT = 'localhost:5000';
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
	
	useEffect( ()=>{
		socket.on('message', (message) =>{
			setMessages([...messages, message]);
		});
		
	}, [messages]);

	//function for sending message
	
	const sendMessage = (event) =>{
		event.preventDefault();
		if(message){
			socket.emit('sendMessage', {name, message}, () => setMessage(''));
		}
	}
	
	console.log(message, messages);
	
    return(
        <div className ="joinOuterContainer">
            <div className ="joinInnerContainer">
                <h1 className="heading"> Join Chat</h1>
                <InfoBar room = {room}/>
                <Input message = {message} setMessage = {setMessage} sendMessage = {sendMessage} />
                
            </div>
        </div>
    )
}

export default Chat;