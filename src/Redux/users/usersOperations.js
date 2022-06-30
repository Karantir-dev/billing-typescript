import qs from 'qs'
import { toast } from 'react-toastify'
import { actions } from '../'
import i18n from '../../i18n'
import { errorHandler } from '../../utils'

import { axiosInstance } from './../../config/axiosInstance'
import usersActions from './usersActions'

const getUsers = () => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'user',
        out: 'json',
        auth: sessionId,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)
      const { elem } = data.doc

      dispatch(usersActions.setUsers(elem))
      // dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      errorHandler(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const changeUserRights = (id, switchAccess, updateAccessFunc) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'user.edit',
        out: 'json',
        auth: sessionId,
        elid: id,
        default_access_allow: switchAccess,
        sok: 'ok',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      updateAccessFunc()
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      errorHandler(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const changeUserStatus = (id, changeStatus, updateStatusFunc) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: `user.${changeStatus}`,
        out: 'json',
        auth: sessionId,
        elid: id,
        sok: 'ok',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)
      // console.log(data)
      updateStatusFunc()
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      errorHandler(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const createNewUser =
  (password, email, phone, realname, updateListFunc) => (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'user.edit',
          out: 'json',
          auth: sessionId,
          passwd: password,
          email,
          phone,
          realname,
          sok: 'ok',
        }),
      )
      .then(({ data }) => {
        console.log('user created', data)
        if (data.doc.error) throw new Error(data.doc.error.msg.$)
        updateListFunc()
        dispatch(actions.hideLoader())
      })
      .catch(error => {
        console.log('error', error)
        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const editUserInfo =
  (passwd, email, phone, realname, elid, controlForm) => (dispatch, getState) => {
    dispatch(actions.showLoader())
    console.log(passwd, 'passwd')
    console.log(passwd, email, phone, realname, elid)

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'user.edit',
          out: 'json',
          auth: sessionId,
          elid,
          passwd,
          confirm: passwd,
          email,
          phone,
          realname,
          sok: 'ok',
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        toast.success(i18n.t('Changes saved successfully', { ns: 'other' }), {
          position: 'bottom-right',
          toastId: 'customId',
        })
        dispatch(actions.hideLoader())
        controlForm()
      })
      .catch(error => {
        console.log('error', error)
        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const removeUser = (userId, updateUsersListFunc) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'user.delete',
        out: 'json',
        auth: sessionId,
        elid: userId,
        sok: 'ok',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)
      // console.log('user removed', data)
      updateUsersListFunc()
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      errorHandler(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getRights = (userId, isOwner, setRightsForRender) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  console.log(isOwner)
  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'rights2.user',
        out: 'json',
        auth: sessionId,
        elid: userId,
        lang: 'en',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      const { elem } = data.doc
      const { metadata } = data.doc

      setRightsForRender && setRightsForRender(metadata)
      dispatch(usersActions.setRights(elem))
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      errorHandler(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getSubRights =
  (userId, name, sessionId, setSubListOne, setSubListTwo) => dispatch => {
    dispatch(actions.showLoader())

    return axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'rights2.user',
          out: 'json',
          auth: sessionId,
          elid: name,
          plid: userId,
          lang: 'en',
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        const { elem } = data.doc
        setSubListOne(elem)
        setSubListTwo(elem)
        dispatch(actions.hideLoader())
      })
      .catch(error => {
        console.log('error', error)
        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const manageUserRight = (userId, funcName, sessionId, act, type) => dispatch => {
  // console.log('userid - ', userId)
  console.log('funcName - ', funcName)
  // console.log('sessionId - ', sessionId)
  // console.log('act - ', act)
  console.log('type - ', type)

  dispatch(actions.showLoader())

  return axiosInstance
    .post(
      '/',
      qs.stringify({
        func: `rights2.user.${act}`,
        out: 'json',
        auth: sessionId,
        elid: funcName,
        plid: `${userId}/${type}`,
        lang: 'en',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)
      console.log('managed users right from ajax', data)

      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      errorHandler(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getAvailableRights = (funcName, setRights) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: funcName,
        out: 'json',
        auth: sessionId,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      const { metadata } = data.doc

      setRights(metadata)
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      errorHandler(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

export default {
  getUsers,
  changeUserRights,
  changeUserStatus,
  createNewUser,
  editUserInfo,
  removeUser,
  getRights,
  getSubRights,
  manageUserRight,
  getAvailableRights,
  // currentSessionRights,
}
