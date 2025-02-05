import qs from 'qs'
import { actions, contarctsActions } from '@redux'
import { axiosInstance } from '@config/axiosInstance'
import { checkIfTokenAlive, handleLoadersClosing } from '@utils'

const getContracts = (data, signal, setIsLoading) => (dispatch, getState) => {
  setIsLoading(true)

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
        ...data,
      }),
      { signal },
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      const contractsRenderData = {
        contracts: data.doc.elem ? data.doc.elem : [],
        // contracts: [],
        contractsPageRights: data.doc.metadata.toolbar,
      }

      const count = data?.doc?.p_elems?.$ || 0

      dispatch(contarctsActions.setContractsList(contractsRenderData))
      dispatch(contarctsActions.setContractsCount(count))
      setIsLoading(false)
    })
    .catch(error => {
      handleLoadersClosing(error?.message, dispatch, setIsLoading)
      checkIfTokenAlive(error.message, dispatch, true)
    })
}

const getPdfFile = (elid, name, signal, setIsLoading) => (dispatch, getState) => {
  const {
    auth: { sessionId },
  } = getState()

  setIsLoading(true)

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'contract.print.pdf',
        out: 'pdf_print',
        auth: sessionId,
        elid,
      }),
      { responseType: 'blob', signal },
    )
    .then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${name}.pdf`)
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

const getPrintFile = elid => (dispatch, getState) => {
  const {
    auth: { sessionId },
  } = getState()

  dispatch(actions.showLoader())

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'contract.print.pdf',
        out: 'pdf_print',
        auth: sessionId,
        elid,
      }),
      { responseType: 'blob' },
    )
    .then(response => {
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'application/pdf' }),
      )
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('target', '_blank')
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)

      dispatch(actions.hideLoader())
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

export default {
  getContracts,
  getPdfFile,
  getPrintFile,
}
