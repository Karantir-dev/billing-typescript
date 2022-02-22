import { createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import authActions from './authActions'

const initialState = {
  data: {},
  sessionId: null,
  isLoading: false,
}

const data = createReducer(initialState.data, {
  [authActions.loginSuccess]: (_, { payload }) => payload,
  [authActions.logoutSuccess]: () => ({}),
})

const sessionId = createReducer(initialState.sessionId, {
  [authActions.loginSuccess]: (_, { payload }) => payload,
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
  sessionId,
  isLoading,
})
