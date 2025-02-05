import qs from 'qs'
import { toast } from 'react-toastify'
import { t } from 'i18next'
import { userActions, cartOperations, actions } from '@redux'
import { axiosInstance } from '@config/axiosInstance'
import { checkIfTokenAlive, handleLoadersClosing } from '@utils'

const userInfo = (data, dispatch) => {
  try {
    const { $realname, $email, $phone, $id, $email_verified, $need_phone_validate } =
      data.doc.user
    dispatch(
      userActions.setUserInfo({
        $realname,
        $email,
        $phone,
        $id,
        $email_verified,
        $need_phone_validate,
      }),
    )
  } catch (error) {
    console.log(error.message)
  }
}

const userTickets = (data, dispatch) => {
  const { elem } = data.doc
  dispatch(userActions.setTickets(elem))
}

export const userNotifications = (data, dispatch, setIsLoader) => {
  const d = {}
  const messagesIds = []

  if (Array.isArray(data?.doc?.notify?.item)) {
    data?.doc?.notify?.item.forEach(el => {
      if (el?.$name === 'bannerlist') {
        d['messages'] = Array.isArray(el?.bitem) ? el?.bitem : [el?.bitem]
        d['messages_count'] = el?.msg?.$
      }
      if (el?.$name === 'ticket') {
        d['ticket_count'] = el?.msg?.$
      }
    })
  }

  if (d?.messages) {
    d?.messages?.forEach(e => messagesIds?.push(e?.$id))
  }

  setIsLoader &&
    setIsLoader(loaders => {
      const newArr = []
      loaders?.forEach(l => {
        if (messagesIds.indexOf(l) != -1) {
          newArr?.push(l)
        }
      })

      return newArr
    })

  dispatch(userActions.updateUserInfo({ realbalance: data.doc?.realbalance?.$ || '' }))
  dispatch(userActions.setItems(d))
}

const currentSessionRights = (data, dispatch) => {
  const { node } = data.doc.mainmenu
  dispatch(userActions.setCurrentSessionRihgts(node))
}

const clearBasket = (data, dispatch) => {
  const { billorder } = data.doc
  if (billorder && !data.disableClearBasket) {
    dispatch(cartOperations.clearBasket(billorder?.$))
  }
}

const dashBoardInfo = (data, dispatch) => {
  const { elem } = data.doc
  if (elem && elem?.length > 0) {
    dispatch(
      userActions.updateUserInfo({
        verefied_phone: elem[0]?.phone?.$,
        realbalance: elem[0]?.realbalance?.$.replace(' €', '')?.replace(' EUR', ''),
      }),
    )
  }
}

const getAvailableCredit = (data, dispatch) => {
  const { elem } = data.doc
  if (elem && elem?.length > 0) {
    dispatch(
      userActions.setAvailableCredit({
        available_credit: elem[0]?.available_credit?.$,
        credit: elem[0]?.credit?.$,
      }),
    )
  }
}

const getActiveServices = (data, dispatch) => {
  const { elem } = data.doc
  dispatch(userActions.setUserActiveServices(elem))
}

const funcsArray = [
  userInfo,
  (...args) => {
    userNotifications(...args)
    getActiveServices(...args)
  },
  currentSessionRights,
  userTickets,
  clearBasket,
  dashBoardInfo,
  getAvailableCredit,
]

const getUserInfo = (sessionId, setLoading, disableClearBasket) => dispatch => {
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
        notifiaction: 'count',
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
    axiosInstance.post(
      '/',
      qs.stringify({
        func: 'dashboard.subaccount_credit',
        out: 'json',
        lang: 'en',
        auth: sessionId,
      }),
    ),
  ])
    .then(responses => {
      let error = ''
      responses.forEach(({ data }, i) => {
        if (data.doc.error) {
          error = data.doc.error.msg.$
          return
        }

        funcsArray[i]({ ...data, disableClearBasket }, dispatch)
      })

      if (error) throw new Error(error)

      dispatch(userActions.hideUserInfoLoading())
      setLoading && setLoading(false)
    })
    .catch(err => {
      dispatch(userActions.hideUserInfoLoading())
      setLoading && setLoading(false)

      checkIfTokenAlive(err.message, dispatch)
    })
}

const removeItems = (sessionId, id, updateNotify) => dispatch => {
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

      updateNotify && updateNotify()
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

const getNotify = setIsLoader => (dispatch, getState) => {
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

      userNotifications(data, dispatch, setIsLoader)
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
    })
}

// const getDashboardInfo = () => (dispatch, getState) => {
//   const {
//     auth: { sessionId },
//   } = getState()

//   axiosInstance
//     .post(
//       '/',
//       qs.stringify({
//         func: 'dashboard.info',
//         out: 'json',
//         lang: 'en',
//         auth: sessionId,
//       }),
//     )
//     .then(({ data }) => {
//       if (data.doc.error) throw new Error(data.doc.error.msg.$)

//       dashBoardInfo(data, dispatch)
//     })
//     .catch(error => {
//       checkIfTokenAlive(error.message, dispatch)
//     })
// }

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

const cleanBsketHandler = (func, signal, setIsLoading) => (dispatch, getState) => {
  setIsLoading ? setIsLoading(true) : dispatch(actions.showLoader())

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
      { signal },
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
      handleLoadersClosing(error?.message, dispatch, setIsLoading)

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
  getActiveServices,
  // getDashboardInfo,
}
