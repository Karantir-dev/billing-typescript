import { createAction } from '@reduxjs/toolkit'

const getTickets = createAction('GET_TICKETS')
const updateTickets = createAction('UPDATE_TICKETS')
const clearTickets = createAction('CLEAR_TICKETS')

const getTicketsArchive = createAction('GET_TICKETS_ARCHIVE')
const getTicketArchiveCount = createAction('GET_TICKETS_ARCHIVE_COUNT')

const getTicket = createAction('GET_TICKET')
const clearTicket = createAction('CLEAR_TICKET')

const getTicketCount = createAction('GET_TICKETS_COUNT')
const clearTicketCount = createAction('CLEAR_TICKETS_COUNT')

export default {
  getTickets,
  clearTickets,
  updateTickets,
  getTicketCount,
  clearTicketCount,
  getTicketsArchive,
  getTicketArchiveCount,
  getTicket,
  clearTicket,
}
