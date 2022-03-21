import { createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { authActions } from './authActions'

const initialState = {
  // data: {},
  sessionId: null,
  temporaryId: null,
  totpFormVisibility: 'hidden',
}

// const data = createReducer(initialState.data, {
//   [authActions.loginSuccess]: (_, { payload }) => payload,
//   [authActions.logoutSuccess]: () => ({}),
// })

const temporaryId = createReducer(initialState.temporaryId, {
  [authActions.setTemporaryId]: (_, { payload }) => payload,
  [authActions.clearTemporaryId]: () => null,
})

const sessionId = createReducer(initialState.sessionId, {
  [authActions.loginSuccess]: (_, { payload }) => payload,
  [authActions.logoutSuccess]: () => null,
  // [authActions.getCurrentUserSuccess]: () => true,
  // [authActions.getCurrentUserError]: () => null,
})

const totpFormVisibility = createReducer(initialState.totpFormVisibility, {
  [authActions.openTotpForm]: () => 'shown',
  [authActions.closeTotpForm]: () => 'hidden',
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
  // [authActions.getCurrentUserRequest]: () => true,
  // [authActions.getCurrentUserSuccess]: () => false,
  // [authActions.getCurrentUserError]: () => false,
  // [authActions.maxPassResetError]: () => false,
})

export const authReducer = combineReducers({
  // data,
  sessionId,
  temporaryId,
  totpFormVisibility,
})
