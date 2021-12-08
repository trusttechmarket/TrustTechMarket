import React from 'react'
import { Link } from 'react-router-dom'

function BoardPage() {
    //auth user data를 갖고있어야함


    return (
        //게시판 불러오기 페이지
        <div>
            <div style={{width: '85%', margin: '1rem auto'}}>
                <div>
                <h2>등록된 상품 보기</h2>
                    <ol>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ol>
                </div>
                <hr/>
                <button><Link to="/board/update">글 작성하러 가기</Link></button>
            </div>
        </div>
    )
}

export default BoardPage