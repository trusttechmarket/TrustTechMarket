import axios from 'axios';
import React, {useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import {writePost} from '../../../_actions/board_action';
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer, toast } from 'react-toastify';
import { Form, Row, Col, Button } from 'react-bootstrap';
import Footer from '../Footer/Footer';

function BoardwritePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector(state => state.user);
    
    const [postTitle, setpostTitle] = useState("");
    const [postImages, setpostImages] = useState([]);
    const [postContext, setpostContext] = useState("");
    const [postPrice, setpostPrice] = useState(0);
    const [postRegion, setpostRegion] = useState("");

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
        let d = Date.now()
        console.log(d)
        let body = {
            title: postTitle,
            writer : user.userData?.user_id,
            region : postRegion, 
            pictureDIR : d,
            contents : postContext,
            price : postPrice,
            title : postTitle,
        }

        const data = new FormData();
        // const tumbnail = new FormData(); 
        data.append('dirName', d);
        for (let i = 0; i < postImages.length; i++) {
            data.append('file', postImages[i]);
            if (i == 0) {
                // tumbnail.append('file', postImages[i]);
                }
            console.log('fileName',postImages[i].name)
        }
        
        //글 데이터 전송
        dispatch(writePost(body)).then(response => {
            if(response.payload.writepostSuccess) {
                //이미지 전송
                axios.post('/api/board/upload', data).then((e) => {
                    toast.success('Upload Success', {
                        position: "top-center",
                        autoClose: 4000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        onClose: () => navigate("../board",{replace: true})
                    })
                })
                .catch((e) => {
                    toast.error('Upload Error');
                })
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
                            <Form.Control type="text" placeholder={user.userData?.user_id} readOnly />
                        </Col>
                        <Col>
                            <Form.Label>거래 지역</Form.Label>
                            <Form.Control type="text" placeholder="지역" value={postRegion} onChange={onRegionHandler} />
                        </Col>
                    </Row>
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>글 내용</Form.Label>
                    <Form.Control as="textarea" rows={12} value={postContext} onChange={onContextHandler}/>
                </Form.Group>
                <Form.Group controlId="formFileMultiple" className="mb-3">
                    <Form.Label>파일 업로드</Form.Label>
                    <Form.Control type="file" multiple onChange={onImageHandler}/>
                </Form.Group>
                <div className='IMGpreview'></div>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>판매 금액</Form.Label>
                    <Form.Control size ="lg" type="text" placeholder="판매 금액" value={postPrice} onChange={onPriceHandler} />
                </Form.Group>
                <Button variant="primary" type="submit">
                    글 올리기
                </Button>
                </div>
                </form>
                <ToastContainer position="top-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover/>
            </div>
            <Footer />
        </div>
    )
}

export default BoardwritePage