import qs from 'qs'
import { userActions } from './userActions'
import { axiosInstance } from './../../config/axiosInstance'

const getUserInfo = sessionId => dispatch => {
  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'whoami',
        out: 'json',
        auth: `${sessionId}`,
      }),
    )
    .then(({ data }) => {
      const { $realname, $balance, $email, $phone } = data.doc.user
      dispatch(userActions.setUserInfo({ $realname, $balance, $email, $phone }))
    })
    .catch(error => {
      console.log('error', error)
    })
}

const getTickets = sessionId => dispatch => {
  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'dashboard.tickets',
        out: 'json',
        lang: 'en',
        auth: `${sessionId}`,
      }),
    )
    .then(({ data }) => {
      const { elem } = data.doc
      dispatch(userActions.setTickets(elem))
    })
    .catch(error => {
      console.log('error', error)
    })
}

const getItems = sessionId => dispatch => {
  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'notify',
        out: 'json',
        lang: 'en',
        auth: `${sessionId}`,
      }),
    )
    .then(({ data }) => {
      const { bitem, msg } = data.doc.notify.item[0]
      dispatch(userActions.setItems({ bitem, msg }))
    })
    .catch(error => {
      console.log('error', error)
    })
}

export const userOperations = {
  getUserInfo,
  getTickets,
  getItems,
}
