import { UPDATE_USER, CLEAR_USER } from './constants';

const initialState = {
    id: 0,
    username: '',
    taskList: [],
    goalList: []

}

export default function reducer(state = initialState, action){
    const { type, payload } = action;
    switch(type){
        case UPDATE_USER:
            const { id, username, taskList, goalList } = payload;
            return { ...state, id, username, taskList, goalList }
        case CLEAR_USER:
            return { ...state, id: 0, username: '', taskList: [], goalList: [] }
        default:
            return state;
    }
}