import qs from 'qs'
import supportActions from './supportActions'
import { axiosInstance } from '../../config/axiosInstance'
import { actions } from '../'
import logout from '../../utils/logout'

const getTicketsHandler =
  (body = {}) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())
    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'clientticket',
          sok: 'ok',
          out: 'json',
          auth: sessionId,
          p_cnt: 30,
          p_col: '+time',
          clickstat: 'yes',
          ...body,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) {
          throw new Error(data.doc.error.msg.$)
        }
        const elem = data?.doc?.elem || []
        dispatch(supportActions.getTickets(elem))
        const count = data?.doc?.p_elems?.$ || 0
        dispatch(supportActions.getTicketCount(count))
        dispatch(getTicketsFiltersSettingsHandler())
      })
      .catch(error => {
        console.log('support -', error.message)
        logout(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const getTicketByIdHandler = idTicket => (dispatch, getState) => {
  dispatch(actions.showLoader())
  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'clientticket.edit',
        out: 'json',
        auth: sessionId,
        clickstat: 'yes',
        elid: idTicket,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) {
        throw new Error(data.doc.error.msg.$)
      }
      dispatch(supportActions.getTicket(data.doc))
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('support -', error.message)
      logout(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const archiveTicketsHandler = idTicket => (dispatch, getState) => {
  dispatch(actions.showLoader())
  const {
    auth: { sessionId },
  } = getState()
  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'clientticket.archive',
        sok: 'ok',
        out: 'json',
        auth: sessionId,
        clickstat: 'yes',
        elid: idTicket,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) {
        throw new Error(data.doc.error.msg.$)
      }
      dispatch(supportActions.updateTickets(idTicket))
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('support archive -', error.message)
      logout(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getTicketsArchiveHandler =
  (body = {}) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())
    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'clientticket_archive',
          sok: 'ok',
          out: 'json',
          auth: sessionId,
          p_cnt: 30,
          p_col: '+time',
          clickstat: 'yes',
          ...body,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) {
          throw new Error(data.doc.error.msg.$)
        }
        const elem = data?.doc?.elem || []
        dispatch(supportActions.getTicketsArchive(elem))
        const count = data?.doc?.p_elems?.$ || 0
        dispatch(supportActions.getTicketArchiveCount(count))
        dispatch(getTicketsArchiveFiltersSettingsHandler())
      })
      .catch(error => {
        console.log('support -', error.message)
        logout(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const getFile = (name, elid) => (dispatch, getState) => {
  const {
    auth: { sessionId },
  } = getState()
  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'ticket.file',
        clickstat: 'yes',
        auth: sessionId,
        elid,
      }),
      { responseType: 'blob' },
    )
    .then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', name)
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
    })
}

const setRate = (type, elid, plid, setStatus) => (dispatch, getState) => {
  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: `ticket.message.rate.${type}`,
        out: 'json',
        auth: sessionId,
        elid,
        plid,
      }),
    )
    .then(({ data }) => {
      if (data?.doc?.error) {
        throw new Error(data.doc.error.msg.$)
      }
      setStatus(type)
    })
    .catch(error => {
      console.log('support rate-', error.message)
      logout(error.message, dispatch)
    })
}

const sendMessage = (elid, data) => (dispatch, getState) => {
  dispatch(actions.showLoader())
  const {
    auth: { sessionId },
  } = getState()

  var d = new FormData()
  d.append('func', 'clientticket.edit')
  d.append('out', 'json')
  d.append('sok', 'ok')
  d.append('auth', sessionId)
  d.append('message', data?.message)
  d.append('elid', elid)
  data?.files?.forEach((el, i) => {
    d.append(`file_${i + 1}`, el)
  })

  axiosInstance
    .post('/', d)
    .then(({ data }) => {
      if (data?.doc?.error) {
        throw new Error(data.doc.error.msg.$)
      }
      dispatch(getTicketByIdHandler(elid))
    })
    .catch(error => {
      dispatch(actions.hideLoader())
      console.log('support rate-', error.message)
      logout(error.message, dispatch)
    })
}

