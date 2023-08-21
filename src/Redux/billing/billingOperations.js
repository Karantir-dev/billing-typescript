import qs from 'qs'
import axios from 'axios'
import i18n from '@src/i18n'
import {
  actions,
  billingActions,
  payersOperations,
  payersActions,
  userActions,
} from '@redux'
import { API_URL } from '@config/config'
import { axiosInstance } from '@config/axiosInstance'
import { toast } from 'react-toastify'
import { checkIfTokenAlive, cookies } from '@utils'
import { userNotifications } from '@redux/userInfo/userOperations'

const getPayments =
  (body = {}, readOnly, signal) =>
  (dispatch, getState) => {
    dispatch(billingActions.showLoaderPayment())

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
        { signal },
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)
        const elem = data?.doc?.elem || []
        const count = data?.doc?.p_elems?.$ || 0
        if (readOnly) {
          dispatch(billingActions.setPaymentsReadOnlyList(elem))
          dispatch(billingActions.setPaymentsReadOnlyCount(count))
          dispatch(getPaymentsFilters(signal))
          return
        }
        dispatch(billingActions.setPaymentsList(elem))
        dispatch(billingActions.setPaymentsCount(count))
        dispatch(getPaymentsFilters(signal))
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(billingActions.hideLoaderPayment())
      })
  }

const getPaymentsFilters = signal => (dispatch, getState) => {
  dispatch(billingActions.showLoaderPayment())

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
      { signal },
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
      dispatch(billingActions.hideLoaderPayment())
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(billingActions.hideLoaderPayment())
    })
}

const setPaymentsFilters =
  (body = {}, readOnly, signal) =>
  (dispatch, getState) => {
    dispatch(billingActions.showLoaderPayment())

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
        { signal },
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)
        dispatch(getPayments(body, readOnly, signal))
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(billingActions.hideLoaderPayment())
      })
  }

const getPaymentPdf = (elid, name) => (dispatch, getState) => {
  dispatch(billingActions.showLoaderPayment())

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

      dispatch(billingActions.hideLoaderPayment())
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(billingActions.hideLoaderPayment())
    })
}

const getPaymentCsv = p_cnt => (dispatch, getState) => {
  dispatch(billingActions.showLoaderPayment())

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

      dispatch(billingActions.hideLoaderPayment())
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(billingActions.hideLoaderPayment())
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
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getExpenses =
  (body = {}, signal) =>
  (dispatch, getState) => {
    dispatch(billingActions.showLoaderExpenses())

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
        { signal },
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)
        const elem = data?.doc?.elem || []
        const count = data?.doc?.p_elems?.$ || 0

        dispatch(billingActions.setExpensesList(elem))
        dispatch(billingActions.setExpensesCount(count))
        dispatch(getExpensesFilters(signal))
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(billingActions.hideLoaderExpenses())
      })
  }

const getExpensesFilters = signal => (dispatch, getState) => {
  dispatch(billingActions.showLoaderPayment())

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
      { signal },
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

      dispatch(billingActions.hideLoaderExpenses())
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(billingActions.hideLoaderExpenses())
    })
}

const setExpensesFilters =
  (body = {}, signal) =>
  (dispatch, getState) => {
    dispatch(billingActions.showLoaderExpenses())

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
        { signal },
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        dispatch(getExpenses(body))
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(billingActions.hideLoaderExpenses())
      })
  }

const getExpensesCsv = p_cnt => (dispatch, getState) => {
  dispatch(billingActions.showLoaderExpenses())

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

      dispatch(billingActions.hideLoaderExpenses())
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(billingActions.hideLoaderExpenses())
    })
}

