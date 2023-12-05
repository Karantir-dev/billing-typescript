import qs from 'qs'
import { axiosInstance } from '@config/axiosInstance'
import { accessLogsActions } from '@redux'
import i18n from 'i18next'
import { checkIfTokenAlive, handleLoadersClosing } from '@utils'

const getAccessLogsHandler =
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
        dispatch(getAccessLogsFiltersHandler({}, signal, setIsLoading))
      })
      .catch(error => {
        handleLoadersClosing(error?.message, dispatch, setIsLoading)
        checkIfTokenAlive(error.message, dispatch, true)
      })
  }

const getAccessLogsFiltersHandler =
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
        setIsLoading(false)
      })
      .catch(error => {
        handleLoadersClosing(error?.message, dispatch, setIsLoading)
        checkIfTokenAlive(error.message, dispatch, true)
      })
  }

const filterDataHandler =
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
            setIsLoading(false)
          })
          .catch(error => {
            handleLoadersClosing(error?.message, dispatch, setIsLoading)
            checkIfTokenAlive(error.message, dispatch, true)
          })
      })
      .catch(error => {
        handleLoadersClosing(error?.message, dispatch, setIsLoading)
        checkIfTokenAlive(error.message, dispatch, true)
      })
  }

const getAccessLogsCvs = (p_cnt, signal, setIsLoading) => (dispatch, getState) => {
  const {
    auth: { sessionId },
  } = getState()
  setIsLoading(true)

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
      { responseType: 'blob', signal },
    )
    .then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'Access_logs.csv')
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
      setIsLoading(false)
    })
    .catch(error => {
      handleLoadersClosing(error?.message, dispatch, setIsLoading)
      checkIfTokenAlive(error.message, dispatch, true)
    })
}

export default {
  getAccessLogsHandler,
  getAccessLogsFiltersHandler,
  filterDataHandler,
  getAccessLogsCvs,
}
