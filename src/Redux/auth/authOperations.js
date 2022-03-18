import axios from 'axios'
import qs from 'qs'
import authActions from './authActions'
import { BASE_URL } from '../../config/config'

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})

const login = (email, password, reCaptcha, setLoginError) => dispatch => {
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
        setLoginError(true)
        throw data.doc.error.msg.$
      }
      const sessionId = data.doc.auth.$id

      axiosInstance
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
          if (data.doc?.error.$type === 'extraconfirm') {
            dispatch(authActions.setTemporaryId(sessionId))
            dispatch(authActions.openTotpForm())
            return
          }

          dispatch(authActions.loginSuccess(sessionId))
        })
    })
    .catch(err => {
      console.log('error', err)
      dispatch(authActions.loginError(err))
    })
}

const sendTotp = (totp, setError) => (dispatch, getState) => {
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

      dispatch(authActions.loginSuccess(data.doc.auth.$id))
    })
    .catch(err => console.log('error', err))
}

const reset =
  (email, lang, setConfirmEmail, setTimeSendError, setTypeEmailError) => dispatch => {
    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'recovery',
          email: email,
          lang: lang,
          sok: 'ok',
          out: 'json',
        }),
      )
      .then(({ data }) => {
        console.log(data)
        if (data.doc.error) {
          if (data.doc.error.param) {
            setTimeSendError(data.doc.error.param[1].$)
          }
          setConfirmEmail(true)
          setTypeEmailError(data.doc.error.$type)
          throw data.doc.error.msg.$
        } else {
          setConfirmEmail(false)
          setTypeEmailError('')
        }
      })
      .catch(error => console.log(error))
  }

const chengePassword = (password, userId, secretKey) => dispatch => {
  console.log(password, userId, secretKey)
  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'recovery.change',
        sok: 'ok',
        userid: '11',
        secret: 'CUVmEia2j0uQf9SDBMFWFKr3cJVPexu8',
        password: '11112222FDb@',
        confirm: '11112222FDb@',
        out: 'json',
      }),
    )
    .then(res => console.log(res))
    .catch(error => console.log('ERROR', error))
}

const authOperations = { login, reset, chengePassword, sendTotp }

export default authOperations
