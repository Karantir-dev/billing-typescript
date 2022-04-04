import { createAction } from '@reduxjs/toolkit'

// const registrationRequest = createAction('REGISTRATION_REQUEST')
const registrationSuccess = createAction('REGISTRATION_SUCCESS')
// const registrationError = createAction('REGISTRATION_ERROR')

const loginSuccess = createAction('LOGIN_SUCCESS')

const openTotpForm = createAction('OPEN_TOTP_FORM')
const closeTotpForm = createAction('CLOSE_TOTP_FORM')

const setTemporaryId = createAction('SET_TEMPORARY_ID')
const clearTemporaryId = createAction('CLEAR_TEMPORARY_ID')

const logoutSuccess = createAction('LOGOUT_SUCCESS')

const getCurrentUserRequest = createAction('GET_CURRENT_USER_REQUEST')
const getCurrentUserSuccess = createAction('GET_CURRENT_USER_SUCCESS')
const getCurrentUserError = createAction('GET_CURRENT_USER_ERROR')

// const maxPassResetError = createAction('MAX_PASS_RESET_ERROR')

export const authActions = {
  // registrationRequest,
  registrationSuccess,
  // registrationError,

  loginSuccess,

  openTotpForm,
  closeTotpForm,
  setTemporaryId,
  clearTemporaryId,

  logoutSuccess,

  getCurrentUserRequest,
  getCurrentUserSuccess,
  getCurrentUserError,
  // maxPassResetError,
}
