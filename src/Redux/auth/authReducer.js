import { createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import authActions from './authActions'

const initialState = {
  sessionId: null,
  temporaryId: null,
  isLogined: false,
  totpFormVisibility: 'hidden',
  geoData: null,
  authErrorMsg: '',
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

const isLogined = createReducer(initialState.isLogined, {
  [authActions.isLogined]: (_, { payload }) => payload,
})

const geoData = createReducer(initialState.geoData, {
  [authActions.geoData]: (_, { payload }) => payload,
})

const totpFormVisibility = createReducer(initialState.totpFormVisibility, {
  [authActions.openTotpForm]: () => 'shown',
  [authActions.closeTotpForm]: () => 'hidden',
})

const authErrorMsg = createReducer(initialState.authErrorMsg, {
  [authActions.setAuthErrorMsg]: (_, { payload }) => payload,
  [authActions.clearAuthErrorMsg]: () => '',
})

const authReducer = combineReducers({
  sessionId,
  temporaryId,
  totpFormVisibility,
  isLogined,
  geoData,
  authErrorMsg,
})

export default authReducer
