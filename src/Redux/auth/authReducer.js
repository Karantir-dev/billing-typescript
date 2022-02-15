import { createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import authActions from './authActions'

const initialState = {
  data: {},
  token: false,
  isLoading: false,
}

const data = createReducer(initialState.data, {
  [authActions.loginSuccess]: (_, { payload }) => payload,
  [authActions.logoutSuccess]: () => ({}),
})

const token = createReducer(initialState.token, {
  [authActions.loginSuccess]: (_, { payload }) => true,
  [authActions.logoutSuccess]: () => false,
  [authActions.getCurrentUserSuccess]: () => true,
  [authActions.getCurrentUserError]: () => false,
})

const isLoading = createReducer(initialState.isLoading, {
  [authActions.registrationRequest]: () => true,
  [authActions.registrationSuccess]: () => false,
  [authActions.registrationError]: () => false,
  [authActions.loginRequest]: () => true,
  [authActions.loginSuccess]: () => false,
  [authActions.loginError]: () => false,
  [authActions.logoutRequest]: () => true,
  [authActions.logoutSuccess]: () => false,
  [authActions.logoutError]: () => false,
  [authActions.getCurrentUserRequest]: () => true,
  [authActions.getCurrentUserSuccess]: () => false,
  [authActions.getCurrentUserError]: () => false,
})

export default combineReducers({
  data,
  token,
  isLoading,
})

// const appReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case SET_LOGIN:
//       return {
//         ...state,
//         loginData: action.data,
//       }

//     case SET_LOGIN_ERROR:
//       return {
//         ...state,
//         loginError: action.loginError,
//       }
//     case SHOW_LOADING:
//       return {
//         ...state,
//         loading: action.loading,
//       }
//     case HIDE_LOADING:
//       return {
//         ...state,
//         loading: action.loading,
//       }
//     case SET_TOKEN:
//       return {
//         ...state,
//         token: action.token,
//       }
//     default:
//       return state
//   }
// }
