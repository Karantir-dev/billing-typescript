import { createAction } from '@reduxjs/toolkit'

const setUsersEdit = createAction('SET_USER_EDIT')
const setUsersParams = createAction('SET_USER_PARAMS')

const setUpdateTime = createAction('SET_UPDATE_TIME')
const setUpdateAvatar = createAction('SET_UPDATE_AVATAR')
const emailStatusUpadate = createAction('SET_EMAIL_STATUS_UPDATE')

const setTwoStepVerif = createAction('SET_TWO_STEP_VERIF')
const updateTwoStepVerif = createAction('UPDATE_TWO_STEP_VERIF')
const clearTwoStepVerif = createAction('CLEAR_TWO_STEP_VERIF')

export default {
  setUsersEdit,
  setUsersParams,
  setUpdateTime,
  setUpdateAvatar,
  emailStatusUpadate,
  setTwoStepVerif,
  clearTwoStepVerif,
  updateTwoStepVerif,
}
