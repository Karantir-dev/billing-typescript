import qs from 'qs'
import { userActions } from './userActions'
import { axiosInstance } from '../auth/authOperations'

const getUserInfo = sessionId => dispatch => {
  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'whoami',
        out: 'json',
        auth: sessionId,
      }),
    )
    .then(({ data }) => {
      const { $realname, $balance, $email, $phone } = data.doc.user
      dispatch(userActions.setUserInfo({ $realname, $balance, $email, $phone }))
      if (!data.doc.user) throw new Error('User info has not found')
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
        auth: sessionId,
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
  const lang = localStorage.getItem('i18nextLng')

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'notify',
        out: 'json',
        lang: lang,
        auth: sessionId,
      }),
    )
    .then(({ data }) => {
      const { bitem } = data.doc.notify.item[0]
      dispatch(userActions.setItems({ bitem }))

      console.log(data)
      console.log(bitem)

      if (!bitem) throw new Error('Notifications info is not found')
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
