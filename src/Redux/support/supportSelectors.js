const getTicketList = state => state.support.ticketList
const getTicketCount = state => state.support.ticketCount

const getTicketArchiveList = state => state.support.ticketArchiveList
const getTicketArchiveCount = state => state.support.ticketArchiveCount

const getTicket = state => state.support.ticket

export default {
  getTicketList,
  getTicketCount,
  getTicketArchiveCount,
  getTicketArchiveList,
  getTicket,
}
