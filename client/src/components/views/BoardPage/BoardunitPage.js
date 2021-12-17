import React, {useState, useEffect} from 'react'
import Comment from './section/Comment'
import axios from 'axios';
import {useParams} from "react-router-dom";

function BoardunitPage(props) {
    const param = useParams();
    const postID = param.id;
    const [Comments, setComments] = useState([]);
    const variables= { 'postID': postID };
                                          
    useEffect(() => {
        
        
        
        axios.post('/api/comment/getComments', variables)
        .then(response => {
            if(response.data.success) {
                setComments(response.data.data);
                //console.log(Comments);
            }
            else {
                alert("댓글 불러오기 실패");
            }
        })
    })  
    
    const refreshFunction = (newComment) => {
        setComments(Comments.concat(newComment));
    }
                                          
    return (
    
        <div>
            bordunit;
            
            
            
            <Comment refreshFunction={refreshFunction} commentLists={Comments} postID={postID} />
        </div>
        
    )
}

export default BoardunitPage