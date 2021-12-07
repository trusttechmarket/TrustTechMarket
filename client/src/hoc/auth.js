import React, {useEffect} from 'react';
import { useDispatch } from 'react-redux';
import {auth} from '../_actions/user_action';
import { useNavigate } from "react-router-dom";

export default function (SpecificComponent, option, adminRoute = null) {
    
    function AuthenticationCheck(props) {
        const navigate = useNavigate();
        const dispatch = useDispatch();
        useEffect(() => {
            dispatch(auth()).then(response => {
                
                if(response.payload.isAuth) {
                    //로그인하지 않은 상태
                    if(option) {
                        navigate("../login", { replace: true });
                    }
                }
                else {
                    //로그인한 상태
                    if(adminRoute && !response.payload.isAdmin) {
                        navigate("../", { replace: true });
                    }
                    else {
                        if(option == false) {
                            navigate("../", { replace: true });
                        }
                    }
                }
            })
            
        })
        
        return (
        <SpecificComponent {...props} /> )
    }
    
    
    
    return AuthenticationCheck
}