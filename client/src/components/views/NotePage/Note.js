import React, {useState, useEffect} from 'react'
import axios from 'axios';
import {useSelector} from 'react-redux';
import { Link } from "react-router-dom";
import './Note.css';

function Note() {
    const user = useSelector(state => state.user);
    const id = user.userData?.user_id;
    const [Receive, setReceive] = useState("Inline");
    const [Send, setSend] = useState("None");
    const [RecBtn, setRecBtn] = useState("btnNone");
    const [SenBtn, setSenBtn] = useState("btnInline");
    const [RecList, setRecList] = useState([]);
    const [SendList, setSendList] = useState([]);
    
    useEffect(() => {
        axios.post('/api/note/getrecnote', {id: id})
            .then(response => {
                if(response.data.success) {
                    setRecList(response.data.data);
                    //console.log(RecList);
                }
                else {
                    console.log("받은쪽지함 오류", response.data.err);
                }
            });
        axios.post('/api/note/getsendnote', {id: id})
            .then(response => {
                if(response.data.success) {
                    setSendList(response.data.data);
                }
                else {
                    console.log("보낸쪽지함 오류", response.data.err);
                }
            });
    }, [id])
    
    
    var TableComponent = ({time, id, title, content}) => {
        return (
            <tr>
                <td>{time}</td>
                <td>{id}</td>
                <td>{title}</td>
                <td>{content}</td>
            </tr> 
        )
    }
    var onClickRec = () => {
        setReceive("Inline");
        setSend("None");
        setRecBtn("btnNone");
        setSenBtn("btnInline");
    }
    var onClickSen = () => {
        setReceive("None");
        setSend("Inline");
        setRecBtn("btnInline");
        setSenBtn("btnNone");
    }
        
    
    /*
    var onChange = (v) => {
        setSelectValue(v.currentTarget.value);
        console.log(SelectValue);
        var variables = {
            id: user.userData?.user_id
        };
        
        if(SelectValue == "receive") {
            setReceive("Inline");
            setSend("None");
            
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
       
    }*/
 
    return (
        <div>
            {/*쪽지 쓰기 버튼*/}
            <div style={{display: 'flex'}}>
                <button onClick={onClickRec} className={RecBtn}>보낸쪽지함으로 가기</button>
                <button onClick={onClickSen} className={SenBtn}>받은쪽지함으로 가기</button>
                <Link to="../sendnote"><button>쪽지쓰기</button></Link>
            </div>
            
            {/*쪽지 리스트*/}
            <div>
                {/*받은쪽지함*/}
                <table className={Receive}>
                    <caption className="caption">받은 쪽지함</caption>
                    <thead>
                    <tr>
                    <th>시간</th>
                    <th>보낸사람</th>
                    <th>제목</th>
                    <th>내용</th>
                    </tr>
                    </thead>
                    <tbody>
                    
                    {RecList && RecList.map((noteList, index) => (
                                <TableComponent time={noteList.time} id={noteList.sender} title={noteList.title} content={noteList.content} />
                                
                    ))}
                    
                    </tbody>
                </table>
                {/*보낸쪽지함*/}
                <table className={Send}>
                    <caption className="caption">보낸 쪽지함</caption>
                    <thead>
                    <tr>
                    <th>시간</th>
                    <th>받은사람</th>
                    <th>제목</th>
                    <th>내용</th>
                    </tr>
                    </thead>
                    <tbody>
                    {SendList && SendList.map((noteList, index) => (
                                <TableComponent time={noteList.time} id={noteList.sender} title={noteList.title} content={noteList.content} />
                        
                    ))}
                    </tbody>
                </table>
            </div>
        
        </div>
    )
}


export default Note