import qs from 'qs'
// import i18n from 'i18next'

import { axiosInstance } from './../../config/axiosInstance'
import { usersActions } from './usersActions'
// import { actions } from '../actions'

const getUsers = () => (dispatch, getState) => {
  const {
    auth: { sessionId },
  } = getState()
  console.log(sessionId)

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
      console.log(data)
      dispatch(usersActions.setUsers(elem))
    })
    .catch(error => {
      console.log('error', error)
    })
}

const changeUserRights = (id, switchAccess) => (dispatch, getState) => {
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
      console.log(data)
    })
    .catch(error => {
      console.log('error', error)
    })
}

const changeUserStatus = (id, changeStatus) => (dispatch, getState) => {
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
    })
    .catch(error => {
      console.log('error', error)
    })
}

export const usersOperations = {
  getUsers,
  changeUserRights,
  changeUserStatus,
}
