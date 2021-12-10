import React, { useEffect } from 'react';
import {Link } from "react-router-dom";
import axios from 'axios';

function LandingPage() {
    useEffect(() => {
        axios.get('/api/hello').then(response => {console.log(response)}, [])
    })
    /*
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
    }*/
    
    return (
        <div>
            {/* LandingPage 랜딩페이지 */}
            {/* <button onClick={onClickHandler}>로그아웃</button> */}
            {/* 메인 image */}
            <div style={{width: '85%', margin: '1rem auto'}}>
                <h2> 실시간 HOT 매물 </h2>
                <div style={{maxWidth:'500px', background:'#EEE'}}>
                    <h2 style={{color: 'black'}}> 품목 Title </h2>
                    <p style={{color: 'black', fontSize: '1rem'}}>description</p>
                </div>
                <p><Link to="/board">더보기</Link></p>
                {/* grid 1 */}
                <hr/>
            </div>
     </div>
    )
}

export default LandingPage