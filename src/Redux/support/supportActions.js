import { createAction } from '@reduxjs/toolkit'

const getTickets = createAction('GET_TICKETS')
const clearTickets = createAction('CLEAR_TICKETS')

const getTicketCount = createAction('GET_TICKETS_COUNT')
const clearTicketCount = createAction('CLEAR_TICKETS_COUNT')

export default {
  getTickets,
  clearTickets,
  getTicketCount,
  clearTicketCount,
}
