import { createAction } from '@reduxjs/toolkit'

const registrationRequest = createAction('REGISTRATION_REQUEST')
const registrationSuccess = createAction('REGISTRATION_SUCCESS')
const registrationError = createAction('REGISTRATION_ERROR')

const loginRequest = createAction('LOGIN_REQUEST')
const loginSuccess = createAction('LOGIN_SUCCESS')
const loginError = createAction('LOGIN_ERROR')

const openTotpForm = createAction('OPEN_TOTP_FORM')
const closeTotpForm = createAction('CLOSE_TOTP_FORM')

const setTemporaryId = createAction('SET_TEMPORARY_ID')
const clearTemporaryId = createAction('CLEAR_TEMPORARY_ID')

const logoutRequest = createAction('LOGOUT_REQUEST')
const logoutSuccess = createAction('LOGOUT_SUCCESS')
const logoutError = createAction('LOGOUT_ERROR')

const getCurrentUserRequest = createAction('GET_CURRENT_USER_REQUEST')
const getCurrentUserSuccess = createAction('GET_CURRENT_USER_SUCCESS')
const getCurrentUserError = createAction('GET_CURRENT_USER_ERROR')

// const maxPassResetError = createAction('MAX_PASS_RESET_ERROR')

const authActions = {
  registrationRequest,
  registrationSuccess,
  registrationError,
  loginRequest,
  loginSuccess,
  loginError,
  openTotpForm,
  closeTotpForm,
  setTemporaryId,
  clearTemporaryId,
  logoutRequest,
  logoutSuccess,
  logoutError,
  getCurrentUserRequest,
  getCurrentUserSuccess,
  getCurrentUserError,
  // maxPassResetError,
}
export default authActions
