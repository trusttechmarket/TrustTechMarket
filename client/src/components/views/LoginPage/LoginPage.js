import React, {useState} from 'react';
import Axios from 'axios';
import { useDispatch } from 'react-redux';
import {loginUser} from '../../../_actions/user_action'
function LoginPage() {
    const dispatch = useDispatch();
    const [userID, setuserID] = useState("");
    const [userPW, setuserPW] = useState("");

    const onIdHandler = (event) => {
        setuserID(event.currentTarget.value)
    }
    const onPwHandler = (event) => {
        setuserPW(event.currentTarget.value)
    }
    const onSubmitHandler = (event) => {
        event.preventDefault();
        console.log(userID, userPW)

        let body = {
            userID : userID,
            userPW : userPW,
        }

        dispatch(loginUser(body))

        //Axios post 방식으로 전달
        // Axios.post('/login', body).then(response => {

        // })
    }
    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center'
            , width: '100%', height: '100vh'
        }}>
            <form style={{display:'flex', flexDirection: 'column'}}
                onSubmit = {onSubmitHandler}>
                <label>ID</label>
                <input type="ID" value={userID} onChange={onIdHandler}/>
                <label>PW</label>
                <input type="password" value={userPW} onChange={onPwHandler}/>
                <br/>
                <button>
                    Login
                </button>
            </form>
        </div>
    )
}

export default LoginPage 