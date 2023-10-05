import { authOperations, authActions } from '@redux'
import cookies from './cookies'
import { t, exists as isTranslationExists } from 'i18next'
import { toast } from 'react-toastify'

export default function checkIfTokenAlive(err, dispatch, isLocalLoader) {
  const errorText = err.message || err

  if (errorText === 'canceled' && isLocalLoader) return false

  if (
    errorText.includes('У вас недостаточно прав на выполнение функции') ||
    errorText.includes('Insufficient privileges to perform')
  ) {
    dispatch(authOperations.getCurrentSessionStatus())
  } else if (errorText.includes('Access from this IP denied')) {
    dispatch(authActions.setAuthErrorMsg('warnings.badip'))
    cookies.eraseCookie('sessionId')
    dispatch(authActions.logoutSuccess())
  } else if (errorText.includes('460')) {
    dispatch(authActions.setAuthErrorMsg('warnings.460_error_code'))
    cookies.eraseCookie('sessionId')
    dispatch(authActions.logoutSuccess())
  } else if (errorText.includes('403')) {
    dispatch(authActions.setAuthErrorMsg('warnings.403_error_code'))
    cookies.eraseCookie('sessionId')
    dispatch(authActions.logoutSuccess())
  } else {
    console.error(err)

    // need to check whether it has sense (look for error translation)
    if (isTranslationExists(errorText)) {
      toast.error(t(errorText, { ns: ['auth', 'other'] }), { position: 'bottom-right' })
    } else {
      toast.error(t('warnings.unknown_error', { ns: 'auth' }), {
        position: 'bottom-right',
      })
    }
  }

  return true
}
