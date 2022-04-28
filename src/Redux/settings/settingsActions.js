import { createAction } from '@reduxjs/toolkit'

const setUsersEdit = createAction('SET_USER_EDIT')
const setUsersParams = createAction('SET_USER_PARAMS')

export default {
  setUsersEdit,
  setUsersParams
}
