import axios from 'axios'
import qs from 'qs'
import accessLogsActions from './accessLogsActions'
import { BASE_URL } from '../../config/config'

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})

const getAccessLogsHandler = (body = {}) => (dispatch, getState) => {
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
        p_cnt: 7,
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
        out: 'json',
        auth: sessionId,
        ...body
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) {
        throw new Error(data.doc.error.msg.$)
      }
      axiosInstance
        .post(
          '/',
          qs.stringify({
            func: 'authlog',
            sok: 'ok',
            out: 'json',
            auth: sessionId,
            p_cnt: 7,
            p_col: '+time',
            ...body
          }),
        )
        .then(({ data }) => {
          if (data.doc.error) {
            throw new Error(data.doc.error.msg.$)
          }
          const elem = data?.doc?.elem || [];
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
