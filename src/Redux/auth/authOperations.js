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

const authOperations = { login, reset, chengePassword }
export default authOperations
