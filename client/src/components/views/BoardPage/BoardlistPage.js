import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import BoardCard from '../BoardCard/BoardCard'
import { Row, Col } from 'react-bootstrap';
import Axios from 'axios';

function BoardlistPage() {
    //auth user data를 갖고있어야함
    const [tumbnailList, settumbnailList] = useState([]);
    const [boardList, setboardList] = useState([]);

    useEffect(() => {
        createList();
        }, [])

    function createList() {
        Axios.get('/api/board').then((response) => {
            console.log(response);
            setboardList(response.data)
        })
        Axios.get('/api/getTumbnail').then((response) => {
            console.log(response.data);
            settumbnailList(response.data);
        })
    }
    var i = boardList.length;
    console.log(boardList);

    return (
        //게시판 불러오기 페이지
        <div>
            <div style={{width: '85%', margin: '1rem auto'}}>
                <div>
                <h2>등록된 상품 보기</h2>
                <div className="d-flex justify-content-around">
                <Row xs={1} md={4}>
                    {Array.from({ length: i }).map((_, idx) => (
                        <Col>
                            <BoardCard 
                            Post_sn={boardList[idx].post_sn}
                            Title={boardList[idx].title}
                            Price={boardList[idx].price}
                            Contents={boardList[idx].description}
                            ImageURL={boardList[idx].picture1_url}
                            />
                        </Col>
                    ))}
                </Row>
                </div>    
                </div>
                <hr/>
                <button><Link to="/board/write">글 작성하러 가기</Link></button>
            </div>
        </div>
    )
}

export default BoardlistPage