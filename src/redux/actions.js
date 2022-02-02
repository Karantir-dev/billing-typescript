import {SHOW_LOADING, 
        HIDE_LOADING, 
        SET_LOGIN, 
        SET_LOGIN_ERROR,
        SET_TOKEN} from "./types"
import { LoginUser} from "../requests/Requests"
import {reactLocalStorage} from 'reactjs-localstorage';


export const setData = (data) => {
    return {
         type : SET_LOGIN,
         data
    }
}

export const setLoginError = (loginError) => {
    return {
         type : SET_LOGIN_ERROR,
         loginError
    }
}

export const setShowLoading = (loading) => {
    return {
         type : SHOW_LOADING,
         loading
    }
}

export const setHideLoading = (loading) => {
    return {
         type : HIDE_LOADING,
         loading
    }
}

export const setToken = (token) => {
    return {
         type : SET_TOKEN,
         token
    }
}

export const loginHandler = (email, passowrd, lang) => {
    return (dispatch) => {
        dispatch(setShowLoading(true))
        LoginUser(email, passowrd, lang)
            .then((data) =>{
                reactLocalStorage.set('token', data.data.doc.auth.$id)
                dispatch(setData(data))
                dispatch(setToken(data.data.doc.auth.$id))
                dispatch(setHideLoading(false))
                })
            .catch((loginError) => {
              dispatch(setLoginError(loginError))
              dispatch(setHideLoading(false))  
            }) 
            
    }
}

