import {
    WRITE_POST,
} from '../_actions/types';

export default function board(state = {}, action) {
    switch (action.type) {
        case WRITE_POST:
            return {...state, writepostSuccess: action.payload}
            
        default:
            return state;
    }
}