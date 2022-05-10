import qs from 'qs'
import i18n from 'i18next'

import userActions from './userActions'
import { axiosInstance } from './../../config/axiosInstance'

const userInfo = (data, dispatch) => {
  console.log('curr userInfo ajax')
  const { $realname, $balance, $email, $phone, $id } = data.doc.user
  dispatch(userActions.setUserInfo({ $realname, $balance, $email, $phone, $id }))
}

const userTickets = (data, dispatch) => {
  console.log('curr tickets ajax')
  const { elem } = data.doc
  dispatch(userActions.setTickets(elem))
}

const userNotifications = (data, dispatch) => {
  console.log('curr notifications ajax')

  const { bitem } = data.doc.notify.item[0]
  dispatch(userActions.setItems({ bitem }))
}

const currentSessionRights = (data, dispatch) => {
  console.log('curr rights ajax')
  const { node } = data.doc.mainmenu

  dispatch(userActions.setCurrentSessionRihgts(node))
}

const funcsArray = [userInfo, userNotifications, currentSessionRights, userTickets]

const getUserInfo = (sessionId, setIsLoading) => dispatch => {
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
        console.log(data)
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        console.log(i)
        funcsArray[i](data, dispatch)
      })
      dispatch(userActions.hideUserInfoLoading())
      console.log('before handle loader')
      setIsLoading(false)
    })
    .catch(err => {
      dispatch(userActions.hideUserInfoLoading())
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
      if (data.doc.error) throw new Error(data.doc.error.msg.$)
    })
    .catch(error => {
      console.log('error', error)
    })
}

export default {
  getUserInfo,
  removeItems,
}
