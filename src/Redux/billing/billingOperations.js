import qs from 'qs'
import { actions, billingActions } from '..'
import { axiosInstance } from '../../config/axiosInstance'

const getPayments =
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
          func: 'payment',
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

        dispatch(billingActions.setPaymentsList(elem))
        dispatch(billingActions.setPaymentsCount(count))
        dispatch(actions.hideLoader())
      })
      .catch(error => {
        console.log('error', error)
        dispatch(actions.hideLoader())
      })
  }

export default {
  getPayments,
}
