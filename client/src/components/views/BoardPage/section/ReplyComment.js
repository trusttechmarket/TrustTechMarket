import React, {useEffect, useState} from 'react'
import SingleComment from './SingleComment'

function ReplyComment(props) {
    const [OpenReplyComments, setOpenReplyComments] = useState(false);
    const [ChildCommentNumber, setChildCommentNumber] = useState(0);
    useEffect(() => {
        var commentNumber = 0;
        
        
        {props.commentLists && props.commentLists.map((comment) => {
            if(comment.responseTo === props.parentCommentId) {
                commentNumber++;
            }
        })};
        
        setChildCommentNumber(commentNumber);
    }, [props.commentLists, props.parentCommentId])
    
    const onHandleChange = () => {
        setOpenReplyComments(!OpenReplyComments);
    }
    
    var renderReplyComment = (parentCommentId) => 
        (props.commentLists.map((comment, index) => (
            <React.Fragment>
                {comment.responseTo === parentCommentId &&
                    <div style={{ width: '80%', marginLeft: '40px' }}>
                        <SingleComment refreshFunction={props.refreshFunction} comment={comment} postID={props.boardID} />
                        <ReplyComment refreshFunction={props.refreshFunction} parentCommentId={comment.comment_sn} commentLists={props.commentLists} postID={props.boardID} />
                    </div>
                 }
            </React.Fragment>
        )))
    
    return (
        <div>
            
            {ChildCommentNumber > 0 &&
                <p style={{ fontSize: '14px', margin: 0, color: 'grey' }} onClick={onHandleChange}> {ChildCommentNumber}개의 답글보기</p>
            }
            
            {OpenReplyComments &&
                renderReplyComment(props.parentCommentId)
                
            }
            
        
        </div>
    
    )
    
}


export default ReplyComment