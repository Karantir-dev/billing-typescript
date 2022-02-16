import { createAction } from '@reduxjs/toolkit'

const registrationRequest = createAction('REGISTRATION_REQUEST')
const registrationSuccess = createAction('REGISTRATION_SUCCESS')
const registrationError = createAction('REGISTRATION_ERROR')

const loginRequest = createAction('LOGIN_REQUEST')
const loginSuccess = createAction('LOGIN_SUCCESS')
const loginError = createAction('LOGIN_ERROR')

const logoutRequest = createAction('LOGOUT_REQUEST')
const logoutSuccess = createAction('LOGOUT_SUCCESS')
const logoutError = createAction('LOGOUT_ERROR')

const getCurrentUserRequest = createAction('GET_CURRENT_USER_REQUEST')
const getCurrentUserSuccess = createAction('GET_CURRENT_USER_SUCCESS')
const getCurrentUserError = createAction('GET_CURRENT_USER_ERROR')

const authActions = {
  registrationRequest,
  registrationSuccess,
  registrationError,
  loginRequest,
  loginSuccess,
  loginError,
  logoutRequest,
  logoutSuccess,
  logoutError,
  getCurrentUserRequest,
  getCurrentUserSuccess,
  getCurrentUserError,
}
export default authActions

// import {
//   SHOW_LOADING,
//   HIDE_LOADING,
//   SET_LOGIN,
//   SET_LOGIN_ERROR,
//   SET_TOKEN,
// } from '../types'
// import { LoginUser } from '../../requests/Requests'
// import { reactLocalStorage } from 'reactjs-localstorage'

// export const setData = data => {
//   return {
//     type: SET_LOGIN,
//     data,
//   }
// }

// export const setLoginError = loginError => {
//   return {
//     type: SET_LOGIN_ERROR,
//     loginError,
//   }
// }

// export const setShowLoading = loading => {
//   return {
//     type: SHOW_LOADING,
//     loading,
//   }
// }

// export const setHideLoading = loading => {
//   return {
//     type: HIDE_LOADING,
//     loading,
//   }
// }

// export const setToken = token => {
//   return {
//     type: SET_TOKEN,
//     token,
//   }
// }

// export const loginHandler = (email, passowrd) => {
//   return dispatch => {
//     dispatch(setShowLoading(true))

//     LoginUser(email, passowrd)
//       .then(data => {
//         reactLocalStorage.set('token', data.data.doc.auth.$id)
//         dispatch(setData(data))
//         dispatch(setToken(data.data.doc.auth.$id))
//         dispatch(setHideLoading(false))
//       })
//       .catch(loginError => {
//         dispatch(setLoginError(loginError))
//         dispatch(setHideLoading(false))
//       })
//   }
// }