const getPayers =
  (body = {}, cart = false) =>
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

        dispatch(
          payersActions.setPayersList(elem?.filter(({ name, id }) => name?.$ && id?.$)),
        )
        dispatch(payersActions.setPayersCount(count))
        dispatch(getPayerCountryType(cart))
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const getPayerCountryType =
  (cart = false) =>
  (dispatch, getState) => {
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
        {
          !cart && dispatch(getPaymentMethod({}, d))
        }
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
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
        checkIfTokenAlive(error.message, dispatch)
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
          if (
            data.doc.error?.$object === 'eu_vat' &&
            data.doc.error.msg.$.includes('field has invalid value')
          ) {
            toast.error(
              i18n.t('eu_vat field has invalid value', {
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
              if (
                body?.paymethod_name?.includes('Coinify') ||
                body?.paymethod_name?.includes('Bitcoin')
              ) {
                const ecommerceData = {
                  event: 'purchase',
                  ecommerce: {
                    payment_type: body?.paymethod_name,
                    transaction_id: data.doc?.payment_id?.$,
                    affiliation: 'cp.zomro.com',
                    value: Number(body?.amount) || 0,
                    tax: Number(body?.tax) || 0,
                    currency: 'EUR',
                    shipping: '0',
                    items: [
                      {
                        item_name: 'Refill',
                        item_id: data.doc?.payment_id?.$,
                        price: Number(body?.amount) || 0,
                        item_category: 'Refill',
                        quantity: 1,
                      },
                    ],
                  },
                }
                cookies.eraseCookie('payment_id')
                window?.dataLayer?.push({ ecommerce: null })
                window?.dataLayer?.push(ecommerceData)

                dispatch(analyticSendHandler(ecommerceData))
              } else {
                data.doc?.payment_id &&
                  cookies.setCookie('payment_id', data.doc?.payment_id?.$, 5)
              }

              dispatch(getPaymentMethodPage(data.doc.ok.$))
              setCreatePaymentModal(false)
            }
          })
          .catch(error => {
            checkIfTokenAlive(error.message, dispatch)
            dispatch(actions.hideLoader())
          })
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
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
    .catch(err => {
      checkIfTokenAlive(err?.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getPaymentRedirect = (elid, elname, paymethod) => (dispatch, getState) => {
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
        cookies.eraseCookie('payment_id')
        if (!(paymethod?.includes('Coinify') || paymethod?.includes('Bitcoin'))) {
          data.doc?.payment_id &&
            cookies.setCookie('payment_id', data.doc?.payment_id?.$, 5)
        }

        dispatch(getPaymentMethodPage(data.doc.ok.$))
      }
    })
    .catch(err => {
      checkIfTokenAlive(err?.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getAutoPayments = signal => (dispatch, getState) => {
  dispatch(billingActions.showLoaderAutoPayment())

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
      { signal },
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      data.doc?.list?.forEach(e => {
        if (e?.$name === 'methodlist') {
          dispatch(billingActions.setAutoPaymentsList(e?.elem))
        }
      })

      dispatch(getAutoPaymentsAdd(signal))
    })
    .catch(err => {
      checkIfTokenAlive(err?.message, dispatch)
      dispatch(billingActions.hideLoaderAutoPayment())
    })
}

const getAutoPaymentsAdd = signal => (dispatch, getState) => {
  dispatch(billingActions.showLoaderAutoPayment())

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
      { signal },
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

      dispatch(billingActions.hideLoaderAutoPayment())
    })
    .catch(err => {
      checkIfTokenAlive(err?.message, dispatch)
      dispatch(billingActions.hideLoaderAutoPayment())
    })
}

const stopAutoPayments = id => (dispatch, getState) => {
  dispatch(billingActions.showLoaderAutoPayment())

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
      dispatch(billingActions.hideLoaderAutoPayment())
    })
    .catch(err => {
      checkIfTokenAlive(err?.message, dispatch)
      dispatch(billingActions.hideLoaderAutoPayment())
    })
}

const createAutoPayment =
  (body = {}, setIsConfigure) =>
  (dispatch, getState) => {
    dispatch(billingActions.showLoaderAutoPayment())

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
        checkIfTokenAlive(error.message, dispatch)
        dispatch(billingActions.hideLoaderAutoPayment())
      })
  }

