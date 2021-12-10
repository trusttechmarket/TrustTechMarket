import axios from "axios";

import {
    WRITE_POST
} from "./types"

export function writePost(DataToSubmit) {
    const request = axios.post('/api/board/write', DataToSubmit)
    .then(response => response.data);
    
    return {
        type: WRITE_POST,
        payload: request
    }

}