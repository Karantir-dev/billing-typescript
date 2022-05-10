import qs from 'qs'
import { actions, billingActions } from '..'
import { axiosInstance } from '../../config/axiosInstance'
import { toast } from 'react-toastify'
import i18n from './../../i18n'

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

const getPaymentPdf = (elid, name) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'payment.print.pdf',
        out: 'pdf_print',
        auth: sessionId,
        elid,
      }),
      { responseType: 'blob' },
    )
    .then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${name}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)

      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      dispatch(actions.hideLoader())
    })
}

const getPaymentCsv = p_cnt => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'payment',
        out: 'csv',
        auth: sessionId,
        p_cnt,
      }),
      { responseType: 'blob' },
    )
    .then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'var_payment.csv')
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)

      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      dispatch(actions.hideLoader())
    })
}

const deletePayment = elid => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'payment.delete',
        out: 'json',
        auth: sessionId,
        elid,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) {
        if (data.doc.error.$type === 'access') {
          data.doc.error.param.forEach(e => {
            if (e.$name === 'value') {
              toast.error(
                `${i18n.t('Insufficient privileges to access', { ns: 'other' })} ${e.$}`,
                {
                  position: 'bottom-right',
                },
              )
            }
          })
        }
        throw new Error(data.doc.error.msg.$)
      }

      toast.success(i18n.t('Payment deleted successfully', { ns: 'billing' }), {
        position: 'bottom-right',
      })

      dispatch(billingActions.deletePayment(elid))

      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      dispatch(actions.hideLoader())
    })
}

export default {
  getPayments,
  getPaymentPdf,
  getPaymentCsv,
  deletePayment,
}
