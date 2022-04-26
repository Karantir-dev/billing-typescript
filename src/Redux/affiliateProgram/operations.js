import qs from 'qs'
import { axiosInstance } from './../../config/axiosInstance'
import authSelectors from '../auth/authSelectors'
import { actions } from '../actions'
import { affiliateActions } from './actions'

const getReferralLink = () => (dispatch, getState) => {
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
      if (data.doc?.error) throw new Error(data.doc.error.msg.$)

      const refLink = data.doc.url.$
      const promocode = data.doc.promocode.$ || 'promocode will be here'

      dispatch(affiliateActions.setReferralLink({ refLink, promocode }))
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