const getPaymentMethods =
  (body = {}, signal) =>
  (dispatch, getState) => {
    dispatch(billingActions.showLoaderPaymentMethod())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'payment.recurring.stored_methods',
          out: 'json',
          auth: sessionId,
          p_col: '+time',
          clickstat: 'yes',
          p_cnt: body?.p_cnt || 10,
          lang: 'en',
          ...body,
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)
        const elem = data?.doc?.elem || []
        const count = data?.doc?.p_elems?.$ || 0

        dispatch(billingActions.setPaymentMethodList(elem))
        dispatch(billingActions.setPaymentMethodCount(count))
        dispatch(billingActions.hideLoaderPaymentMethod())
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(billingActions.hideLoaderPaymentMethod())
      })
  }

const getPaymentMethodReconfig = (elid, elname) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'payment.recurring.stored_methods.reconfigure',
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
    .catch(err => {
      checkIfTokenAlive(err?.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const deletePaymentMethod = elid => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'payment.recurring.stored_methods.delete',
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

      toast.success(i18n.t('Payment method deleted successfully', { ns: 'billing' }), {
        position: 'bottom-right',
      })

      dispatch(billingActions.deletePaymentMethod(elid))

      dispatch(actions.hideLoader())
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const addPaymentMethod =
  (body = {}, setAddPaymentMethodData) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'payment.stored_methods.add',
          out: 'json',
          auth: sessionId,
          lang: 'en',
          ...body,
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

          throw new Error(data.doc.error.msg.$)
        }

        dispatch(actions.hideLoader())
        setAddPaymentMethodData && setAddPaymentMethodData(data.doc)
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const finishAddPaymentMethod =
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
          func: 'payment.stored_methods.add.finish',
          out: 'json',
          auth: sessionId,
          lang: 'en',
          sok: 'ok',
          clicked_button: 'finish',
          ...body,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) {
          throw new Error(data.doc.error.msg.$)
        }

        if (data.doc.ok) {
          dispatch(getPaymentMethodPage(data.doc.ok.$))
        }
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const editNamePaymentMethod =
  (body = {}, func) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'payment.recurring.stored_methods.edit',
          out: 'json',
          auth: sessionId,
          lang: 'en',
          sok: 'ok',
          ...body,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) {
          throw new Error(data.doc.error.msg.$)
        }

        func && func()
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const analyticSendHandler = data => () => {
  axios.post(`${API_URL}/api/analytic/add/`, data)
}

// const getExchangeRate = (cur, setExchangeRate) => () => {
//   let currency = 1

//   axios
//     .get(`${API_URL}/api/service/currency/${cur}`)
//     .then(({ data }) => {
//       if (data?.success === true || data?.success === 'true') {
//         currency = data?.currency
//       }
//       setExchangeRate && setExchangeRate(currency)
//     })
//     .catch(() => {
//       setExchangeRate && setExchangeRate(currency)
//     })
// }

const useCertificate =
  ({ coupon, errorFunc = () => {}, successFunc = () => {} }) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())
    const {
      auth: { sessionId },
    } = getState()
    axiosInstance
      .post(
        '/billmgr',
        qs.stringify({
          func: 'coupon.use',
          out: 'json',
          lang: 'en',
          auth: sessionId,
          coupon: coupon,
          sok: 'ok',
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
              func: 'whoami',
              out: 'json',
              lang: 'en',
              auth: sessionId,
            }),
          )
          .then(response => dispatch(userActions.setUserInfo(response.data.doc.user)))

        axiosInstance
          .post(
            '/',
            qs.stringify({
              func: 'notify',
              out: 'json',
              lang: 'en',
              auth: sessionId,
            }),
          )
          .then(response => {
            userNotifications(response.data, dispatch)
          })

        toast.success(
          i18n.t('certificate_applied_success', {
            ns: 'other',
          }),
          {
            position: 'bottom-right',
            toastId: 'customId',
          },
        )
        successFunc()
        dispatch(actions.hideLoader())
      })
      .catch(() => {
        errorFunc()
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
  getPaymentMethods,
  getPaymentMethodReconfig,
  deletePaymentMethod,

  addPaymentMethod,
  finishAddPaymentMethod,
  editNamePaymentMethod,
  analyticSendHandler,
  // getExchangeRate,
  useCertificate,
}
