// import { supportReducer, supportActions } from '../../Redux'

describe('support reducers', () => {
  test('GET TICKET LIST', () => {
    // const initialState = {}
    // const action = supportActions.getTickets([{ id: '1', label: 'test' }])
    // const newState = supportReducer(initialState, action)
    // expect(newState).toEqual({
    //   ticketList: [{ id: '1', label: 'test' }],
    //   ticketArchiveList: [],
    //   ticketCount: 0,
    //   ticketArchiveCount: 0,
    //   ticket: null,
    //   departmentsList: [],
    //   serviceList: [],

    //   abuseFilterList: [],
    //   tstatusFilterList: [],
    //   timeFilterList: [],

    //   currentFilters: null,
    // })
  })

  test('UPDATE TICKET LIST', () => {
    // const initialState = {}
    // const action = supportActions.updateTickets('1')
    // const newState = supportReducer(initialState, action)
    // expect(newState).toEqual({
    //   ticketList: [],
    //   ticketArchiveList: [],
    //   ticketCount: 0,
    //   ticketArchiveCount: 0,
    //   ticket: null,
    //   departmentsList: [],
    //   serviceList: [],

    //   abuseFilterList: [],
    //   tstatusFilterList: [],
    //   timeFilterList: [],

    //   currentFilters: null,
    // })
  })

  test('CLEAR TICKET LIST', () => {
    // const initialState = {}
    // const action = supportActions.clearTickets()
    // const newState = supportReducer(initialState, action)
    // expect(newState).toEqual({
    //   ticketList: [],
    //   ticketArchiveList: [],
    //   ticketCount: 0,
    //   ticketArchiveCount: 0,
    //   ticket: null,
    //   departmentsList: [],
    //   serviceList: [],

    //   abuseFilterList: [],
    //   tstatusFilterList: [],
    //   timeFilterList: [],

    //   currentFilters: null,
    // })
  })

  test('GET TICKET ARCHIVE LIST', () => {
    // const initialState = {}
    // const action = supportActions.getTicketsArchive([{ id: '1', label: 'test' }])
    // const newState = supportReducer(initialState, action)
    // expect(newState).toEqual({
    //   ticketList: [],
    //   ticketArchiveList: [{ id: '1', label: 'test' }],
    //   ticketCount: 0,
    //   ticketArchiveCount: 0,
    //   ticket: null,
    //   departmentsList: [],
    //   serviceList: [],

    //   abuseFilterList: [],
    //   tstatusFilterList: [],
    //   timeFilterList: [],

    //   currentFilters: null,
    // })
  })

  test('GET TICKET ARCHIVE COUNT', () => {
    // const initialState = {}
    // const action = supportActions.getTicketArchiveCount(1)
    // const newState = supportReducer(initialState, action)
    // expect(newState).toEqual({
    //   ticketList: [],
    //   ticketArchiveList: [],
    //   ticketCount: 0,
    //   ticketArchiveCount: 1,
    //   ticket: null,
    //   departmentsList: [],
    //   serviceList: [],

    //   abuseFilterList: [],
    //   tstatusFilterList: [],
    //   timeFilterList: [],

    //   currentFilters: null,
    // })
  })

  test('GET TICKET', () => {
    // const initialState = {}
    // const action = supportActions.getTicket({ id: '1' })
    // const newState = supportReducer(initialState, action)
    // expect(newState).toEqual({
    //   ticketList: [],
    //   ticketArchiveList: [],
    //   ticketCount: 0,
    //   ticketArchiveCount: 0,
    //   ticket: { id: '1' },
    //   departmentsList: [],
    //   serviceList: [],

    //   abuseFilterList: [],
    //   tstatusFilterList: [],
    //   timeFilterList: [],

    //   currentFilters: null,
    // })
  })

  test('CLEAR TICKET', () => {
    // const initialState = {}
    // const action = supportActions.clearTicket()
    // const newState = supportReducer(initialState, action)
    // expect(newState).toEqual({
    //   ticketList: [],
    //   ticketArchiveList: [],
    //   ticketCount: 0,
    //   ticketArchiveCount: 0,
    //   ticket: null,
    //   departmentsList: [],
    //   serviceList: [],

    //   abuseFilterList: [],
    //   tstatusFilterList: [],
    //   timeFilterList: [],

    //   currentFilters: null,
    // })
  })

  test('GET DEPARTMENT', () => {
    // const initialState = {}
    // const action = supportActions.getDepartments([{ value: '1', label: 'test' }])
    // const newState = supportReducer(initialState, action)
    // expect(newState).toEqual({
    //   ticketList: [],
    //   ticketArchiveList: [],
    //   ticketCount: 0,
    //   ticketArchiveCount: 0,
    //   ticket: null,
    //   departmentsList: [{ value: '1', label: 'test' }],
    //   serviceList: [],

    //   abuseFilterList: [],
    //   tstatusFilterList: [],
    //   timeFilterList: [],

    //   currentFilters: null,
    // })
  })

  test('GET SERVICES', () => {
    // const initialState = {}
    // const action = supportActions.getServices([{ value: '1', label: 'test' }])
    // const newState = supportReducer(initialState, action)
    // expect(newState).toEqual({
    //   ticketList: [],
    //   ticketArchiveList: [],
    //   ticketCount: 0,
    //   ticketArchiveCount: 0,
    //   ticket: null,
    //   departmentsList: [],
    //   serviceList: [{ value: '1', label: 'test' }],

    //   abuseFilterList: [],
    //   tstatusFilterList: [],
    //   timeFilterList: [],

    //   currentFilters: null,
    // })
  })

  test('GET TICKET COUNT', () => {
    // const initialState = {}
    // const action = supportActions.getTicketCount(1)
    // const newState = supportReducer(initialState, action)
    // expect(newState).toEqual({
    //   ticketList: [],
    //   ticketArchiveList: [],
    //   ticketCount: 1,
    //   ticketArchiveCount: 0,
    //   ticket: null,
    //   departmentsList: [],
    //   serviceList: [],

    //   abuseFilterList: [],
    //   tstatusFilterList: [],
    //   timeFilterList: [],

    //   currentFilters: null,
    // })
  })

  test('CLEAR TICKET COUNT', () => {
    // const initialState = {}
    // const action = supportActions.clearTicketCount()
    // const newState = supportReducer(initialState, action)
    // expect(newState).toEqual({
    //   ticketList: [],
    //   ticketArchiveList: [],
    //   ticketCount: 0,
    //   ticketArchiveCount: 0,
    //   ticket: null,
    //   departmentsList: [],
    //   serviceList: [],

    //   abuseFilterList: [],
    //   tstatusFilterList: [],
    //   timeFilterList: [],

    //   currentFilters: null,
    // })
  })

  test('GET ABUSE FILTER LIST', () => {
    // const initialState = {}
    // const action = supportActions.getAbuseFilterList([{ value: '1', label: 'test' }])
    // const newState = supportReducer(initialState, action)
    // expect(newState).toEqual({
    //   ticketList: [],
    //   ticketArchiveList: [],
    //   ticketCount: 0,
    //   ticketArchiveCount: 0,
    //   ticket: null,
    //   departmentsList: [],
    //   serviceList: [],

    //   abuseFilterList: [{ value: '1', label: 'test' }],
    //   tstatusFilterList: [],
    //   timeFilterList: [],

    //   currentFilters: null,
    // })
  })

  test('GET STATUS FILTER LIST', () => {
    // const initialState = {}
    // const action = supportActions.getTstatusFilterList([{ value: '1', label: 'test' }])
    // const newState = supportReducer(initialState, action)
    // expect(newState).toEqual({
    //   ticketList: [],
    //   ticketArchiveList: [],
    //   ticketCount: 0,
    //   ticketArchiveCount: 0,
    //   ticket: null,
    //   departmentsList: [],
    //   serviceList: [],

    //   abuseFilterList: [],
    //   tstatusFilterList: [{ value: '1', label: 'test' }],
    //   timeFilterList: [],

    //   currentFilters: null,
    // })
  })

  test('GET TIME FILTER LIST', () => {
    // const initialState = {}
    // const action = supportActions.getTimeFilterList([{ value: '1', label: 'test' }])
    // const newState = supportReducer(initialState, action)
    // expect(newState).toEqual({
    //   ticketList: [],
    //   ticketArchiveList: [],
    //   ticketCount: 0,
    //   ticketArchiveCount: 0,
    //   ticket: null,
    //   departmentsList: [],
    //   serviceList: [],

    //   abuseFilterList: [],
    //   tstatusFilterList: [],
    //   timeFilterList: [{ value: '1', label: 'test' }],

    //   currentFilters: null,
    // })
  })

  test('GET CURRENT FILTER', () => {
    // const initialState = {}
    // const action = supportActions.getCurrentFilters({ value: '1', label: 'test' })
    // const newState = supportReducer(initialState, action)
    // expect(newState).toEqual({
    //   ticketList: [],
    //   ticketArchiveList: [],
    //   ticketCount: 0,
    //   ticketArchiveCount: 0,
    //   ticket: null,
    //   departmentsList: [],
    //   serviceList: [],

    //   abuseFilterList: [],
    //   tstatusFilterList: [],
    //   timeFilterList: [],

    //   currentFilters: { value: '1', label: 'test' },
    // })
  })
})
