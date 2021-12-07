import { useNavigate } from "react-router-dom";
import React, {useState} from 'react';
import { useDispatch } from 'react-redux';
import {loginUser} from '../../../_actions/user_action'

function LoginPage(props) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [userID, setuserID] = useState("");
    const [userPW, setuserPW] = useState("");

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
        //console.log(userID, userPW)

        let body = {
            userID : userID,
            userPW : userPW,
        }

        dispatch(loginUser(body)).then(response => {
            if(response.payload.loginSuccess) {
                navigate("../", { replace: true });
            }
            else {
                alert('Error')
            }
        })

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
                <input type="password" value={userPW} onChange={onPwHandler}/>
                <br/>
                <button type="submit">
                    Login
                </button>
            </form>
        </div>
    )
}

export default LoginPage 