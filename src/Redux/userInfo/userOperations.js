import axios from 'axios'
import qs from 'qs'
import { userActions } from './userActions'
import { actions } from '../actions'
import { BASE_URL } from '../../config/config'

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})

const currentSession = localStorage.getItem('persistsessionId')

const getUserInfo = setUserInfo => () => {
  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'whoami',
        out: 'json',
        auth: `${currentSession.sessionId}`,
      }),
    )
    .then(({ data }) => {
      console.log(data.doc)
      // setUserInfo()
    })
    .catch(error => {
      console.log('error', error)
    })
}

export const userOperations = {
  getUserInfo,
}
