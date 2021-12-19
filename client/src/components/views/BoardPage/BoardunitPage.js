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
    const [Images, setImages] = useState({})

    useEffect(() => {
        axios.get(`/api/board/${postID}`).then((response) => {
            console.log('응답받음',response);
            setPost(response.data)
            axios.get(`/api/getImage/${postID}`).then((response) => {
                console.log('응답받음',response);
                setImages(response.data)
            })
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
    console.log('Images', Images);
    console.log('Post', Post);
    const Imagefiles = Object.values(Images);
    console.log(Imagefiles);
    const refreshFunction = (newComment) => {
        setComments(Comments.concat(newComment));
    }
    
    return (
        <div>
            <div style={{width : '85%', margin: '1rem auto', alignItems: 'center'}}>
            <ControlledCarousel Imagefiles={Imagefiles} />
            <br></br>
            <PostUnit Post={Post} />
            <Comment refreshFunction={refreshFunction} commentLists={Comments} postID={postID} />
            </div>
        </div>
        
    )
}

export default BoardunitPage