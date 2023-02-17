import { authOperations, authActions } from '../Redux'

export default function checkIfTokenAlive(errMessage, dispatch) {
  if (
    errMessage.includes('У вас недостаточно прав на выполнение функции') ||
    errMessage.includes('Insufficient privileges to perform')
  ) {
    dispatch(authOperations.getCurrentSessionStatus())
  } else if (errMessage.includes('Access from this IP denied')) {
    dispatch(authActions.logoutSuccess())
  } else {
    console.error(errMessage)
  }
}