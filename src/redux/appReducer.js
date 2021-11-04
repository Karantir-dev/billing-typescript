import {SHOW_LOADING, 
        SET_LOGIN, 
        SET_LOGIN_ERROR,
        HIDE_LOADING, 
        SET_TOKEN} from "./types"


let initialState = {
    loginData: {},
    loginError: {},
    token: '',
    loading: false
}


 const appReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_LOGIN:
            return {
                ...state,
                loginData: action.data,
            }
        
        case SET_LOGIN_ERROR:
            return{
                ...state,
                loginError: action.loginError,
            }
        case SHOW_LOADING:
            return{
                ...state,
                loading: action.loading,
            }
        case HIDE_LOADING:
            return{
                ...state,
                loading: action.loading,
                }
        case SET_TOKEN:
            return{
                ...state,
                token: action.token,
                }
        default:
            return state;
    }
}   

export default appReducer;