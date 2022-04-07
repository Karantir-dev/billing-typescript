import qs from 'qs'
import i18n from 'i18next'

import { userActions } from './userActions'
import { axiosInstance } from './../../config/axiosInstance'
import { actions } from '../actions'

const userInfo = (data, dispatch) => {
  if (!data.doc.user) throw new Error('User info has not found')
  const { $realname, $balance, $email, $phone } = data.doc.user
  dispatch(userActions.setUserInfo({ $realname, $balance, $email, $phone }))
}

const userTickets = (data, dispatch) => {
  const { elem } = data.doc
  dispatch(userActions.setTickets(elem))
}

const userNotifications = (data, dispatch) => {
  if (data.doc.error) throw new Error(data.doc.error.msg.$)

  const { bitem } = data.doc.notify.item[0]
  dispatch(userActions.setItems({ bitem }))
}

const funcsArray = [userInfo, userTickets, userNotifications]

const getUserInfo = sessionId => dispatch => {
  dispatch(actions.showLoader())
  Promise.all([
    axiosInstance.post(
      '/',
      qs.stringify({
        func: 'whoami',
        out: 'json',
        auth: sessionId,
      }),
    ),
    axiosInstance.post(
      '/',
      qs.stringify({
        func: 'dashboard.tickets',
        out: 'json',
        lang: 'en',
        auth: sessionId,
      }),
    ),
    axiosInstance.post(
      '/',
      qs.stringify({
        func: 'notify',
        out: 'json',
        lang: i18n.language,
        auth: sessionId,
      }),
    ),
  ])
    .then(responses => {
      responses.map(({ data }, i) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        funcsArray[i](data, dispatch)
        console.log(data)
        return
      })
      dispatch(actions.hideLoader())
    })
    .catch(err => {
      console.log('getUserInfo - ', err.message)
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
  removeItems,
}
