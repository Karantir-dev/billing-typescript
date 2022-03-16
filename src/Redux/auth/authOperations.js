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

      console.log(data.doc.auth.$id)
      dispatch(authActions.loginSuccess(data.doc.auth.$id))
    })
    .catch(err => {
      console.log(err)
      dispatch(authActions.loginError(err))
    })
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

const chengePassword = newPass => dispatch => {}

const authOperations = { login, reset }
export default authOperations
