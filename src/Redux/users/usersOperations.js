import qs from 'qs'
import { toast } from 'react-toastify'
import { actions } from '../'
import i18n from '../../i18n'
import { checkIfTokenAlive } from '../../utils'

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
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      checkIfTokenAlive(error.message, dispatch)
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
      checkIfTokenAlive(error.message, dispatch)
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
      checkIfTokenAlive(error.message, dispatch)
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
        if (data.doc.error) {
          const wrongEmail = data.doc.error.msg.$.split('\'').at(1)
          toast.error(
            ` ${wrongEmail} ${i18n.t('warnings.email_exist', {ns: 'auth'}).toLowerCase()}`,
            {
              position: 'bottom-right',
              toastId: 'customId',
            },)
          throw new Error(data.doc.error.msg.$)
        }
        updateListFunc()
        dispatch(actions.hideLoader())
      })
      .catch(error => {
        console.log('error', error)
        checkIfTokenAlive(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const editUserInfo =
  (passwd, email, phone, realname, elid, controlForm) => (dispatch, getState) => {
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
        checkIfTokenAlive(error.message, dispatch)
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
        lang: 'en',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)
      updateUsersListFunc()
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      if (
        error.message.trim() ===
        'Unable to delete item due to dependencies.  Delete the objects that depend on it and try again'
      ) {
        toast.error(
          i18n.t(
            'Unable to delete item due to dependencies.  Delete the objects that depend on it and try again',
            { ns: 'trusted_users' },
          ),
          {
            position: 'bottom-right',
            toastId: 'customId',
          },
        )
      }
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getRights = (userId, isOwner, setRightsForRender) => (dispatch, getState) => {
  !isOwner && dispatch(actions.showLoader())

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
      checkIfTokenAlive(error.message, dispatch)
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
        checkIfTokenAlive(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const manageUserRight = (userId, funcName, sessionId, act, type) => dispatch => {
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

      dispatch(getRights(userId))
      // dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      checkIfTokenAlive(error.message, dispatch)
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
      checkIfTokenAlive(error.message, dispatch)
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
