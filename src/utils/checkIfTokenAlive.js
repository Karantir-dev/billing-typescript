import { authOperations, authActions } from '@redux'
import cookies from './cookies'
import { t, exists as isTranslationExists } from 'i18next'
import { toast } from 'react-toastify'

const userRightsRegex =
  /Changing rights of the user (\d+) is restricted\. This user has the full access to all functions/

const bankCardsMirRegex =
  /You are trying to access the 'Payment confirmation' step that is currently not available/

const purseCurrencyRegex =
  // eslint-disable-next-line no-regex-spaces
  /"__purse_currency__" currency code must match the payment currency/

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

    /* 
      with 403 error we get "Network Error" text
      further error handling is performed in Navigation.jsx
    */
  } else if (errorText.includes('Network Error')) {
    dispatch(authActions.setAuthErrorMsg('warnings.403_error_code'))
  } else {
    console.error(err)

    const isExceptedError =
      errorText.match(bankCardsMirRegex) ||
      errorText.match(userRightsRegex) ||
      errorText.match(purseCurrencyRegex)

    if (!isExceptedError) {
      // need to check whether it has sense (look for error translation)
      if (isTranslationExists(errorText)) {
        toast.error(t(errorText, { ns: ['auth', 'other'] }), { position: 'bottom-right' })
      } else {
        toast.error(t('warnings.unknown_error', { ns: 'auth' }), {
          position: 'bottom-right',
          toastId: 'unknown_error',
          updateId: 'unknown_error',
        })
      }
    }
  }

  return true
}
