import qs from 'qs'
import i18n from './../../i18n'
import {
  actions,
  cartActions,
  billingOperations,
  payersOperations,
  userOperations,
} from '..'
import axios from 'axios'
import { axiosInstance } from '../../config/axiosInstance'
import { toast } from 'react-toastify'
import { checkIfTokenAlive } from '../../utils'

const getBasket = (setCartData, setPaymentsMethodList) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
    cart: { cartState },
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
        }
      })

      setCartData && setCartData(cartData)
      setPaymentsMethodList &&
        dispatch(getPaymentMethods(data?.doc?.billorder?.$, setPaymentsMethodList))

      if (cartState?.salePromocode) {
        setCartData &&
          setPaymentsMethodList &&
          dispatch(
            setBasketPromocode('asfsghfgihjlj', setCartData, setPaymentsMethodList),
          )
        dispatch(cartActions.setCartIsOpenedState({ ...cartState, salePromocode: false }))
      }
    })
    .catch(error => {
      console.log('error', error)
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const setBasketPromocode =
  (promocode, setCartData, setPaymentsMethodList, setBlackFridayData, service) =>
  (dispatch, getState) => {
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
        if (service && setBlackFridayData) {
          const dataCheckPromo = {
            promocode: promocode,
            service: service,
          }

          axios
            .post('https://api.server-panel.net/api/service/promo/', dataCheckPromo)
            .then(({ data }) => {
              setBlackFridayData(data)
            })
        }

        if (data.doc.error) {
          toast.error(`${i18n.t(data.doc.error.msg.$?.trim(), { ns: 'other' })}`, {
            position: 'bottom-right',
          })

          throw new Error(data.doc.error.msg.$)
        }

        dispatch(getBasket(setCartData, setPaymentsMethodList))
      })
      .catch(error => {
        console.log('error', error)
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
        console.log('error', error)
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
      console.log('error', error)
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

      dispatch(payersOperations.getPayers())
      // dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const setPaymentMethods =
  (body = {}, navigate, cartData = null) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())

    window.dataLayer.push({ ecommerce: null })

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

            if (cartData) {
              const items = cartData?.elemList?.map(e => {
                return {
                  item_name: e.pricelist_name?.$ || '',
                  item_id: e.id?.$ || '',
                  price: Number(e.cost?.$) || 0,
                  item_category: e['item.type']?.$ || '',
                  quantity: 1,
                }
              })

              window.dataLayer.push({
                event: 'purchase',
                ecommerce: {
                  transaction_id: cartData?.billorder,
                  affiliation: 'cp.zomro.com',
                  value: Number(cartData?.total_sum) || 0,
                  currency: 'EUR',
                  coupon: body?.promocode,
                  items: items,
                },
              })
            }

            if (data.doc.ok && data.doc.ok?.$ !== 'func=order') {
              dispatch(billingOperations.getPaymentMethodPage(data.doc.ok.$))
            }

            navigate && navigate(cartState?.redirectPath)
            dispatch(
              cartActions.setCartIsOpenedState({
                isOpened: false,
                redirectPath: '',
              }),
            )
            // dispatch(actions.hideLoader())
          })
          .then(() => dispatch(userOperations.getNotify()))
          .catch(error => {
            console.log('error', error)
            checkIfTokenAlive(error.message, dispatch)
            dispatch(actions.hideLoader())
          })
      })
      .catch(error => {
        console.log('error', error)
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
}
