import { createAction } from '@reduxjs/toolkit'

const setUserInfo = createAction('SET_USER_INFO')
const setTickets = createAction('SET_TICKETS')
const setItems = createAction('SET_ITEMS')

const showUserInfoLoading = createAction('SHOW_USER_INFO_LOADING')
const hideUserInfoLoading = createAction('HIDE_USER_INFO_LOADING')

export default {
  setItems,
  setTickets,
  setUserInfo,
  showUserInfoLoading,
  hideUserInfoLoading,
}
