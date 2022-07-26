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
  const d = {}

  if (Array.isArray(data?.doc?.notify?.item)) {
    data?.doc?.notify?.item.forEach(el => {
      if (el?.$name === 'bannerlist') {
        d['messages'] = Array.isArray(el?.bitem) ? el?.bitem : [el?.bitem]
        d['messages_count'] = el?.msg?.$
      }
      if (el?.$name === 'ticket') {
        d['ticket_count'] = el?.msg?.$
      }
      if (el?.$balance === 'yes') {
        d['$balance'] = el?.value?.$
      }
    })
  }

  dispatch(userActions.setItems(d))
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
  setLoading && dispatch(userActions.showUserInfoLoading())

  Promise.all([
    axiosInstance.post(
      '/',
      qs.stringify({
        func: 'whoami',
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
        lang: 'en',
        auth: sessionId,
      }),
    ),
    axiosInstance.post(
      '/',
      qs.stringify({
        func: 'menu',
        out: 'json',
        lang: 'en',
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
      if (data.doc.error) throw new Error(data.doc.error.msg.$)
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

const getNotify = () => (dispatch, getState) => {
  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'notify',
        out: 'json',
        lang: 'en',
        auth: sessionId,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      userNotifications(data, dispatch)
    })
    .catch(error => {
      console.log('error', error)
      errorHandler(error.message, dispatch)
    })
}

const getTickets = () => (dispatch, getState) => {
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
      const { elem } = data.doc
      dispatch(userActions.setTickets(elem))
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
  getNotify,
  getTickets,
}
