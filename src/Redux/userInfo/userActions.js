import { createAction } from '@reduxjs/toolkit'

const setUserInfo = createAction('SET_USER_INFO')
const setTickets = createAction('SET_TICKETS')
const setItems = createAction('SET_ITEMS')

export const userActions = {
  setItems,
  setTickets,
  setUserInfo,
}
