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

const login = (email, password, reCaptcha) => dispatch => {
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
      console.log(err)
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
    .catch(err => console.log(err))
}

const authOperations = { login, sendTotp }
export default authOperations
