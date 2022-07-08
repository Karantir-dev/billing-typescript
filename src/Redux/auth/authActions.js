import { createAction } from '@reduxjs/toolkit'

const registrationSuccess = createAction('REGISTRATION_SUCCESS')

const loginSuccess = createAction('LOGIN_SUCCESS')

const logoutSuccess = createAction('LOGOUT_SUCCESS')

const openTotpForm = createAction('OPEN_TOTP_FORM')
const closeTotpForm = createAction('CLOSE_TOTP_FORM')

const setTemporaryId = createAction('SET_TEMPORARY_ID')
const clearTemporaryId = createAction('CLEAR_TEMPORARY_ID')

const getCurrentUserRequest = createAction('GET_CURRENT_USER_REQUEST')
const getCurrentUserSuccess = createAction('GET_CURRENT_USER_SUCCESS')
const getCurrentUserError = createAction('GET_CURRENT_USER_ERROR')

export default {
  registrationSuccess,
  loginSuccess,
  openTotpForm,
  closeTotpForm,
  setTemporaryId,
  clearTemporaryId,
  logoutSuccess,
  getCurrentUserRequest,
  getCurrentUserSuccess,
  getCurrentUserError,
}
