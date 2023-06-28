import qs from 'qs'
import { toast } from 'react-toastify'
import { t } from 'i18next'
import { userActions, cartOperations, actions } from '@redux'
import { axiosInstance } from '@config/axiosInstance'
import { checkIfTokenAlive } from '@utils'

const userInfo = (data, dispatch) => {
  const {
    $realname,
    $balance,
    $email,
    $phone,
    $id,
    $email_verified,
    $need_phone_validate,
  } = data.doc.user
  dispatch(
    userActions.setUserInfo({
      $realname,
      $balance,
      $email,
      $phone,
      $id,
      $email_verified,
      $need_phone_validate,
    }),
  )
}

const userTickets = (data, dispatch) => {
  const { elem } = data.doc
  dispatch(userActions.setTickets(elem))
}

export const userNotifications = (data, dispatch) => {
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

const dashBoardInfo = (data, dispatch) => {
  const { elem } = data.doc
  if (elem && elem?.length > 0) {
    dispatch(userActions.updateUserInfo({ verefied_phone: elem[0]?.phone?.$ }))
  }
}

const funcsArray = [
  userInfo,
  userNotifications,
  currentSessionRights,
  userTickets,
  clearBasket,
  dashBoardInfo,
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
    axiosInstance.post(
      '/',
      qs.stringify({
        func: 'dashboard.info',
        out: 'json',
        lang: 'en',
        auth: sessionId,
      }),
    ),
  ])
    .then(responses => {
      responses.forEach(({ data }, i) => {
        if (data.doc.error) {
          checkIfTokenAlive(data.doc.error.msg.$, dispatch)
        }

        funcsArray[i](data, dispatch)
      })
      dispatch(userActions.hideUserInfoLoading())

      setLoading && setLoading(false)
    })
    .catch(err => {
      dispatch(userActions.hideUserInfoLoading())
      setLoading && setLoading(false)

      checkIfTokenAlive(err.message, dispatch)
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
      checkIfTokenAlive(error.message, dispatch)
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
      checkIfTokenAlive(error.message, dispatch)
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
      checkIfTokenAlive(error.message, dispatch)
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
      checkIfTokenAlive(error.message, dispatch)
    })
}

const sendVerificationEmail = email => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'user.verifyemail.send',
        out: 'json',
        sok: 'ok',
        lang: 'en',
        auth: sessionId,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      toast.success(t('email_sended', { email: email }), {
        position: 'bottom-right',
      })
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
    })
    .finally(() => dispatch(actions.hideLoader()))
}

const verifyMainEmail = (key, username) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'user.verifyemail.verify',
        out: 'json',
        lang: 'en',
        key,
        username,
        auth: sessionId,
      }),
    )
    .then(({ data }) => {
      if (data?.doc?.error) throw new Error(data.doc.error.msg.$)

      toast.success(t('email_confirmed', { email: username }), {
        position: 'bottom-right',
      })
      dispatch(userActions.setEmailStatus('on'))
    })
    .catch(error => {
      toast.error(t('unknown_error'), {
        position: 'bottom-right',
      })
      checkIfTokenAlive(error.message, dispatch)
    })
    .finally(() => dispatch(actions.hideLoader()))
}

const cleanBsketHandler = func => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'basket',
        out: 'json',
        lang: 'en',
        auth: sessionId,
      }),
    )
    .then(({ data }) => {
      if (data?.doc?.error) throw new Error(data.doc.error.msg.$)
      const { billorder } = data.doc
      if (billorder) {
        dispatch(cartOperations.clearBasket(billorder?.$))
      }
    })
    .then(() => func && func())
    .catch(error => {
      dispatch(actions.hideLoader())
      toast.error(t('unknown_error'), {
        position: 'bottom-right',
      })
      checkIfTokenAlive(error.message, dispatch)
    })
}

export default {
  getUserInfo,
  removeItems,
  getDashboardTickets,
  getNotify,
  getTickets,
  sendVerificationEmail,
  verifyMainEmail,
  cleanBsketHandler,
}
