import React, {useState} from 'react';
import axios from 'axios';
import {useSelector} from 'react-redux';
import { useNavigate } from "react-router-dom";

function SendNote() {
    const navigate = useNavigate();
    const user = useSelector(state => state?.user);
    const [Receiver, setReceiver] = useState("");
    const [Title, setTitle] = useState("");
    const [Content, setContent] = useState("");
    
    
    const ReceiverClick = (event) => {
        setReceiver(event.currentTarget.value);
    }
    const TitleClick = (event) => {
        setTitle(event.currentTarget.value);
    }
    const ContentClick = (event) => {
        setContent(event.currentTarget.value);
    }
    
    const onSubmit = (event) => {
        event.preventDefault();
        
        const vaiables = {
            sender: user.userData.user_id,
            receiver: Receiver,
            title: Title,
            content: Content
        };
        axios.post('/api/note/sendNote', vaiables)
        .then(response => {
            if(response.data.success){
                navigate("../note", { replace: true });
            }
            else{
                alert('쪽지를 전송하지 못했습니다.');
            }
        });
    }
    
    return (
        <div>
            
            <form onSubmit={onSubmit}>
                
                <label>받는 사람</label>
                <input onChange={ReceiverClick}
                    value={Receiver}
                    placeholder="내용을 입력해 주세요."
                    required></input>
                <br/>
                <label>제목</label>
                <input onChange={TitleClick}
                    value={Title}
                    placeholder="내용을 입력해 주세요."
                    required></input>
                <br/>
                <label>내용</label>
                <textarea
                    style={{width: '100%', borderRadius:'5px'}}
                    onChange={ContentClick}
                    value={Content}
                    placeholder="내용을 입력해 주세요."
                    required
                />
                <br/>
                <button style={{width: '20%', height: '52px'}} onClick={onSubmit}>전송</button>
                
            
            </form>
        </div>
    )
}

export default SendNote