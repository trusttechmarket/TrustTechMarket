import React from 'react'
import {Link} from "react-router-dom"
import './NavBar.css'


function NavBar() {
    return (
        <div style={{display: 'flex'}}>
            <ul className='Navul' style={{listStyleType: 'none'}}>
                <li className='Navli'>
                <Link to="/">Home</Link>
                </li>
                <li className='Navli'>
                <Link to="/login">login</Link>
                </li>
                <li className='Navli'>
                <Link to="/register">register</Link>
                </li>
            </ul>
        </div>
    )
}

export default NavBar
