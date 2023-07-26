import qs from 'qs'
import i18n from '@src/i18n'
import {
  actions,
  cartActions,
  billingOperations,
  userOperations,
  billingActions,
} from '@redux'
import { axiosInstance } from '@config/axiosInstance'
import { toast } from 'react-toastify'
import { checkIfTokenAlive, cookies } from '@utils'

const getBasket = (setCartData, setPaymentsMethodList) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
    billing: { periodValue },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'basket',
        out: 'json',
        auth: sessionId,
        lang: 'en',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      const cartData = {
        total_sum: data.doc?.total_sum?.$,
        tax: data.doc?.tax?.$,
        full_discount: data.doc?.full_discount?.$,
        billorder: data?.doc?.billorder?.$,
      }

      data.doc?.list?.forEach(el => {
        if (el.$name === 'itemlist') {
          cartData['elemList'] = el?.elem?.filter(e => !e?.rolled_back)

          cartData.elemList.forEach(el => {
            if (el['item.type']?.$ === 'vds') {
              el['item.period'].$ = periodValue ?? el['item.period']?.$
              el['item.autoprolong'].$ = periodValue ?? el['item.autoprolong']?.$
            }
          })

          dispatch(billingActions.setPeriodValue(null))
        }
      })

      setCartData && setCartData(cartData)
      setPaymentsMethodList &&
        dispatch(getPaymentMethods(data?.doc?.billorder?.$, setPaymentsMethodList))
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const setBasketPromocode =
  (promocode, setCartData, setPaymentsMethodList) => (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'basket',
          out: 'json',
          lang: 'en',
          auth: sessionId,
          sok: 'ok',
          promocode,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) {
          toast.error(`${i18n.t(data.doc.error.msg.$?.trim(), { ns: 'other' })}`, {
            position: 'bottom-right',
          })

          throw new Error(data.doc.error.msg.$)
        }

        dispatch(getBasket(setCartData, setPaymentsMethodList))
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const deleteBasketItem =
  (id, setCartData, setPaymentsMethodList) => (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'basket',
          out: 'json',
          auth: sessionId,
          lang: 'en',
          sok: 'ok',
          id,
          clicked_button: 'delete',
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        dispatch(getBasket(setCartData, setPaymentsMethodList))
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const clearBasket = id => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'basket',
        out: 'json',
        lang: 'en',
        auth: sessionId,
        sok: 'ok',
        id,
        clicked_button: 'clearbasket',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      dispatch(cartActions.setCartIsOpenedState({ isOpened: false }))
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      dispatch(cartActions.setCartIsOpenedState({ isOpened: false }))
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getPaymentMethods = (billorder, setPaymentsMethodList) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'payment.add',
        out: 'json',
        lang: 'en',
        auth: sessionId,
        billorder,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      data.doc?.list?.forEach(el => {
        if (el.$name === 'methodlist') {
          setPaymentsMethodList && setPaymentsMethodList(el?.elem)
        }
      })

      dispatch(billingOperations.getPayers({}, true))
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const setPaymentMethods =
  (body = {}, navigate, cartData = null) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
      cart: { cartState },
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
              lang: 'en',
              sok: 'ok',
              auth: sessionId,
              ...body,
            }),
          )
          .then(({ data }) => {
            if (data.doc.error) {
              if (
                data.doc.error.msg.$.replace(String.fromCharCode(39), '') ===
                'The Contact person field has invalid value. The value cannot be empty'
              ) {
                toast.error(
                  i18n?.t('The payer is not valid, change the payer or add a new one', {
                    ns: 'cart',
                  }),
                  {
                    position: 'bottom-right',
                    toastId: 'customId',
                  },
                )
              }

              if (data.doc.error.msg.$.includes('does not exist')) {
                toast.error(
                  i18n?.t('service_was_deleted_from_basket', {
                    ns: 'cart',
                  }),
                  {
                    position: 'bottom-right',
                    toastId: 'customId',
                  },
                )
                dispatch(
                  cartActions.setCartIsOpenedState({
                    isOpened: false,
                  }),
                )
              }
              throw new Error(data.doc.error.msg.$)
            }

            if (cartData) {
              const items = cartData?.elemList?.map(e => {
                return {
                  item_name: e.pricelist_name?.$ || '',
                  item_id: e['item.id']?.$ || '',
                  price: Number(e.cost?.$) || 0,
                  item_category: e['item.type']?.$ || '',
                  quantity: 1,
                }
              })

              if (data.doc.ok && data.doc.ok?.$ !== 'func=order') {
                if (
                  cartData?.payment_name?.includes('Coinify') ||
                  cartData?.payment_name?.includes('Bitcoin')
                ) {
                  const ecommerceData = {
                    event: 'purchase',
                    ecommerce: {
                      payment_type: cartData?.payment_name,
                      transaction_id: data.doc?.payment_id?.$,
                      affiliation: 'cp.zomro.com',
                      value: Number(cartData?.total_sum) || 0,
                      tax: Number(cartData?.tax) || 0,
                      currency: 'EUR',
                      shipping: '0',
                      coupon: body?.promocode,
                      items: items,
                    },
                  }
                  cookies.eraseCookie('payment_id')
                  window?.dataLayer?.push({ ecommerce: null })
                  window?.dataLayer?.push(ecommerceData)

                  dispatch(billingOperations.analyticSendHandler(ecommerceData))
                } else {
                  data.doc?.payment_id &&
                    cookies.setCookie('payment_id', data.doc?.payment_id?.$, 5)
                  cookies?.setCookie(
                    `cartData_${data.doc?.payment_id?.$}`,
                    JSON.stringify({
                      billorder: cartData?.billorder,
                      total_sum: cartData?.total_sum,
                      tax: cartData?.tax,
                      promocode: body?.promocode,
                      items: items,
                    }),
                    5,
                  )
                }

                dispatch(billingOperations.getPaymentMethodPage(data.doc.ok.$))
              }

              navigate && navigate(cartState?.redirectPath)
              dispatch(
                cartActions.setCartIsOpenedState({
                  isOpened: false,
                  redirectPath: '',
                }),
              )
              dispatch(actions.hideLoader())
            }
          })
          .then(() => dispatch(userOperations.getNotify()))
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

