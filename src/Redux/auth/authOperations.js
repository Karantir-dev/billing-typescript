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

const token = {
  set(token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
  },
  unset() {
    axios.defaults.headers.common.Authorization = ''
  },
}

const login = (email, password) => dispatch => {
  dispatch(authActions.loginRequest())

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'auth',
        username: email,
        password,
        sok: 'ok',
        out: 'json',
      }),
    )
    .then(({ data }) => {
      token.set(data.doc.auth.$id)

      dispatch(authActions.loginSuccess(data))
    })
    .catch(err => {
      dispatch(authActions.loginError())
    })
}

const authOperations = { login }
export default authOperations
