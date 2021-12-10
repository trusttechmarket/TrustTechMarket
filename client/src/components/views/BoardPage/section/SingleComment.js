import React, {useState} from 'react'
import  { Comment, Input } from 'antd';
import axios from 'axios';
import {useSelector} from 'react-redux';

const {TextArea} = Input;

function SingleComment(props) {
    const user = useSelector(state => state.user);
    const [OpenReply, setOpenReply] = useState(false);
    const [CommentValue, setCommentValue] = useState("");
    
    const onClickReplyOpen = () => {
        setOpenReply(!OpenReply);
    }
    
    const actions = [
        <span onClick={onClickReplyOpen} key="comment-basic-reply-to">답글</span>
    ]
    
    const onHandleChange = (event) => {
        setCommentValue(event.currentTarget.value);
    }
    
    const onSubmit = (event) => {
        event.preventDefault();
        const vaiables = {
            content: CommentValue,
            writer: user.userData.user_id,
            postID: props.postID,
            responseTo: props.comment.comment_sn
        };
        
        axios.post('/api/comment/saveComment', vaiables)
        .then(response => {
            if(response.data.success){
                console.log(response.data);
                props.refreshFunction(response.data.result);
                setCommentValue("");
                setOpenReply(false);
            }
            else{
                alert('댓글을 입력하지 못했습니다.');
            }
        });
    }
    
    return(
        <div>
            <Comment 
                actions={actions}
                author={props.comment.writer_id}
                content={<p>{props.comment.content}</p>} 
            />
            
            
            
            {/*댓글 입력 창*/}
            {OpenReply &&
                <form style={{display: 'flex'}} onSubmit={onSubmit}>
                    <TextArea
                        style={{width: '100%', borderRadius:'5px'}}
                        onChange={onHandleChange}
                        value={CommentValue}
                        placeholder="댓글을 입력해 주세요."
                    />
                    <br/>
                    <button style={{width: '20%', height: '52px'}} onClick={onSubmit}>입력</button>
                </form>
            }
            
            
        </div>
    );
    
};


export default SingleComment