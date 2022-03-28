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

export const authReducer = combineReducers({
  // data,
  sessionId,
  temporaryId,
  totpFormVisibility,
})
