import { useNavigate } from "react-router-dom";
import React, {useState} from 'react';
import { useDispatch } from 'react-redux';
import {registerUser} from '../../../_actions/user_action'


function RegisterPage(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [userID, setuserID] = useState("");
    const [userPW, setuserPW] = useState("");
    const [userConfirmPW, setuserComfirmPW] = useState("");
    const [userEmail, setuserEmail] = useState("");
    const [userRegion, setuserRegion] = useState("");

    const onIdHandler = (event) => {
        setuserID(event.currentTarget.value)
    }
    const onPwHandler = (event) => {
        setuserPW(event.currentTarget.value)
    }
    const onConfirmPwHandler = (event) => {
        setuserComfirmPW(event.currentTarget.value)
    }
    const onEmailHandler = (event) => {
        setuserEmail(event.currentTarget.value)
    }
    const onRegionHandler = (event) => {
        setuserRegion(event.currentTarget.value)
    }
    const onSubmitHandler = (event) => {
        event.preventDefault();
        //console.log(userID, userPW)
        if(userPW !== userConfirmPW) {
            return alert('비밀번호와 비밀번호 확인은 같아야 합니다.')
        }

        let body = {
            userID : userID,
            userPW : userPW,
            userRegion : userRegion,
            userEmail : userEmail
        }

        dispatch(registerUser(body)).then(response => {
            if(response.payload.register) {
                navigate("../login", { replace: true });
            }
            else {
                alert('Failed to Sign up')
            }
        })

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
                <label>Confirm PW</label>
                <input type="password" value={userConfirmPW} onChange={onConfirmPwHandler}/>
                <label>email</label>
                <input type="email" value={userEmail} onChange={onEmailHandler}/>
                <label>region</label>
                <input type="text" value={userRegion} onChange={onRegionHandler}/>
                <br/>
                <button typt="submit">
                    회원가입
                </button>
            </form>
        </div>
    )
}

export default RegisterPage