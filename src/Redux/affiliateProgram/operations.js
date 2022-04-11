import qs from 'qs'
import { axiosInstance } from './../../config/axiosInstance'
import { authSelectors } from '../auth/authSelectors'
import { actions } from '../actions'

const getReferralLink = (setReferralLink, setPromocode) => (dispatch, getState) => {
  dispatch(actions.showLoader())
  const sessionId = authSelectors.getSessionId(getState())

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'affiliate.client',
        auth: sessionId,
        out: 'json',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)
      setPromocode(data.doc.promocode.$ || 'promocode stub')
      setReferralLink(data.doc.url.$)
      dispatch(actions.hideLoader())
    })
    .catch(err => {
      dispatch(actions.hideLoader())
      console.log('getReferralLink - ', err.message)
    })
}

export const affiliateProgramOperations = {
  getReferralLink,
}
