import qs from 'qs'
import { axiosInstance } from './../../config/axiosInstance'
import { actions } from '../'
import authSelectors from '../auth/authSelectors'
import { errorHandler } from '../../utils'

const getVDS = setServers => (dispatch, getState) => {
  dispatch(actions.showLoader())
  const sessionId = authSelectors.getSessionId(getState())

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'vds',
        auth: sessionId,
        out: 'json',
      }),
    )
    .then(({ data }) => {
      if (data.doc?.error) throw new Error(data.doc.error.msg.$)
      console.log(data.doc)
      setServers(data.doc.elem)

      dispatch(actions.hideLoader())
    })
    .catch(err => {
      errorHandler(err.message, dispatch)
      dispatch(actions.hideLoader())
      console.log('getVDS - ', err.message)
    })
}

const editVDS = (elid, setInitialState) => (dispatch, getState) => {
  dispatch(actions.showLoader())
  const sessionId = authSelectors.getSessionId(getState())

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'vds.edit',
        auth: sessionId,
        elid,
        out: 'json',
      }),
    )
    .then(({ data }) => {
      if (data.doc?.error) throw new Error(data.doc.error.msg.$)
      setInitialState(data.doc)

      dispatch(actions.hideLoader())
    })
    .catch(err => {
      errorHandler(err.message, dispatch)
      dispatch(actions.hideLoader())
      console.log('editVDS - ', err.message)
    })
}

export default {
  getVDS,
  editVDS,
}
