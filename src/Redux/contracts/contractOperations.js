import qs from 'qs'
import { actions } from '..'
import { axiosInstance } from '../../config/axiosInstance'
import { errorHandler } from '../../utils'
import contarctsActions from './contarctsActions'

const getContracts = () => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'contract',
        out: 'json',
        auth: sessionId,
        lang: 'en',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)
      dispatch(contarctsActions.setContractsList(data.doc.elem))
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      errorHandler(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getFile = elid => (dispatch, getState) => {
  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'contract.print.pdf',
        clickstat: 'yes',
        auth: sessionId,
        elid,
      }),
    )
    .then(response => {
      console.log(response)
    })
}

export default {
  getContracts,
  getFile,
}
