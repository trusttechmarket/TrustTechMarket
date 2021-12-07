import axios from 'axios';
import { response } from 'express';
import LoginPage from '../components/views/LoginPage/LoginPage';
import {
    LOGIN_USER
} from './types';

export function loginUser(dataToSubmit) {

    const request = axios.post('/login', body).
    then(response => response.data)

    return {
        type: LOGIN_USER,
        payload: request
    }
}