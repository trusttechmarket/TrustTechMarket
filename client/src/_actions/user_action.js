import axios from 'axios';
<<<<<<< HEAD

=======
//import { response } from 'express';
//import LoginPage from '../components/views/LoginPage/LoginPage';
>>>>>>> refs/remotes/origin/main
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER
} from './types';

export function loginUser(dataToSubmit) {

<<<<<<< HEAD
    const request = axios.post('/api/users/login', dataToSubmit).then(response => response.data)
=======
    const request = axios.post('/api/login', dataToSubmit)
    .then(response => response.data)
>>>>>>> refs/remotes/origin/main

    return {
        type: LOGIN_USER,
        payload: request
    }
}

export function registerUser(dataToSubmit) {

    const request = axios.post('/api/register', dataToSubmit)
    .then(response => response.data)

    return {
        type: REGISTER_USER,
        payload: request
    }
}

export function auth() {

    const request = axios.get('/api/auth')
    .then(response => response.data)

    return {
        type: AUTH_USER,
        payload: request
    }
}