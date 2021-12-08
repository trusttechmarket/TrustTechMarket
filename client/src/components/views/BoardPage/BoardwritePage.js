import React, {useEffect, useState} from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

function BoardwritePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [postTitle, setpostTitle] = useState("");
    const [postImage, setPostImage] = useState("");
    const [postContext, setpostContext] = useState("");

    const onTitleHandler = (event) => {
        setpostTitle(event.currentTarget.value)
    }
    const onImageHandler = (event) => {
        setPostImage(event.currentTarget.value)
    }
    const onContextHandler = (event) => {
        setpostContext(event.currentTarget.value)
    }
    

    let body = {
        postTitle : postTitle,
        postImage : postImage,
        postContext : postContext,
    }

    
    return (
        //게시판 불러오기 페이지
        <div>
            <div style={{width: '85%', margin: '1rem auto'}}>
                <h2>게시물 작성</h2>
                <form style = {{display: 'flex', flexDirection: 'column', width: '100%', height: '80vh'}}>
                    <label>글 제목</label>
                    <input type="text" value={postTitle}onChange={onTitleHandler}></input>
                    <br/>
                    <label>이미지 선택</label>
                    <input type="file" value={postImage} onChange={onImageHandler}></input>
                    <input type="context" value={postContext} onChange={onContextHandler}/>
                </form>
                <button type="submit">글 작성</button>
                </div>
        </div>
    )
}

export default BoardwritePage