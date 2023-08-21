const getTicketList = state => state.support.ticketList
const getTicketCount = state => state.support.ticketCount

const getTicketArchiveList = state => state.support.ticketArchiveList
const getTicketArchiveCount = state => state.support.ticketArchiveCount

const getTicket = state => state.support.ticket

const getDepartments = state => state.support.departmentsList
const getServices = state => state.support.serviceList

const getAbuseFilterList = state => state.support.abuseFilterList
const getTstatusFilterList = state => state.support.tstatusFilterList
const getTimeFilterList = state => state.support.timeFilterList

const getCurrentFilters = state => state.support.currentFilters

const getIsLoadingRequest = state => state.support.isLoadingSupportRequest
const getIsLoadingRequestArchive = state => state.support.isLoadingSupportRequestArchive

export default {
  getTicketList,
  getTicketCount,
  getTicketArchiveCount,
  getTicketArchiveList,
  getTicket,
  getDepartments,
  getServices,
  getAbuseFilterList,
  getTstatusFilterList,
  getTimeFilterList,
  getCurrentFilters,
  getIsLoadingRequest,
  getIsLoadingRequestArchive,
}
