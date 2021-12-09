import axios from 'axios';
import React, {useState} from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
// import { Button,Form, Row, Col} from 'react-bootstrap';
import {writePost} from '../../../_actions/board_action';
import '../../utils/FileUploader/fileuploader.css';
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer, toast } from 'react-toastify';

function BoardwritePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [postTitle, setpostTitle] = useState("");
    const [postImages, setpostImages] = useState(null);
    const [postImageName, setpostImageName] = useState();
    const [postContext, setpostContext] = useState("");
    const [postPrice, setpostPrice] = useState(0);


    const onTitleHandler = (event) => {
        setpostTitle(event.currentTarget.value)
    }
    const onImageHandler = (event) => {
        setpostImages(event.currentTarget.files)
        setpostImageName(event.currentTarget.files[0].name)
    }
    const onContextHandler = (event) => {
        setpostContext(event.currentTarget.value)
    }
    const onPriceHandler = (event) => {
        setpostPrice(event.currentTarget.value)
    }
    const onSubmitHandler = (event) => {
        event.preventDefault();
        
        let body = {
            writer : 'writer',
            region : 'seoul',
            title : postTitle, 
            picture : postImageName,
            contents : postContext,
            price : postPrice,
        }
        console.log(body);

        const data = new FormData();
        for (let i = 0; i < postImages.length; i++) {
            data.append('file', postImages[i]);
        }
        

        //이미지 전송
        axios.post('/api/board/upload', data).then((e) => {
        })
        .catch((e) => {
            console.error('Error',e)
        })

        dispatch(writePost(body)).then(response => {
            if(response.payload.writepostSuccess) {
                toast.success('Upload Success');
                navigate("../board",{replace: true});
            }
            else {
                alert('Error')
            }
        })
    };

    

    
    return (
        //게시판 작성
        <div>
            <div style={{width: '85%', margin: '1rem auto'}}>
                <h2>판매글 작성하기</h2>
                <form onSubmit={onSubmitHandler} style={{display: 'flex', flexDirection:'column'}}>
                    <label>글 제목</label>
                    <input size ="lg" type="text" placeholder="글 제목" value={postTitle} onChange={onTitleHandler} />
                    <label>작성자</label>
                    <input type="text" placeholder="작성자" readOnly />
                    <label>거래 지역</label>
                    <input type="text" placeholder="지역" readOnly />
                    <label>글 내용</label>
                    <input as="textarea" rows={12} value={postContext} onChange={onContextHandler}/>
                        <div class="form-group files">
                            <label>Upload Your File </label>
                            <input type="file" class="form-control" multiple onChange={onImageHandler}/>
                        </div>
                        
                    <label>판매 금액</label>
                    <input size ="lg" type="text" placeholder="판매 금액" value={postPrice} onChange={onPriceHandler}/>
                    <button variant="primary" type="submit">
                        글 올리기
                    </button>
                    <ToastContainer />
                </form>
            </div>
        </div>
    )
}

export default BoardwritePage