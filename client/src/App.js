/** @format */

import './App.css';
import io from 'socket.io-client';
import React, { useEffect, useState } from "react";
import Chat from './Chat';

const socket = io.connect('http://localhost:3001');

function App() {
	const [username, setUsername] = useState("");
	const [room, setRoom] = useState("");
	const [showChat, setShowChat] = useState(false);
  
	const joinRoom = () => {
		if (username !== "") {
		  socket.emit("join_request");
		  setShowChat(true);
		}
	  };
	  useEffect(() => {
		socket.on("room_joined", (roomId) => {
		  setRoom(roomId);
		});
	  }, []);
  
	return (
	  <div className="App">
		{!showChat ? (
		  <div className="joinChatContainer">
			<h3>Join A Chat</h3>
			<input
			  type="text"
			  placeholder="John..."
			  onChange={(event) => {
				setUsername(event.target.value);
			  }}
			/>
			<button onClick={joinRoom}>Join A Room</button>
		  </div>
		) : (
		  <Chat socket={socket} username={username} room={room} />
		)}
	  </div>
	);
  }
  
  export default App;
  
