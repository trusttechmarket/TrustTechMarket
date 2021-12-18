import React, { useEffect } from 'react';
import {Link } from "react-router-dom";
import axios from 'axios';
import MainBanner from './sections/MainBanner';
import {Button} from 'react-bootstrap';

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
            <div style={{width: '100%', margin: '1rem auto', textAlign: 'center', alignItems: 'center'}}>
            <h4>믿을 수 있는 전자제품 중고거래 플랫폼 '믿을테크마켓'</h4>  
            <Button ><Link to="/board"><h5
            style ={{color:'white'}}> 실시간 매물 보러가기 </h5></Link></Button>
            <MainBanner />
            {/*<button onClick={onClickHandler}>로그아웃</button>*/}
            <hr/>
            <p>이병창, 김세한</p>
            </div>
     </div>
    )
}

export default LandingPage