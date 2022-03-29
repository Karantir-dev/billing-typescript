import axios from 'axios'
import qs from 'qs'
import { authActions } from './authActions'
import { actions } from '../actions'
import { BASE_URL } from '../../config/config'

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})

const login = (email, password, reCaptcha, setErrMsg, resetRecaptcha) => dispatch => {
  dispatch(authActions.loginRequest())

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'auth',
        username: email,
        password: password,
        sok: 'ok',
        out: 'json',
        'g-recaptcha-response': reCaptcha,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) {
        setErrMsg(data.doc.error.$object)
<<<<<<< HEAD

        throw data.doc.error.msg.$
      }
      const sessionId = data.doc.auth.$id

=======

        throw new Error(data.doc.error.msg.$)
      }
      const sessionId = data.doc.auth.$id

>>>>>>> 6418e4cc7e1d6cef03341e6fb8661f60702d77e9
      return axiosInstance
        .post(
          '/',
          qs.stringify({
            func: 'usrparam',
            sok: 'ok',
            out: 'json',
            auth: sessionId,
          }),
        )
        .then(({ data }) => {
          if (data.doc.error) {
            if (data.doc.error.$type === 'extraconfirm') {
              dispatch(authActions.setTemporaryId(sessionId))

              dispatch(actions.hideLoader())

              dispatch(authActions.openTotpForm())
              return
            } else {
<<<<<<< HEAD
              throw `usrparam - ${data.doc.error.msg.$}`
=======
              throw new Error(`usrparam - ${data.doc.error.msg.$}`)
>>>>>>> 6418e4cc7e1d6cef03341e6fb8661f60702d77e9
            }
          }

          dispatch(authActions.loginSuccess(sessionId))
        })
    })
    .catch(error => {
      resetRecaptcha()
<<<<<<< HEAD
      console.log('auth -', error)
=======
      console.log('auth -', error.message)
>>>>>>> 6418e4cc7e1d6cef03341e6fb8661f60702d77e9
      dispatch(authActions.loginError())
    })
}

const sendTotp = (totp, setError) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { temporaryId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'totp.confirm',
        sok: 'ok',
        out: 'json',
        clicked_button: 'ok',
        qrcode: totp,
        auth: temporaryId,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) {
        setError(true)
        throw data.doc.error.msg.$
      }

      dispatch(authActions.clearTemporaryId())
      dispatch(authActions.loginSuccess(data.doc.auth.$id))
    })
    .catch(error => {
      dispatch(actions.hideLoader())
      console.log('totp.confirm - ', error)
    })
}

const reset = (email, setEmailSended, setErrorType, setErrorTime) => dispatch => {
  dispatch(actions.showLoader())

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'recovery',
        email,
        sok: 'ok',
        out: 'json',
      }),
    )
    .then(({ data }) => {
      console.log(data.doc)
      dispatch(actions.hideLoader())

      if (data.doc.error) {
        setErrorType(data.doc.error.$type)

        if (data.doc.error.$type === 'min_email_send_timeout') {
          setErrorTime(data.doc.error.param[1].$)
        }

        throw data.doc.error.msg.$
      }

      setEmailSended(true)
    })
    .catch(error => console.log('recovery - ', error))
}

const changePassword =
  (password, userId, secretKey, setErrType, onChangeSuccess) => dispatch => {
    dispatch(actions.showLoader())

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'recovery.change',
          sok: 'ok',
          userid: userId,
          secret: secretKey,
          password,
          confirm: password,
          out: 'json',
        }),
      )
      .then(({ data }) => {
        console.log(data.doc)
        if (data.doc.error) {
          setErrType(data.doc.error.$type)
          throw data.doc.error.msg.$
        }

        axiosInstance.post(
          '/',
          qs.stringify({
            func: 'logon',
            auth: data.doc.auth.$id,
            sok: 'ok',
            out: 'json',
          }),
        )

        onChangeSuccess()
        dispatch(actions.hideLoader())
      })
      .catch(error => {
        dispatch(actions.hideLoader())
        console.log('recovery.change - ', error)
      })
  }

const logout = () => {}

<<<<<<< HEAD
export const authOperations = { login, reset, changePassword, sendTotp, logout }
=======
const getCountries = setCountries => () => {
  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'register',
        out: 'json',
      }),
    )
    .then(({ data }) => {
      const countries = data.doc.slist[0].val
      countries.shift()
      setCountries(countries)
    })
    .catch(err => {
      console.log(err)
    })
}

export const authOperations = {
  login,
  reset,
  changePassword,
  sendTotp,
  logout,
  getCountries,
}
>>>>>>> 6418e4cc7e1d6cef03341e6fb8661f60702d77e9