const getDepartmenList = () => (dispatch, getState) => {
  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'clientticket.edit',
        out: 'json',
        auth: sessionId,
      }),
    )
    .then(({ data }) => {
      if (data?.doc?.error) {
        throw new Error(data.doc.error.msg.$)
      }
      data?.doc?.slist?.forEach(el => {
        if (el?.$name === 'client_department') {
          dispatch(supportActions.getDepartments(el?.val))
        }
      })
    })
    .catch(error => {
      console.log('support rate-', error.message)
      logout(error.message, dispatch)
    })
}

const getServiceList = () => (dispatch, getState) => {
  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'clientticket.edit',
        out: 'json',
        auth: sessionId,
        sv_field: 'ticket_item',
        sv_autocomplete: 'yes',
      }),
    )
    .then(({ data }) => {
      if (data?.doc?.error) {
        throw new Error(data.doc.error.msg.$)
      }

      data?.doc?.slist?.forEach(el => {
        if (el?.$name === 'ticket_item') {
          let services = el?.val?.map(e => {
            return { label: e.$, value: e.$key }
          })
          dispatch(supportActions.getServices(services))
        }
      })
    })
    .catch(error => {
      console.log('support rate-', error.message)
      logout(error.message, dispatch)
    })
}

const createTicket = (data, setCreateTicketModal, resetForm) => (dispatch, getState) => {
  dispatch(actions.showLoader())
  const {
    auth: { sessionId },
  } = getState()

  var d = new FormData()
  d.append('func', 'clientticket.edit')
  d.append('out', 'json')
  d.append('sok', 'ok')
  d.append('auth', sessionId)
  d.append('message', data?.message)
  d.append('subject', data?.subject)
  d.append('ticket_item', data?.ticket_item)
  d.append('client_department', data?.client_department)
  data?.files?.forEach((el, i) => {
    d.append(`file_${i + 1}`, el)
  })

  axiosInstance
    .post('/', d)
    .then(({ data }) => {
      if (data?.doc?.error) {
        throw new Error(data.doc.error.msg.$)
      }
      dispatch(getTicketsHandler())
      resetForm()
      setCreateTicketModal(false)
    })
    .catch(error => {
      console.log('support rate-', error.message)
      dispatch(actions.hideLoader())
      logout(error.message, dispatch)
      setCreateTicketModal(false)
    })
}

