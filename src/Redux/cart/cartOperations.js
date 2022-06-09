import qs from 'qs'
import i18n from './../../i18n'
import { actions, cartActions, billingOperations } from '..'
import { axiosInstance } from '../../config/axiosInstance'
import { toast } from 'react-toastify'
import { errorHandler } from '../../utils'

const getBasket = (setCartData, setPaymentsMethodList) => (dispatch, getState) => {
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
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      const cartData = {
        total_sum: data.doc?.total_sum?.$,
        full_discount: data.doc?.total_sum?.$,
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
    })
    .catch(error => {
      console.log('error', error)
      errorHandler(error.message, dispatch)
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
        console.log('error', error)
        errorHandler(error.message, dispatch)
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
        errorHandler(error.message, dispatch)
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
      errorHandler(error.message, dispatch)
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

      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      errorHandler(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const setPaymentMethods =
  (body = {}, navigate) =>
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
          func: 'payment.add.method',
          out: 'json',
          sok: 'ok',
          auth: sessionId,
          ...body,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

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
        dispatch(actions.hideLoader())
      })
      .catch(error => {
        console.log('error', error)
        errorHandler(error.message, dispatch)
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
