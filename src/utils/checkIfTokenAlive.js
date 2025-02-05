import { authOperations, authActions } from '@redux'
import cookies from './cookies'
import { t, exists as isTranslationExists } from 'i18next'
import { toast } from 'react-toastify'

const userRightsRegex =
  /Changing rights of the user (\d+) is restricted\. This user has the full access to all functions/

const bankCardsMirRegex =
  /You are trying to access the 'Payment confirmation' step that is currently not available/

const purseCurrencyRegex =
  /"__purse_currency__" currency code must match the payment currency/

export default function checkIfTokenAlive(err, dispatch, isLocalLoader) {
  const uglyErrorText = err.message || err
  const errorText = uglyErrorText.trim()

  if (errorText === 'canceled' && isLocalLoader) return false
  if (errorText === 'canceled') {
    console.log('request canceled')
    return
  }

  if (
    errorText.includes('Request in process, please wait') ||
    errorText.includes('Ваш запрос обрабатывается, пожалуйста, подождите')
  ) {
    toast.error(`${t('long_request', { ns: 'other' })}`)
  } else if (
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
  } else if (errorText === 'clone_error') {
    toast.error(`${t('clone_error', { ns: 'cart' })}`)
  } else {
    const isExceptedError =
      errorText.match(bankCardsMirRegex) ||
      errorText.match(userRightsRegex) ||
      errorText.match(purseCurrencyRegex)

    if (!isExceptedError) {
      console.error(err)

      if (isTranslationExists(errorText)) {
        toast.error(t(errorText, { ns: ['auth', 'other'] }))
      } else {
        toast.error(t('warnings.unknown_error', { ns: 'auth' }), {
          toastId: 'unknown_error',
          updateId: 'unknown_error',
        })
      }
    } else {
      console.log(err)
    }
  }

  return true
}
