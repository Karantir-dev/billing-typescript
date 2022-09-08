import qs from 'qs'
import { actions, billingActions, payersOperations, payersActions } from '..'
import { axiosInstance } from '../../config/axiosInstance'
import { toast } from 'react-toastify'
import i18n from './../../i18n'
import { errorHandler } from '../../utils'

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
          p_col: '+time',
          clickstat: 'yes',
          p_cnt: body?.p_cnt || 10,
          lang: 'en',
          ...body,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)
        const elem = data?.doc?.elem || []
        const count = data?.doc?.p_elems?.$ || 0

        dispatch(billingActions.setPaymentsList(elem))
        dispatch(billingActions.setPaymentsCount(count))
        dispatch(getPaymentsFilters())
      })
      .catch(error => {
        console.log('error', error)
        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const getPaymentsFilters = () => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'payment.filter',
        out: 'json',
        auth: sessionId,
        lang: 'en',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)
      let filters = {}

      data?.doc?.slist?.forEach(el => {
        filters[el.$name] = el.val
      })

      let currentFilters = {
        id: data.doc?.id?.$ || '',
        number: data.doc?.number?.$ || '',
        restrictrefund: data.doc?.restrictrefund?.$ || '',
        sender: data.doc?.sender?.$ || '',
        sender_id: data.doc?.sender_id?.$ || '',
        createdate: data.doc?.createdate?.$ || '',
        status: data.doc?.status?.$ || '',
        paymethod: data.doc?.paymethod?.$ || '',
        recipient: data.doc?.recipient?.$ || '',
        createdatestart: data.doc?.createdatestart?.$ || '',
        createdateend: data.doc?.createdateend?.$ || '',
        saamount_from: data.doc?.saamount_from?.$ || '',
      }

      dispatch(billingActions.setPaymentsFilters(currentFilters))
      dispatch(billingActions.setPaymentsFiltersLists(filters))
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      errorHandler(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const setPaymentsFilters =
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
          func: 'payment.filter',
          out: 'json',
          auth: sessionId,
          lang: 'en',
          sok: 'ok',
          ...body,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        dispatch(getPayments(body))
      })
      .catch(error => {
        console.log('error', error)
        errorHandler(error.message, dispatch)
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
        lang: 'en',
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
      errorHandler(error.message, dispatch)
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
        lang: 'en',
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
      errorHandler(error.message, dispatch)
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
        lang: 'en',
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
      errorHandler(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getExpenses =
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
          func: 'expense',
          out: 'json',
          auth: sessionId,
          p_col: '+time',
          clickstat: 'yes',
          lang: 'en',
          p_cnt: body?.p_cnt || 10,
          ...body,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)
        const elem = data?.doc?.elem || []
        const count = data?.doc?.p_elems?.$ || 0

        dispatch(billingActions.setExpensesList(elem))
        dispatch(billingActions.setExpensesCount(count))
        dispatch(getExpensesFilters())
      })
      .catch(error => {
        console.log('error', error)
        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const getExpensesFilters = () => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'expense.filter',
        out: 'json',
        lang: 'en',
        auth: sessionId,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)
      let filters = {}

      data?.doc?.slist?.forEach(el => {
        filters[el.$name] = el.val
      })

      let currentFilters = {
        id: data.doc?.id?.$ || '',
        locale_name: data.doc?.locale_name?.$ || '',
        item: data.doc?.item?.$ || '',
        compare_type: data.doc?.compare_type?.$ || '',
        amount: data.doc?.amount?.$ || '',
        fromdate: data.doc?.fromdate?.$ || '',
        todate: data.doc?.todate?.$ || '',
      }

      dispatch(billingActions.setExpensesFilters(currentFilters))
      dispatch(billingActions.setExpensesFiltersLists(filters))

      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      errorHandler(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const setExpensesFilters =
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
          func: 'expense.filter',
          out: 'json',
          auth: sessionId,
          lang: 'en',
          sok: 'ok',
          ...body,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        dispatch(getExpenses(body))
      })
      .catch(error => {
        console.log('error', error)
        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const getExpensesCsv = p_cnt => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'expense',
        out: 'csv',
        auth: sessionId,
        lang: 'en',
        p_cnt,
      }),
      { responseType: 'blob' },
    )
    .then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'var_expense.csv')
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)

      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      errorHandler(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getPayers =
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
          func: 'profile',
          out: 'json',
          auth: sessionId,
          p_cnt: 300,
          p_col: '+time',
          clickstat: 'yes',
          ...body,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        const elem = data?.doc?.elem || []
        const count = data?.doc?.p_elems?.$ || 0

        dispatch(payersActions.setPayersList(elem))
        dispatch(payersActions.setPayersCount(count))
        dispatch(getPayerCountryType())
      })
      .catch(error => {
        console.log('error', error)
        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const getPayerCountryType = () => (dispatch, getState) => {
  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'profile.add.country',
        out: 'json',
        auth: sessionId,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      const filters = {}

      data?.doc?.slist?.forEach(el => {
        filters[el.$name] = el?.val
      })

      const d = {
        country: filters?.country[0]?.$key,
        profiletype: filters?.profiletype[0]?.$key,
      }

      dispatch(payersActions.setPayersSelectLists(filters))
      dispatch(getPaymentMethod({}, d))
    })
    .catch(error => {
      console.log('error', error)
      errorHandler(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getPaymentMethod =
  (body = {}, payerModalInfoData = null) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'payment.add.method',
          out: 'json',
          auth: sessionId,
          lang: 'en',
          ...body,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        data.doc?.list?.forEach(el => {
          if (el.$name === 'methodlist') {
            dispatch(billingActions.setPaymentMethodsList(el?.elem))
          }
        })

        const d = {
          payment_currency: data.doc?.payment_currency?.$,
        }

        if (data.doc?.slist) {
          data.doc?.slist?.forEach(el => {
            if (el.$name === 'payment_currency') {
              d[`${el.$name}_list`] = el.val
            }
          })
        } else {
          d['payment_currency_list'] = [{ $: 'EUR', $key: data.doc?.payment_currency?.$ }]
        }

        dispatch(billingActions.setPaymentCurrencyList(d))

        if (payerModalInfoData) {
          return dispatch(payersOperations.getPayerModalInfo(payerModalInfoData))
        }

        dispatch(actions.hideLoader())
      })
      .catch(error => {
        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const createPaymentMethod =
  (body = {}, setCreatePaymentModal) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func:
            body?.profile && body?.profile?.length > 0
              ? 'profile.edit'
              : 'profile.add.profiledata',
          out: 'json',
          auth: sessionId,
          lang: 'en',
          sok: 'ok',
          ...body,
          elid: body?.profile && body?.profile?.length > 0 ? body?.profile : null,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) {
          if (data.doc.error.msg.$.includes('The VAT-number does not correspond to')) {
            toast.error(
              i18n.t('does not correspond to country', {
                ns: 'payers',
              }),
              {
                position: 'bottom-right',
                toastId: 'customId',
              },
            )
          }
          if (
            data.doc.error.msg.$.includes('The maximum number of payers') &&
            data.doc.error.msg.$.includes('Company')
          ) {
            toast.error(
              i18n.t('The maximum number of payers Company', {
                ns: 'payers',
              }),
              {
                position: 'bottom-right',
                toastId: 'customId',
              },
            )
          }
          throw new Error(data.doc.error.msg.$)
        }

        if (!(body?.profile && body?.profile?.length > 0)) {
          body.profile = data?.doc?.id?.$
        }
        axiosInstance
          .post(
            '/',
            qs.stringify({
              func: 'payment.add.method',
              out: 'json',
              auth: sessionId,
              lang: 'en',
              sok: 'ok',
              ...body,
            }),
          )
          .then(({ data }) => {
            if (data.doc.error) throw new Error(data.doc.error.msg.$)

            if (data.doc.ok) {
              dispatch(getPaymentMethodPage(data.doc.ok.$))
              setCreatePaymentModal(false)
            }
          })
          .catch(error => {
            console.log('error', error)
            errorHandler(error.message, dispatch)
            dispatch(actions.hideLoader())
          })
      })
      .catch(error => {
        console.log('error', error)
        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const getPaymentMethodPage = link => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      link,
      qs.stringify({
        auth: sessionId,
        lang: 'en',
      }),
      { responseType: 'blob' },
    )
    .then(response => {
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'text/html' }),
      )
      const link = document.createElement('a')
      link.href = url
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)

      dispatch(actions.hideLoader())
      dispatch(getPayments())
    })
    .catch(error => {
      console.log('error', error)
      dispatch(actions.hideLoader())
    })
}

