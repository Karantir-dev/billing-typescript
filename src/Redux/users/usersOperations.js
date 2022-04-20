import qs from 'qs'
import { actions } from '../actions'

import { axiosInstance } from './../../config/axiosInstance'
import { usersActions } from './usersActions'

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
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
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
      console.log(data)
      updateStatusFunc()
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      dispatch(actions.hideLoader())
    })
}

const createNewUser =
  (password, email, phone, realname, updateListFunc) => (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    console.log('create user')

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
        console.log(data)
        if (data.doc.error) throw new Error(data.doc.error.msg.$)
        console.log('user created', data)
        updateListFunc()
        dispatch(actions.hideLoader())
      })
      .catch(error => {
        console.log('error', error)
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
      console.log('user removed', data)
      updateUsersListFunc()
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      dispatch(actions.hideLoader())
    })
}

const getRights = userId => (dispatch, getState) => {
  dispatch(actions.showLoader())

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
        // sok: 'ok',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)
      console.log('get rights', data)

      const { elem } = data.doc

      dispatch(usersActions.setRights(elem))
    })
    .catch(error => {
      console.log('error', error)
      dispatch(actions.hideLoader())
    })
}

const getSubRights = (userId, name, sessionId) => {
  console.log('user id - ', userId)
  console.log('name - ', name)
  console.log('sessionId - ', sessionId)

  return axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'rights2.user',
        out: 'json',
        auth: sessionId,
        elid: name,
        plid: userId,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)
      console.log('get rights sublist', data)

      // dispatch(actions.hideLoader())
      return data
    })
    .catch(error => {
      console.log('error', error)
      // dispatch(actions.hideLoader())
    })
}

const manageUserRight = (userId, funcName, sessionId, act, type) => {
  return axiosInstance
    .post(
      '/',
      qs.stringify({
        func: `rights2.user.${act}`,
        out: 'json',
        auth: sessionId,
        elid: funcName,
        plid: `${userId}/${type}`,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)
      console.log('managed users right from ajax', data)

      // dispatch(actions.hideLoader())
      return data
    })
    .catch(error => {
      console.log('error', error)
      // dispatch(actions.hideLoader())
    })
}

export const usersOperations = {
  getUsers,
  changeUserRights,
  changeUserStatus,
  createNewUser,
  removeUser,
  getRights,
  getSubRights,
  manageUserRight,
}
