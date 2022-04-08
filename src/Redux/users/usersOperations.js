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

export const usersOperations = {
  getUsers,
}
