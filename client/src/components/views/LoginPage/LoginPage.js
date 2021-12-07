import React, {useState} from 'react';
import { useDispatch } from 'react-redux';
import {loginUser} from '../../../_actions/user_action'
import 'antd';
function LoginPage(props) {

   const dispatch = useDispatch();

    const [ID, setID] = useState("")
    const [Password, setPassword] = useState("")
    
    const onIDHandler = (event) => {
        setID(event.currentTarget.value)
    }
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }
    const onsubmitHandler = (event) => {
        event.preventDefault();
        
        let body = {
            id: ID,
            password: Password
            }

            dispatch(loginUser(body))
                .then(response => {
                    if (response.payload.loginSuccess){
                    props.history.push('/')
                    } else{
                        alert('Error.')
                    }
                })     
    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center'
            , width: '100%', height: '100vh'
        }}>
            <form style={{display:'flex', flexDirection: 'column'}}
            onSubmit = {onsubmitHandler}>
                <h2>로그인하기</h2>
                <label>ID</label>
                <input type="ID" value={ID} onChange={onIDHandler}/>
                <label>PW</label>
                <input type="password" value={Password} onChange={onPasswordHandler}/>
                <br/> 
                <button>
                    Login
                </button>
            </form>
        </div>
    )
}

export default LoginPage 