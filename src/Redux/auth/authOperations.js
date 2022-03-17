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

const reset = (email, lang) => dispatch => {
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
    .then(res => console.log(res))
    .catch(error => console.log(error))
}

//  qs.stringify({
//         func: 'recovery.change',
//         password: password,
//         sok: 'ok',
//         out: 'json',
//         user: int
//         secret: string
//       }),

const chengePassword = newPass => dispatch => {
  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'recovery.change',
        sok: 'ok',
        sfromextform: 'yes',
        newwindow: 'extform',
        clicked_button: 'ok',
        userid: '11',
        secret: 'nEwHiUYvA4MBe6M6ilNVeMWGnuSY3FeO',
        project: '1',
        type: 'type',
        password: newPass,
        confirm: newPass,
      }),
    )
    .then(res => console.log(res.data))
    .catch(error => console.log(error))
}

const authOperations = { login, reset, chengePassword, sendTotp }

export default authOperations
