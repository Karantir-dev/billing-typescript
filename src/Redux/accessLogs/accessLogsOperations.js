import qs from 'qs'
import accessLogsActions from './accessLogsActions'
import { axiosInstance } from './../../config/axiosInstance'
import i18n from 'i18next';



const getAccessLogsHandler = (body = {}) => (dispatch, getState) => {
  const {
    auth: { sessionId },
  } = getState()

  console.log(i18n.language)
  
  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'authlog',
        sok: 'ok',
        out: 'json',
        auth: sessionId,
        lang: i18n.language,
        p_cnt: 15,
        p_col: '+time',
        clickstat: 'yes',
        ...body
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) {
        throw new Error(data.doc.error.msg.$)
      }
      const elem = data?.doc?.elem || [];
      dispatch(accessLogsActions.getAccessLogs(elem))
      const count = data?.doc?.p_elems?.$ || 0
      dispatch(accessLogsActions.getAccessLogsCount(count))

    })
    .catch(error => {
      console.log('logs -', error.message)
    })
}

const getAccessLogsFiltersHandler = (body = {}) => (dispatch, getState) => {
  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'authlog.filter',
        sok: 'ok',
        lang: i18n.language,
        out: 'json',
        auth: sessionId,
        ...body
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
    })
    .catch(error => {
      console.log('logs -', error.message)
    })
}

const filterDataHandler = (body = {}) => (dispatch, getState) => {
  const {
    auth: { sessionId },
  } = getState()
  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'authlog.filter',
        sok: 'ok',
        lang: i18n.language,
        out: 'json',
        auth: sessionId,
        ...body
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
            lang: i18n.language,
            auth: sessionId,
            p_cnt: 15,
            p_col: '+time',
            ...body
          }),
        )
        .then(({ data }) => {
          if (data.doc.error) {
            throw new Error(data.doc.error.msg.$)
          }
          const elem = data?.doc?.elem || [];
          const count = data?.doc?.p_elems?.$ || 0
          dispatch(accessLogsActions.getAccessLogsCount(count))
          dispatch(accessLogsActions.getAccessLogs(elem))
        })
        .catch(error => {
          console.log('logs -', error.message)
        })

    })
    .catch(error => {
      console.log('logs -', error.message)
    })
}

const getAccessLogsCvs = () => (dispatch, getState) =>{ 
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
      }),
      { responseType: 'blob' }
    )
    .then((response) => {
      const url = window.URL.createObjectURL(
        new Blob([response.data]),
      );
      const link = document.createElement('a');
      console.log(url)
      link.href = url;
      link.setAttribute(
        'download',
        'Access_logs.csv',
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    });
}




export default {
  getAccessLogsHandler,
  getAccessLogsFiltersHandler,
  filterDataHandler,
  getAccessLogsCvs
}