const getTicketsFiltersSettingsHandler = () => (dispatch, getState) => {
  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'clientticket.filter',
        out: 'json',
        auth: sessionId,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) {
        throw new Error(data.doc.error.msg.$)
      }
      data?.doc?.slist?.map(el => {
        if (el?.$name === 'abuse') {
          const abuse = el?.val?.map(({ $key, $ }) => {
            return { label: $, value: $key }
          })
          dispatch(supportActions.getAbuseFilterList(abuse))
        } else if (el?.$name === 'tstatus') {
          const tstatus = el?.val?.map(({ $key, $ }) => {
            return { label: $, value: $key }
          })
          dispatch(supportActions.getTstatusFilterList(tstatus))
        } else if (el?.$name === 'message_post') {
          const message_post = el?.val?.map(({ $key, $ }) => {
            return { label: $, value: $key }
          })
          dispatch(supportActions.getTimeFilterList(message_post))
        }

        let statuses
        if (Array.isArray(data?.doc?.tstatus)) {
          let statusList = data?.doc?.tstatus?.map(el => `${el?.$}`)
          statuses = statusList.join(',')
        } else {
          statuses = data?.doc?.tstatus?.$
        }

        const currentFilter = {
          id: data?.doc?.id?.$ || '',
          message: data?.doc?.message?.$ || '',
          name: data?.doc?.name?.$ || '',
          abuse: data?.doc?.abuse?.$ || '',
          tstatus: statuses || '',
          message_post: data?.doc?.message_post?.$ || 'nodate',
          message_poststart: data?.doc?.message_poststart?.$ || '',
          message_postend: data?.doc?.message_postend?.$ || '',
        }
        dispatch(supportActions.getCurrentFilters(currentFilter))
      })

      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('support -', error.message)
      logout(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getTicketsFiltersHandler = data => (dispatch, getState) => {
  dispatch(actions.showLoader())
  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'clientticket.filter',
        out: 'json',
        auth: sessionId,
        sok: 'ok',
        ...data,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) {
        throw new Error(data.doc.error.msg.$)
      }

      let statuses
      if (Array.isArray(data?.doc?.tstatus)) {
        let statusList = data?.doc?.tstatus?.map(el => `${el?.$}`)
        statuses = statusList.join(',')
      } else {
        statuses = data?.doc?.tstatus?.$
      }

      const currentFilter = {
        id: data?.doc?.id?.$ || '',
        message: data?.doc?.message?.$ || '',
        name: data?.doc?.name?.$ || '',
        abuse: data?.doc?.abuse?.$ || '',
        tstatus: statuses || '',
        message_post: data?.doc?.message_post?.$ || 'nodate',
        message_poststart: data?.doc?.message_poststart?.$ || '',
        message_postend: data?.doc?.message_postend?.$ || '',
      }
      dispatch(supportActions.getCurrentFilters(currentFilter))

      dispatch(getTicketsHandler())
    })
    .catch(error => {
      console.log('support -', error.message)
      logout(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getTicketsArchiveFiltersSettingsHandler = () => (dispatch, getState) => {
  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'clientticket_archive.filter',
        out: 'json',
        auth: sessionId,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) {
        throw new Error(data.doc.error.msg.$)
      }
      data?.doc?.slist?.map(el => {
        if (el?.$name === 'abuse') {
          const abuse = el?.val?.map(({ $key, $ }) => {
            return { label: $, value: $key }
          })
          dispatch(supportActions.getAbuseFilterList(abuse))
        } else if (el?.$name === 'tstatus') {
          const tstatus = el?.val?.map(({ $key, $ }) => {
            return { label: $, value: $key }
          })
          dispatch(supportActions.getTstatusFilterList(tstatus))
        } else if (el?.$name === 'message_post') {
          const message_post = el?.val?.map(({ $key, $ }) => {
            return { label: $, value: $key }
          })
          dispatch(supportActions.getTimeFilterList(message_post))
        }

        let statuses
        if (Array.isArray(data?.doc?.tstatus)) {
          let statusList = data?.doc?.tstatus?.map(el => `${el?.$}`)
          statuses = statusList.join(',')
        } else {
          statuses = data?.doc?.tstatus?.$
        }

        const currentFilter = {
          id: data?.doc?.id?.$ || '',
          message: data?.doc?.message?.$ || '',
          name: data?.doc?.name?.$ || '',
          abuse: data?.doc?.abuse?.$ || '',
          tstatus: statuses || '',
          message_post: data?.doc?.message_post?.$ || 'nodate',
          message_poststart: data?.doc?.message_poststart?.$ || '',
          message_postend: data?.doc?.message_postend?.$ || '',
        }
        dispatch(supportActions.getCurrentFilters(currentFilter))
      })

      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('support -', error.message)
      logout(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getTicketsArchiveFiltersHandler = data => (dispatch, getState) => {
  dispatch(actions.showLoader())
  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'clientticket_archive.filter',
        out: 'json',
        auth: sessionId,
        sok: 'ok',
        ...data,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) {
        throw new Error(data.doc.error.msg.$)
      }

      let statuses
      if (Array.isArray(data?.doc?.tstatus)) {
        let statusList = data?.doc?.tstatus?.map(el => `${el?.$}`)
        statuses = statusList.join(',')
      } else {
        statuses = data?.doc?.tstatus?.$
      }

      const currentFilter = {
        id: data?.doc?.id?.$ || '',
        message: data?.doc?.message?.$ || '',
        name: data?.doc?.name?.$ || '',
        abuse: data?.doc?.abuse?.$ || '',
        tstatus: statuses || '',
        message_post: data?.doc?.message_post?.$ || 'nodate',
        message_poststart: data?.doc?.message_poststart?.$ || '',
        message_postend: data?.doc?.message_postend?.$ || '',
      }
      dispatch(supportActions.getCurrentFilters(currentFilter))

      dispatch(getTicketsArchiveHandler())
    })
    .catch(error => {
      console.log('support -', error.message)
      logout(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

export default {
  getTicketsHandler,
  archiveTicketsHandler,
  getTicketsArchiveHandler,
  getTicketByIdHandler,
  getFile,
  setRate,
  sendMessage,
  getDepartmenList,
  getServiceList,
  createTicket,
  getTicketsFiltersSettingsHandler,
  getTicketsFiltersHandler,
  getTicketsArchiveFiltersHandler,
  getTicketsArchiveFiltersSettingsHandler,
}
