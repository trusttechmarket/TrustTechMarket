import React, { useEffect, useState } from 'react'
import {Link, useNavigate} from "react-router-dom"
import axios from 'axios';
import {useSelector} from 'react-redux';
import './NavBar.css'


function NavBar() {
    const navigate = useNavigate();
    const user = useSelector(state => state.user);
    const [Display, setDisplay] = useState("NavulRightNone");
    const [LoginButton, setLoginButton] = useState("NavulRightInline");
    
    useEffect(() => {
        
        if(user.userData?.isAuth === undefined) {
            setDisplay("NavulRightNone")
            setLoginButton("NavulRightInline")
            
        }
        else if (user.userData.isAuth === true) {
            setDisplay("NavulRightInline")
            setLoginButton("NavulRightNone")
        }
        else{
            setDisplay("NavulRightNone")
            setLoginButton("NavulRightInline")
        }
    }, [user])
    
    const onOutHandler = () => {
        axios.get('/api/logout')
        .then(response =>{
            if(response.data.logout) {
                navigate("../login", { replace: true });
                setDisplay("NavulRightNone");
                setLoginButton("NavulRightInline")
            }
            else {
                alert("로그아웃 실패")
            }
        })
    }
    
    const onInHandler = () => {
        navigate("/login", { replace: true });
    }
    
    return (
        <div>
            <div style={{height: '15px',display: 'flex', justifyContent: 'space-between'}}>
                <ul className='Navul' style={{listStyleType: 'none'}}>
                    <li className='Navli'>
                        <Link to="/">Home</Link>
                    </li>
                    <li className='Navli'>
                        <Link to="/register">register</Link>
                    </li>
                    <li className='Navli'>
                        <Link to="/note">쪽지</Link>
                    </li>
                </ul> 
                <ul className={LoginButton} style={{listStyleType: 'none'}}>
                    <li className='Navli'><button onClick={onInHandler}>로그인</button></li>
                </ul>
                <ul className={Display} style={{listStyleType: 'none'}}>
                    <li className='Navli'>{user.userData?.user_id}님</li>
                    <li className='Navli'><button onClick={onOutHandler}>로그아웃</button></li>
                </ul>
            </div>
        </div>
    )
}

export default NavBar
