import { authOperations, authActions } from '@redux'
import cookies from './cookies'

export default function checkIfTokenAlive(errMessage, dispatch, isLocalLoader) {
  if (errMessage === 'canceled' && isLocalLoader) return false

  if (
    errMessage.includes('У вас недостаточно прав на выполнение функции') ||
    errMessage.includes('Insufficient privileges to perform')
  ) {
    dispatch(authOperations.getCurrentSessionStatus())
  } else if (errMessage.includes('Access from this IP denied')) {
    cookies.eraseCookie('sessionId')
    dispatch(authActions.logoutSuccess())
  } else {
    console.error(errMessage)
  }
  return true
}
