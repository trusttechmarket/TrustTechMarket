import React, {useState} from 'react';
import axios from 'axios';
import {useSelector} from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';


function Comment(props) {
    const boardID = props.postID; // 게시글 번호, boardunit에서 comment쪽으로 넘겨줘야 함.
    const user = useSelector(state => state.user);
    const [commentValue, setcommentValue] = useState("");
    
    const handleClick = (event) => {
        setcommentValue(event.currentTarget.value);
    }
    
    const onSubmit = (event) => {
        event.preventDefault();
        
        const vaiables = {
            content: commentValue,
            writer: user.userData.user_id,
            postID: boardID
        };
        //console.log(vaiables);
        axios.post('/api/comment/saveComment', vaiables)
        .then(response => {
            if(response.data.success){
                console.log(response.data);
                props.refreshFunction(response.data.result);
                setcommentValue("");
            }
            else{
                alert('댓글을 입력하지 못했습니다.');
            }
        });
    }
    return (
        <div>
            <br/>
            <p> 댓글</p>
            <hr />
            
            {/* 댓글 목록*/}
            {props.commentLists && props.commentLists.map((comment, index) => (
                (!comment.responseTo && 
                 <React.Fragment>
                     <SingleComment refreshFunction={props.refreshFunction} comment={comment} postID={boardID} />
                     <ReplyComment refreshFunction={props.refreshFunction} parentCommentId={comment.comment_sn} commentLists={props.commentLists} postID={boardID} />
                 
                 </React.Fragment>
                )
                
            ))}
            
            
            
            
            
            {/*댓글 입력 창(루트)*/}
            <form style={{display: 'flex'}} onSubmit={onSubmit}>
                <textarea
                    style={{width: '100%', borderRadius:'5px'}}
                    onChange={handleClick}
                    value={commentValue}
                    placeholder="댓글을 입력해 주세요."
                />
                <br/>
                <button style={{width: '20%', height: '52px'}} onClick={onSubmit}>입력</button>
            
            </form>
            
            
            
            
        </div>
    )
}

export default Comment