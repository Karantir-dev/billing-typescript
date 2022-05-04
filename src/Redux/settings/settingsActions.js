import { createAction } from '@reduxjs/toolkit'

const setUsersEdit = createAction('SET_USER_EDIT')
const setUsersParams = createAction('SET_USER_PARAMS')

const setUpdateTime = createAction('SET_UPDATE_TIME')
const setUpdateAvatar = createAction('SET_UPDATE_AVATAR')
const emailStatusUpadate = createAction('SET_EMAIL_STATUS_UPDATE')

export default {
  setUsersEdit,
  setUsersParams,
  setUpdateTime,
  setUpdateAvatar,
  emailStatusUpadate,
}
