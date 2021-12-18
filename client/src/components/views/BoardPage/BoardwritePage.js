import axios from 'axios';
import React, {useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import {writePost} from '../../../_actions/board_action';
import '../../utils/FileUploader/fileuploader.css';
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer, toast } from 'react-toastify';
import { Form, Row, Col, Button } from 'react-bootstrap';
import Footer from '../Footer/Footer';

function BoardwritePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector(state => state.user);
    
    const [postTitle, setpostTitle] = useState("");
    const [postImages, setpostImages] = useState(null);
    const [postContext, setpostContext] = useState("");
    const [postPrice, setpostPrice] = useState(0);
    const [postRegion, setpostRegion] = useState("거래 지역");

    const onTitleHandler = (event) => {
        setpostTitle(event.currentTarget.value)
    }
    const onImageHandler = (event) => {
        setpostImages(event.currentTarget.files)        
    }
    const onContextHandler = (event) => {
        setpostContext(event.currentTarget.value)
    }
    const onPriceHandler = (event) => {
        setpostPrice(event.currentTarget.value)
    }
    const onRegionHandler = (event) => {
        setpostRegion(event.currentTarget.value)
    }
    
    const onSubmitHandler = (event) => {
        event.preventDefault();

        let body = {
            writer : 'writer',
            region : '',
            title : postTitle, 
            picture1 : '',
            picture2 : '',
            picture3 : '',
            picture4 : '',
            picture5 : '',
            contents : postContext,
            price : postPrice,
        }

        const data = new FormData();
        for (let i = 0; i < postImages.length; i++) {
            data.append('file', postImages[i]);
            switch (i) {
                case 0:
                    // setpostImageName1(postImages[0].name);
                    body.picture1 = postImages[0].name;
                    break;
                case 1:
                    // setpostImageName2(postImages[1].naae);
                    body.picture2 = postImages[1].name;
                    break;
                case 2:
                    // setpostImageName3(postImages[2].name);
                    body.picture3 = postImages[2].name;
                    break;
                case 3:
                    // setpostImageName4(postImages[3].name);
                    body.picture4 = postImages[3].name;
                    break;
                case 4:
                    // setpostImageName5(postImages[4].name);
                    body.picture5 = postImages[4].name;
                    break;
            }
            console.log('fileName',postImages[i].name)
        }

        
        console.log(body);

        
        
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
                <form onSubmit={onSubmitHandler} style={{display: 'flex', flexDirection:'column'}}>
                <div style={{width: '85%', margin: '1rem auto',marginBottom: '40px'}}>
                <h2>판매글 작성하기</h2>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>글 제목</Form.Label>
                    <Form.Control size ="lg" type="text" placeholder="글 제목" value={postTitle} onChange={onTitleHandler} />
                </Form.Group>
                <Form.Group  className="mb-3">
                    <Row>
                        <Col>
                            <Form.Label>작성자</Form.Label>
                            <Form.Control type="text" placeholder="작성자" readOnly />
                        </Col>
                        <Col>
                            <Form.Label>거래 지역</Form.Label>
                            <Form.Control type="text" placeholder="지역" onChage={onRegionHandler} />
                        </Col>
                    </Row>
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>글 내용</Form.Label>
                    <Form.Control as="textarea" rows={12} value={postContext} onChange={onContextHandler}/>
                </Form.Group>
                <div class="form-group files">
                            <label>파일 업로드 </label>
                            <input type="file" class="form-control" multiple onChange={onImageHandler}/>
                </div>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>판매 금액</Form.Label>
                    <Form.Control size ="lg" type="text" placeholder="판매 금액" value={postPrice} onChange={onPriceHandler} />
                </Form.Group>
                <Button variant="primary" type="submit">
                    글 올리기
                </Button>
                </div>
                </form>
                <ToastContainer />
            </div>
            <Footer />
        </div>
    )
}

export default BoardwritePage