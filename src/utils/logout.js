import { authOperations } from '../Redux'

export default function logout(errMessage, dispatch) {
  if (
    errMessage.includes('У вас недостаточно прав на выполнение функции') ||
    errMessage.includes('Insufficient privileges to perform')
  ) {
    dispatch(authOperations.getCurrentSessionStatus())
  }
}
