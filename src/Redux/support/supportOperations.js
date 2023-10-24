import qs from 'qs'
import { axiosInstance } from '@config/axiosInstance'
import { actions, supportActions, userOperations } from '@redux'
import { checkIfTokenAlive } from '@utils'
import { toast } from 'react-toastify'
import i18n from '@src/i18n'
import translateSupportPaymentError from '@utils/translateSupportPaymentError'

const getTicketsHandler =
  (body = {}, signal, setIsLoading) =>
  (dispatch, getState) => {
    setIsLoading ? setIsLoading(true) : dispatch(actions.showLoader())

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
          lang: 'en',
          p_col: '+time',
          clickstat: 'yes',
          ...body,
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc.error) {
          throw new Error(data.doc.error.msg.$)
        }
        const elem = data?.doc?.elem || []
        dispatch(supportActions.getTickets(elem))
        const count = data?.doc?.p_elems?.$ || 0
        dispatch(supportActions.getTicketCount(count))
        dispatch(getTicketsFiltersSettingsHandler(signal, setIsLoading))
      })
      .catch(error => {
        if (setIsLoading) {
          checkIfTokenAlive(error.message, dispatch, true) && setIsLoading(false)
        } else {
          checkIfTokenAlive(error.message, dispatch)
          dispatch(actions.hideLoader())
        }
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
        lang: 'en',
        elid: idTicket,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) {
        throw new Error(data.doc.error.msg.$)
      }
      dispatch(supportActions.getTicket(data.doc))
      dispatch(userOperations.getDashboardTickets())
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
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
        lang: 'en',
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
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getTicketsArchiveHandler =
  (body = {}, signal, setIsLoading) =>
  (dispatch, getState) => {
    setIsLoading(true)
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
          p_col: '+time',
          clickstat: 'yes',
          lang: 'en',
          ...body,
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc.error) {
          throw new Error(data.doc.error.msg.$)
        }
        const elem = data?.doc?.elem || []
        dispatch(supportActions.getTicketsArchive(elem))
        const count = data?.doc?.p_elems?.$ || 0
        dispatch(supportActions.getTicketArchiveCount(count))
        dispatch(getTicketsArchiveFiltersSettingsHandler(signal, setIsLoading))
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch, true) && setIsLoading(false)
      })
  }

const getFile =
  (name, elid, setImage = null, setImageIsOpened = null) =>
  (dispatch, getState) => {
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
          lang: 'en',
        }),
        { responseType: 'blob' },
      )
      .then(({ data }) => {
        const url = window.URL.createObjectURL(new Blob([data]))
        if (setImage && setImageIsOpened) {
          setImage(url)
          setImageIsOpened(true)
          return
        }
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
        lang: 'en',
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
      checkIfTokenAlive(error.message, dispatch)
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
      checkIfTokenAlive(error.message, dispatch)
    })
}

const getDepartmenList = signal => (dispatch, getState) => {
  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'clientticket.edit',
        lang: 'en',
        out: 'json',
        auth: sessionId,
      }),
      { signal },
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
      checkIfTokenAlive(error.message, dispatch, true)
    })
}

const getServiceList = signal => (dispatch, getState) => {
  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'clientticket.edit',
        lang: 'en',
        out: 'json',
        auth: sessionId,
        sv_field: 'ticket_item',
        sv_autocomplete: 'yes',
      }),
      { signal },
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
      checkIfTokenAlive(error.message, dispatch, true)
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
      dispatch(actions.hideLoader())
      checkIfTokenAlive(error.message, dispatch)
      setCreateTicketModal(false)
    })
}

const getTicketsFiltersSettingsHandler =
  (signal, setIsLoading) => (dispatch, getState) => {
    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'clientticket.filter',
          lang: 'en',
          out: 'json',
          auth: sessionId,
        }),
        { signal },
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

        setIsLoading ? setIsLoading(false) : dispatch(actions.hideLoader())
      })
      .catch(error => {
        if (setIsLoading) {
          checkIfTokenAlive(error.message, dispatch, true) && setIsLoading(false)
        } else {
          checkIfTokenAlive(error.message, dispatch)
          dispatch(actions.hideLoader())
        }
      })
  }

const getTicketsFiltersHandler = (data, signal, setIsLoading) => (dispatch, getState) => {
  setIsLoading(true)
  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'clientticket.filter',
        lang: 'en',
        out: 'json',
        auth: sessionId,
        sok: 'ok',
        ...data,
      }),
      { signal },
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

      dispatch(getTicketsHandler({ p_cnt: data?.p_cnt }, signal, setIsLoading))
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch, true) && setIsLoading(false)
    })
}

const getTicketsArchiveFiltersSettingsHandler =
  (signal, setIsLoading) => (dispatch, getState) => {
    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'clientticket_archive.filter',
          lang: 'en',
          out: 'json',
          auth: sessionId,
        }),
        { signal },
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

        setIsLoading(false)
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch, true) && setIsLoading(false)
      })
  }

const getTicketsArchiveFiltersHandler =
  (data, signal, setIsLoading) => (dispatch, getState) => {
    setIsLoading(true)

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'clientticket_archive.filter',
          lang: 'en',
          out: 'json',
          auth: sessionId,
          sok: 'ok',
          ...data,
        }),
        { signal },
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

        dispatch(getTicketsArchiveHandler({}, signal, setIsLoading))
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch, true) && setIsLoading(false)
      })
  }

const paySupportTips = (elid, summattips, setSuccessModal) => (dispatch, getState) => {
  dispatch(actions.showLoader())
  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'supporttips',
        sok: 'ok',
        out: 'json',
        elid,
        sessid: sessionId,
        summattips,
        lang: 'en',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) {
        throw new Error(JSON.parse(data.doc.error.msg[0]?.$)?.msg)
      }

      setSuccessModal(true)
      dispatch(actions.hideLoader())
    })
    .then(() => dispatch(userOperations.getNotify()))
    .catch(error => {
      if (error.message.includes('insufficient funds to complete the operation')) {
        toast.error(translateSupportPaymentError(error.message))
      } else if (
        error.message.trim() ===
        'You can not make a transfer if the support did not answer'
      ) {
        toast.error(i18n.t(error.message.trim(), { ns: 'support' }))
      } else {
        checkIfTokenAlive(error.message, dispatch)
      }

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
  paySupportTips,
}
