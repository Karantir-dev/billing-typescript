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

const resetPassword = createAction('RESET_ACTION')

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
  resetPassword,
}
export default authActions
