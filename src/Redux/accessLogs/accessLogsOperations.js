import qs from 'qs'
import accessLogsActions from './accessLogsActions'
import { axiosInstance } from './../../config/axiosInstance'
import { actions } from '../'
import i18n from 'i18next'
import { errorHandler } from '../../utils'

const getAccessLogsHandler =
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
          func: 'authlog',
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
        dispatch(accessLogsActions.getAccessLogs(elem))
        const count = data?.doc?.p_elems?.$ || 0
        dispatch(accessLogsActions.getAccessLogsCount(count))
        dispatch(getAccessLogsFiltersHandler())
      })
      .catch(error => {
        console.log('logs -', error.message)
        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const getAccessLogsFiltersHandler =
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
          func: 'authlog.filter',
          sok: 'ok',
          out: 'json',
          lang: 'en',
          auth: sessionId,
          ...body,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) {
          throw new Error(data.doc.error.msg.$)
        }
        let filters = data?.doc?.doc?.slist?.val?.map(({ $, $key }) => {
          return { label: $, value: $key }
        })
        dispatch(accessLogsActions.getAccessLogsFilters(filters))
        dispatch(accessLogsActions.getCurrentFilters(data?.doc?.filter?.param))
        dispatch(actions.hideLoader())
      })
      .catch(error => {
        errorHandler(error.message, dispatch)
        console.log('logs -', error.message)
      })
  }

const filterDataHandler =
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
          func: 'authlog.filter',
          sok: 'ok',
          out: 'json',
          auth: sessionId,
          ...body,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) {
          throw new Error(data.doc.error.msg.$)
        }
        dispatch(accessLogsActions.getCurrentFilters(data?.doc?.filter?.param || []))
        axiosInstance
          .post(
            '/',
            qs.stringify({
              func: 'authlog',
              sok: 'ok',
              out: 'json',
              auth: sessionId,
              p_cnt: 30,
              p_col: '+time',
              ...body,
            }),
          )
          .then(({ data }) => {
            if (data.doc.error) {
              throw new Error(data.doc.error.msg.$)
            }
            const elem = data?.doc?.elem || []
            const count = data?.doc?.p_elems?.$ || 0
            dispatch(accessLogsActions.getAccessLogsCount(count))
            dispatch(accessLogsActions.getAccessLogs(elem))
            dispatch(actions.hideLoader())
          })
          .catch(error => {
            errorHandler(error.message, dispatch)
            dispatch(actions.hideLoader())
            console.log('logs -', error.message)
          })
      })
      .catch(error => {
        dispatch(actions.hideLoader())
        console.log('logs -', error.message)
      })
  }

const getAccessLogsCvs = p_cnt => (dispatch, getState) => {
  const {
    auth: { sessionId },
  } = getState()
  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'authlog',
        out: 'csv',
        lang: i18n.language,
        clickstat: 'yes',
        auth: sessionId,
        p_cnt,
      }),
      { responseType: 'blob' },
    )
    .then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'Access_logs.csv')
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
    })
}

export default {
  getAccessLogsHandler,
  getAccessLogsFiltersHandler,
  filterDataHandler,
  getAccessLogsCvs,
}
