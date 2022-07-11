import { createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import authActions from './authActions'

const initialState = {
  sessionId: null,
  temporaryId: null,
  totpFormVisibility: 'hidden',
}

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

const authReducer = combineReducers({
  sessionId,
  temporaryId,
  totpFormVisibility,
})

export default authReducer