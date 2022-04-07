import qs from 'qs'
import i18n from 'i18next'

import { userActions } from './userActions'
import { axiosInstance } from './../../config/axiosInstance'

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
  // console.log(i18n)
  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'notify',
        out: 'json',
        lang: i18n.language,
        auth: sessionId,
      }),
    )
    .then(({ data }) => {
      const { bitem } = data.doc.notify.item[0]
      dispatch(userActions.setItems({ bitem }))

      // console.log(data)
      // console.log(bitem)

      if (!bitem) throw new Error('Notifications info is not found')
    })
    .catch(error => {
      console.log('error', error)
    })
}

const removeItems = (sessionId, id) => {
  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'notificationbar.delete',
        out: 'json',
        lang: i18n.language,
        auth: sessionId,
        elid: id,
      }),
    )
    .then(({ data }) => {
      if (!data) throw new Error('Notifications info is not found')
    })
    .catch(error => {
      console.log('error', error)
    })
}

export const userOperations = {
  getUserInfo,
  getTickets,
  getItems,
  removeItems,
}
