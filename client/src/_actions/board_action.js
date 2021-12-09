import axios from "axios";

import {
    WRITE_POST
} from "./types"

export function writePost(dataToSubmit) {
    const request = axios.post('/api/board/write', dataToSubmit)
    .then(response => response.data);
    
    return {
        type: WRITE_POST,
        payload: request
    }

}