import React, {useState, useEffect} from 'react'
import Comment from './section/Comment'
import axios from 'axios';
import {useParams} from "react-router-dom";
import { Container } from 'react-bootstrap';
import PostUnit from './section/PostUnit';
import ControlledCarousel from './section/ControlledCarousel'

function BoardunitPage(props) {
    const param = useParams();
    const postID = param.id;
    const [Post, setPost] = useState({});
    const [Comments, setComments] = useState([]);
    const variables= { 'postID': postID }; 

    useEffect(() => {
        axios.get(`/api/board/${postID}`).then((response) => {
            console.log('응답받음',response);
            setPost(response.data)
        })
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
    }, [])  
    
    const refreshFunction = (newComment) => {
        setComments(Comments.concat(newComment));
    }

    return (
        <div>
            <div style={{width : '85%', margin: '1rem auto'}}>
            <ControlledCarousel />
            <PostUnit Post={Post} />
            <Comment refreshFunction={refreshFunction} commentLists={Comments} postID={postID} />
            </div>
        </div>
        
    )
}

export default BoardunitPage