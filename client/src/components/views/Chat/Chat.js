import React, {useState, useEffect} from 'react';
import io from 'socket.io-client';
import TextField from '@material-ui/core/TextField';
import './Chat.css';

const socket = io.connect('/api/chat');

function Chat() {
    
}


export default Chat;