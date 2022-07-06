import qs from 'qs'

import userActions from './userActions'
import { axiosInstance } from './../../config/axiosInstance'
import { errorHandler } from '../../utils'
import cartOperations from '../cart/cartOperations'

const userInfo = (data, dispatch) => {
  const { $realname, $balance, $email, $phone, $id } = data.doc.user
  dispatch(userActions.setUserInfo({ $realname, $balance, $email, $phone, $id }))
}

const userTickets = (data, dispatch) => {
  const { elem } = data.doc
  dispatch(userActions.setTickets(elem))
}

const userNotifications = (data, dispatch) => {
  const { elem } = data.doc
  let notifications
  if (Array.isArray(elem)) {
    notifications = elem
  } else if (!Array.isArray(elem) && elem) {
    notifications = [elem]
  } else {
    notifications = []
  }

  dispatch(userActions.setItems(notifications))
}

const currentSessionRights = (data, dispatch) => {
  const { node } = data.doc.mainmenu
  dispatch(userActions.setCurrentSessionRihgts(node))
}

const clearBasket = (data, dispatch) => {
  const { billorder } = data.doc
  if (billorder) {
    dispatch(cartOperations.clearBasket(billorder?.$))
  }
}

const funcsArray = [
  userInfo,
  userNotifications,
  currentSessionRights,
  userTickets,
  clearBasket,
]

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
        lang: 'en',
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
    axiosInstance.post(
      '/',
      qs.stringify({
        func: 'basket',
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
  console.log('remove notif')
  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'notificationbar.delete',
        out: 'json',
        lang: 'en',
        auth: sessionId,
        elid: id,
      }),
    )
    .then(({ data }) => {
      console.log('id deleted', id)
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      console.log(data)
    })
    .catch(error => {
      console.log('error', error)
      errorHandler(error.message, dispatch)
    })
}

const getDashboardTickets = () => (dispatch, getState) => {
  const {
    auth: { sessionId },
  } = getState()

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
      if (data.doc.error) throw new Error(data.doc.error.msg.$)
      userTickets(data, dispatch)
    })
    .catch(error => {
      console.log('error', error)
      errorHandler(error.message, dispatch)
    })
}

export default {
  getUserInfo,
  removeItems,
  getDashboardTickets,
}
