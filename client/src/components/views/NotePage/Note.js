import React, {useState} from 'react'
import axios from 'axios';
import {useSelector} from 'react-redux';
import { Link } from "react-router-dom";
import './Note.css';

function Note() {
    const user = useSelector(state => state?.user);
    const [Receive, setReceive] = useState("Inline");
    const [Send, setSend] = useState("None");
    const [RecList, setRecList] = useState([]);
    const [SendList, setSendList] = useState([]);
    const [trDisplay, settrDisplay] = useState("trNone");
    
    var tableComponent = (time, id, title, content, sn) => {
        return (
            <tr>
                <td>{time}</td>
                <td>{id}</td>
                <td><a onclick={onTrClick}>{title}</a></td>
            </tr> 
        )
    }
    var tableContent = (content) => {
        return (
            <tr className={trDisplay}>
                <td colspan='3'>content</td>
            </tr>
        )
    }
    
    var onTrClick = () => {
        if(trDisplay == "trNone") {
            settrDisplay("trInline");
        }
        else {
            settrDisplay("trNone");
        }
    }
    
    var onChange = (v) => {
        var value = v;
        console.log(value);
        var variables = {
            id: user.userData.user_id
        };
        
        if(value == "Receive") {
            setReceive("Inline");
            setSend("None");
            axios.post('/api/note/getRecNote', variables)
            .then(response => {
                if(response.data.success) {
                    setRecList(response.data.data);
                }
                else {
                    console.log("받은쪽지함 오류", response.data.err);
                }
            });
        }
        else {
            setReceive("None");
            setSend("Inline");
            axios.post('/api/note/getSendNote', variables)
            .then(response => {
                if(response.data.success) {
                    setSendList(response.data.data);
                }
                else {
                    console.log("보낸쪽지함 오류", response.data.err);
                }
            });
        }
       
    }
 
    return (
        <div>
            {/*쪽지 쓰기 버튼*/}
            <div style={{display: 'flex'}}>
                <select onchange={onChange()}>
                    <option value="receive" selected>받은쪽지함</option>
                    <option value="send">보낸쪽지함</option>
                </select>
                <Link to="../sendnote"><button>쪽지쓰기</button></Link>
            </div>
            
            {/*쪽지 리스트*/}
            <div>
                {/*받은쪽지함*/}
                <table className={Receive}>
                    <th>시간</th>
                    <th>보낸사람</th>
                    <th>제목</th>
                    {RecList && RecList.map((noteList, index) => {
                        tableComponent(noteList.time, noteList.sender, noteList.title, noteList.note_sn)
                        tableContent(noteList.content)
                    })}
                </table>
                {/*보낸쪽지함*/}
                <table className={Send}>
                    <th>시간</th>
                    <th>보낸사람</th>
                    <th>제목</th>
                    {SendList && SendList.map((noteList, index) => {
                        tableComponent(noteList.time, noteList.receiver, noteList.title, noteList.note_sn)
                        tableContent(noteList.content)
                    })}
                </table>
            </div>
        
        </div>
    )
}


export default Note