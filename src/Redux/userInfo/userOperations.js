import qs from 'qs'
import i18n from 'i18next'

import userActions from './userActions'
import { axiosInstance } from './../../config/axiosInstance'
import { errorHandler } from '../../utils'

const userInfo = (data, dispatch) => {
  const { $realname, $balance, $email, $phone, $id } = data.doc.user
  dispatch(userActions.setUserInfo({ $realname, $balance, $email, $phone, $id }))
}

const userTickets = (data, dispatch) => {
  const { elem } = data.doc
  dispatch(userActions.setTickets(elem))
}

const userNotifications = (data, dispatch) => {
  const { bitem } = data.doc.notify.item[0]
  dispatch(userActions.setItems({ bitem }))
}

const currentSessionRights = (data, dispatch) => {
  const { node } = data.doc.mainmenu
  dispatch(userActions.setCurrentSessionRihgts(node))
}

const funcsArray = [userInfo, userNotifications, currentSessionRights, userTickets]

const getUserInfo = (sessionId, setLoading) => dispatch => {
  dispatch(userActions.showUserInfoLoading())
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
        func: 'notify',
        out: 'json',
        lang: i18n.language,
        auth: sessionId,
      }),
    ),
    axiosInstance.post(
      '/',
      qs.stringify({
        func: 'menu',
        out: 'json',
        auth: sessionId,
        sok: 'ok',
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
  ])
    .then(responses => {
      responses.forEach(({ data }, i) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        funcsArray[i](data, dispatch)
      })
      dispatch(userActions.hideUserInfoLoading())
      setLoading && setLoading(false)
    })
    .catch(err => {
      dispatch(userActions.hideUserInfoLoading())
      setLoading && setLoading(false)
      console.log('getUserInfo - ', err.message)
      errorHandler(err.message, dispatch)
    })
}

const removeItems = (sessionId, id) => dispatch => {
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
      if (data.doc.error) throw new Error(data.doc.error.msg.$)
    })
    .catch(error => {
      console.log('error', error)
      errorHandler(error.message, dispatch)
    })
}

export default {
  getUserInfo,
  removeItems,
}
