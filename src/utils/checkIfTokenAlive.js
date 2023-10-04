import { authOperations, authActions } from '@redux'
import cookies from './cookies'
import { t } from 'i18next'

export default function checkIfTokenAlive(err, dispatch, isLocalLoader) {
  const errorText = err.message || err

  if (errorText === 'canceled' && isLocalLoader) return false

  if (
    errorText.includes('У вас недостаточно прав на выполнение функции') ||
    errorText.includes('Insufficient privileges to perform')
  ) {
    dispatch(authOperations.getCurrentSessionStatus())
  } else if (errorText.includes('Access from this IP denied')) {
    dispatch(authActions.setAuthErrorMsg(t('warnings.badip', { ns: 'auth' })))
    cookies.eraseCookie('sessionId')
    dispatch(authActions.logoutSuccess())
  } else if (errorText.includes('460')) {
    dispatch(authActions.setAuthErrorMsg(t('warnings.460_error_code', { ns: 'auth' })))
    cookies.eraseCookie('sessionId')
    dispatch(authActions.logoutSuccess())
  } else if (err?.response?.status === '403') {
    dispatch(authActions.setAuthErrorMsg(t('warnings.403_error_code', { ns: 'auth' })))
    cookies.eraseCookie('sessionId')
    dispatch(authActions.logoutSuccess())
  } else {
    console.error(err)
  }

  return true
}
