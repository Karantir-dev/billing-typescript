import qs from 'qs'
import { actions, domainsActions } from '..'
import { axiosInstance } from '../../config/axiosInstance'
import { errorHandler } from '../../utils'

const getDomains =
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
          func: 'domain',
          out: 'json',
          auth: sessionId,
          p_cnt: 30,
          p_col: '+time',
          clickstat: 'yes',
          ...body,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        const elem = data?.doc?.elem || []
        const count = data?.doc?.p_elems?.$ || 0

        dispatch(domainsActions.setDomainsList(elem))
        dispatch(domainsActions.setDomainsCount(count))
        dispatch(actions.hideLoader())
      })
      .catch(error => {
        console.log('error', error)
        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const getDomainsOrderInfo = setDomains => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'domain.order.name',
        out: 'json',
        auth: sessionId,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      const domains = []

      data?.doc?.list?.forEach(l => {
        if (l?.$name === 'pricelist_info') {
          l?.elem.forEach(e => {
            if (e?.id) {
              domains.push(e)
            }
          })
        }
      })

      setDomains(domains)

      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      errorHandler(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

export default {
  getDomains,
  getDomainsOrderInfo,
}
