import { createAction } from '@reduxjs/toolkit'

const getTickets = createAction('GET_TICKETS')
const clearTickets = createAction('CLEAR_TICKETS')

export default {
  getTickets,
  clearTickets,
}
