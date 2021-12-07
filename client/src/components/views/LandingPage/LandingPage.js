import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function LandingPage() {
    const navigate = useNavigate();
    useEffect(() => {
        axios.get('/api/hello').then(response => {console.log(response)}, [])
    })
    
    const onClickHandler = () => {
        axios.get('/api/logout')
        .then(response =>{
            if(response.data.logout) {
                navigate("../login", { replace: true });
            }
            else {
                alert("로그아웃 실패")
            }
        })
    }
    
    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center'
            , width: '100%', height: '100vh'
        }}>
            LandingPage 랜딩페이지
            <button onClick={onClickHandler}>로그아웃</button>
            {/* 메인 image */}
            <div style={{width: '85%', margin: '1rem auto'}}>
                <h2> 최근 등록된 상품 </h2>
                {/* grid 1 */}
                <hr/>
            </div>
            <div style={{width: '85%', margin: '1rem auto'}}>
                <h2> 많이 찜한 상품 </h2>
                {/* grid 2 */}
                <hr/>
            </div>
        </div>
    )
}

export default LandingPage