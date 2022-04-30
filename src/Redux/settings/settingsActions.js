import { createAction } from '@reduxjs/toolkit'

const setUsersEdit = createAction('SET_USER_EDIT')
const setUsersParams = createAction('SET_USER_PARAMS')

const setUpdateTime = createAction('SET_UPDATE_TIME')
const setUpdateAvatar = createAction('SET_UPDATE_TIME')

export default {
  setUsersEdit,
  setUsersParams,
  setUpdateTime,
  setUpdateAvatar,
}
