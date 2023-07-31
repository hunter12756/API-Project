import { csrfFetch } from "./csrf";

const SET_USER = "session/setUser"
const REMOVE_USER = "session/removeUser"

const setUser= (user)=> {
    return {
        type: SET_USER,
        payload: user,
    }
}

const removeUser= ()=> {
    return {
        type: SET_USER,
    }
}
export const login = (user) => async (dispatch) => {
    const {credential, password} = user;
    //try {
        const res = await csrfFetch("/api/session", {
            method:"POST",
            body: JSON.stringify({
                credential,
                password,
            }),
        });
        const data = await res.json();
        //if(res.ok){
            dispatch(setUser(data.user))
            return res;
       //}
    //}catch (error) {
     //   const data = await error.json();
      //  throw data;
    //}
}
const initialState = {user:null}

const sessionReducer = (state = initialState, action)=> {
    let newState;
    switch(action.type) {
        case SET_USER:
            newState = Object.assign({},state);
            newState.user = action.payload;
            return newState;
        case REMOVE_USER:
            newState= Object.assign({},state);
            newState.user = null;
            return newState;
        default:
            return state;
    }
}
export default sessionReducer;
