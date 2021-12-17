import React from 'react'
import { useNavigate } from "react-router-dom";


function TopPannel() {
    const navigate = useNavigate();
    
    const onHandleChange = () => {
         navigate("/", { replace: true });
    }
    
    
    return (
        <div style={{width: '100%', justifyContent:'center', alignContent: 'center'}}>
            <h1 style={{textAlign: 'center'}} onClick={onHandleChange}>믿을테크마켓</h1>
        </div>
    )
}

export default TopPannel