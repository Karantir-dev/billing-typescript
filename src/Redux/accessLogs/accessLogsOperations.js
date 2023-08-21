import qs from 'qs'
import { axiosInstance } from '@config/axiosInstance'
import { accessLogsActions } from '@redux'
import i18n from 'i18next'
import { checkIfTokenAlive } from '@utils'

const getAccessLogsHandler =
  (body = {}, signal) =>
  (dispatch, getState) => {
    dispatch(accessLogsActions.showLoaderLogs())
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
        dispatch(accessLogsActions.getAccessLogs(elem))
        const count = data?.doc?.p_elems?.$ || 0
        dispatch(accessLogsActions.getAccessLogsCount(count))
        dispatch(getAccessLogsFiltersHandler({}, signal))
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(accessLogsActions.hideLoaderLogs())
      })
  }

const getAccessLogsFiltersHandler =
  (body = {}, signal) =>
  (dispatch, getState) => {
    dispatch(accessLogsActions.showLoaderLogs())
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
        { signal },
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
        dispatch(accessLogsActions.hideLoaderLogs())
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
      })
  }

const filterDataHandler =
  (body = {}, signal) =>
  (dispatch, getState) => {
    dispatch(accessLogsActions.showLoaderLogs())
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
        { signal },
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
              p_cnt: body?.p_cnt,
              p_col: '+time',
              ...body,
            }),
            { signal },
          )
          .then(({ data }) => {
            if (data.doc.error) {
              throw new Error(data.doc.error.msg.$)
            }
            const elem = data?.doc?.elem || []
            const count = data?.doc?.p_elems?.$ || 0
            dispatch(accessLogsActions.getAccessLogsCount(count))
            dispatch(accessLogsActions.getAccessLogs(elem))
            dispatch(accessLogsActions.hideLoaderLogs())
          })
          .catch(error => {
            checkIfTokenAlive(error.message, dispatch)
            dispatch(accessLogsActions.hideLoaderLogs())
          })
      })
      .catch(error => {
        dispatch(accessLogsActions.hideLoaderLogs())
        checkIfTokenAlive('logs -' + error.message, dispatch)
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