const getSalesList = setSalesList => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'account.discountinfo',
        auth: sessionId,
        out: 'json',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      const { elem: promoList } = data.doc

      const promoListData = {
        promoList,
      }

      setSalesList(promoListData.promoList)

      dispatch(actions.hideLoader())
      return promoListData
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getPayMethodItem = (body, setAdditionalPayMethodts) => (dispatch, getState) => {
  dispatch(actions.showLoader())
  setAdditionalPayMethodts(undefined)

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'payment.add.pay',
        out: 'json',
        lang: 'en',
        // sok: 'ok',
        // clicked_button: 'createprofile',
        auth: sessionId,
        ...body,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) {
        if (
          data.doc.error.msg.$.replace(String.fromCharCode(39), '') ===
          'The Contact person field has invalid value. The value cannot be empty'
        )
          toast.error(
            i18n?.t('The payer is not valid, change the payer or add a new one', {
              ns: 'cart',
            }),
            {
              position: 'bottom-right',
              toastId: 'customId',
            },
          )
        throw new Error(data.doc.error.msg.$)
      }

      const additionalFields = data.doc?.metadata?.form?.field?.find(
        e => e?.$name === 'payment_method',
      )
      const payment_method = data.doc?.slist?.find(e => e?.$name === 'payment_method')

      if (payment_method?.val) {
        const payment_methodArr = []

        payment_method?.val?.forEach(val => {
          const filtered = additionalFields?.select[0]?.if?.filter(
            i => i?.$value === val?.$key,
          )

          const hide = filtered?.map(e => e?.$hide)

          payment_methodArr?.push({ ...val, hide })
        })

        setAdditionalPayMethodts && setAdditionalPayMethodts(payment_methodArr)
      }
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

export default {
  getBasket,
  setBasketPromocode,
  deleteBasketItem,
  clearBasket,
  setPaymentMethods,
  getSalesList,
  getPayMethodItem
}
