import { authOperations, authActions } from '../Redux'
import coockies from './coockies'

export default function checkIfTokenAlive(errMessage, dispatch) {
  if (
    errMessage.includes('У вас недостаточно прав на выполнение функции') ||
    errMessage.includes('Insufficient privileges to perform')
  ) {
    dispatch(authOperations.getCurrentSessionStatus())
  } else if (errMessage.includes('Access from this IP denied')) {
    coockies.eraseCookie('sessionId')
    dispatch(authActions.logoutSuccess())
  } else {
    console.error(errMessage)
  }
}
