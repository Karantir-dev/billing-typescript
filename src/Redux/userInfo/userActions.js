import { createAction } from '@reduxjs/toolkit'

const setUserInfo = createAction('SET_USER_INFO')
const updateUserInfo = createAction('UPDATE_USER_INFO')
const setTickets = createAction('SET_TICKETS')
const setItems = createAction('SET_ITEMS')
const removeItems = createAction('REMOVE_ITEMS')
const setUserActiveServices = createAction('SET_USER_ACTIVE_SERVICES')

const setCurrentSessionRihgts = createAction('SET_CURRENT_SESSION_RIGHTS')

const showUserInfoLoading = createAction('SHOW_USER_INFO_LOADING')
const hideUserInfoLoading = createAction('HIDE_USER_INFO_LOADING')

const setEmailStatus = createAction('SET_EMAIL_STATUS')
const setIsNewMessage = createAction('SET_IS_NEW_MESSAGE')

const setAvailableCredit = createAction('SET_AVAILABLE_CREDIT')

export default {
  setItems,
  setTickets,
  setUserInfo,
  setCurrentSessionRihgts,
  showUserInfoLoading,
  hideUserInfoLoading,
  removeItems,
  setEmailStatus,
  updateUserInfo,
  setIsNewMessage,
  setAvailableCredit,
  setUserActiveServices,
}
