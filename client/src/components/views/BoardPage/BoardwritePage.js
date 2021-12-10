import React, {useState} from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
// import { Button,Form, Row, Col} from 'react-bootstrap';
import {writePost} from '../../../_actions/board_action';


function BoardwritePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [postTitle, setpostTitle] = useState("");
    const [postImage, setpostImage] = useState("");
    const [postContext, setpostContext] = useState("");
    const [postPrice, setpostPrice] = useState(0);
    

    const onTitleHandler = (event) => {
        setpostTitle(event.currentTarget.value)
    }
    const onImageHandler = (event) => {
        setpostImage(event.currentTarget.value)
    }
    const onContextHandler = (event) => {
        setpostContext(event.currentTarget.value)
    }
    const onPriceHandler = (event) => {
        setpostPrice(event.currentTarget.value)
    }
    const onSubmitHandler = (event) => {
        event.preventDefault();
        //이게 왜 안될까 슈발
        //데이터베이스에 보내지지도 않으며 현재 navigation도 꺼놨음
        // Bootstrap 쓰지말고 걍 Input이랑 form 으로 바꿔서 해보자.
        let body = {
            writer : 'writer',
            region : 'seoul',
            title : postTitle, 
            picture : postImage,
            contents : postContext,
            price : postPrice,
        }

        console.log(body);

        dispatch(writePost(body)).then(response => {
            if(response.payload.writepostSuccess) {
                console.log('전달 성공');
                navigate("../board", {replace: true});
            }
            else {
                alert('Error')
            }
        })
    }

    

    
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
                    <label>사진 올리기</label>
                    <input type="file" multiple value={postImage} onChange={onImageHandler}/>
                    <label>판매 금액</label>
                    <input size ="lg" type="text" placeholder="판매 금액" value={postPrice} onChange={onPriceHandler}/>
                    <button variant="primary" type="submit">
                        글 올리기
                    </button>
                </form>
            </div>
        </div>
    )
}

export default BoardwritePage