const getPaymentRedirect = (elid, elname) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'payment.add.redirect',
        auth: sessionId,
        out: 'json',
        sok: 'ok',
        lang: 'en',
        elid,
        elname,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      if (data.doc.ok) {
        dispatch(getPaymentMethodPage(data.doc.ok.$))
      }
    })
    .catch(error => {
      console.log('error', error)
      dispatch(actions.hideLoader())
    })
}

const getAutoPayments = () => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'payment.recurring.settings',
        auth: sessionId,
        lang: 'en',
        out: 'json',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      data.doc?.list?.forEach(e => {
        if (e?.$name === 'methodlist') {
          dispatch(billingActions.setAutoPaymentsList(e?.elem))
        }
      })

      dispatch(getAutoPaymentsAdd())
    })
    .catch(error => {
      console.log('error', error)
      dispatch(actions.hideLoader())
    })
}

const getAutoPaymentsAdd = () => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'payment.recurring.add',
        auth: sessionId,
        lang: 'en',
        out: 'json',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      const config = {
        info: data?.doc?.info?.$ || '',
        maxamount: data?.doc?.maxamount?.$ || '',
      }

      data.doc?.list?.forEach(e => {
        if (e?.$name === 'methodlist') {
          config['elem'] = e?.elem
        }
      })

      dispatch(billingActions.setAutoPaymentConfig(config))

      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      dispatch(actions.hideLoader())
    })
}

const stopAutoPayments = id => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'payment.recurring.settings',
        auth: sessionId,
        out: 'json',
        lang: 'en',
        sok: 'ok',
        clicked_button: 'stop',
        id,
      }),
    )
    .then(({ data }) => {
      if (data?.doc?.error) throw new Error(data.doc.error.msg.$)
      if (data?.doc?.ok) {
        dispatch(billingActions.deleteAutoPayment(id))
        toast.success(i18n.t('Auto payment deleted successfully', { ns: 'billing' }), {
          position: 'bottom-right',
        })
      }
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      dispatch(actions.hideLoader())
    })
}

const createAutoPayment =
  (body = {}, setIsConfigure) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'payment.recurring.add.pay',
          out: 'json',
          auth: sessionId,
          lang: 'en',
          sok: 'ok',
          ...body,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        if (data.doc.ok) {
          dispatch(getPaymentMethodPage(data.doc.ok.$))
          setIsConfigure(false)
        }
      })
      .catch(error => {
        console.log('error', error)
        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

export default {
  getPayments,
  getPaymentPdf,
  getPaymentCsv,
  deletePayment,
  setPaymentsFilters,

  getExpenses,
  getExpensesCsv,
  setExpensesFilters,
  getPaymentMethod,
  createPaymentMethod,
  getPaymentMethodPage,
  getPaymentRedirect,
  getAutoPayments,
  stopAutoPayments,
  createAutoPayment,
  getPayers,
}
