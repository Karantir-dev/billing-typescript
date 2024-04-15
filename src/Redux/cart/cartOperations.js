import qs from 'qs'
import i18n from '@src/i18n'
import {
  actions,
  cartActions,
  billingOperations,
  userOperations,
  billingActions,
  authSelectors,
} from '@redux'
import { axiosInstance } from '@config/axiosInstance'
import { toast } from 'react-toastify'
import {
  checkIfTokenAlive,
  analyticsSaver,
  fraudCheckSender,
  renameAddonFields,
  handleLoadersClosing,
} from '@utils'
import * as routes from '@src/routes'

const getBasket =
  (setCartData, setPaymentsMethodList, isGetPayersList = true) =>
  (dispatch, getState) => {
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
          dispatch(
            getPaymentMethods(
              data?.doc?.billorder?.$,
              setPaymentsMethodList,
              isGetPayersList,
            ),
          )
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
          throw data.doc.error
        }

        dispatch(getBasket(setCartData, setPaymentsMethodList))
      })
      .catch(error => {
        dispatch(actions.hideLoader())

        if (error.$type === 'promocode_not_use') {
          toast.error(
            i18n.t('promocode_not_use', {
              ns: 'other',
              promocode: error.param.$,
            }),
          )
          return
        } else if (error.$type === 'missed') {
          toast.error(i18n.t('Invalid promo code', { ns: 'other' }))
          return
        } else {
          checkIfTokenAlive(error.msg.$ || error.message, dispatch)
        }
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
        /** func: 'cart.empty' for new API (the only required field) */
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

const getPaymentMethods =
  (billorder, setPaymentsMethodList, isGetPayersList) => (dispatch, getState) => {
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

        isGetPayersList && dispatch(billingOperations.getPayers())
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const setPaymentMethods =
  (body = {}, navigate, cartData = null, fraudData) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())
    analyticsSaver()

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

        const itemsForFraudData = cartData.elemList.map(el => ({
          category: el?.['item.type']?.$,
          quantity: 1,
          price: Number(el?.cost?.$),
          item_id: el?.['item.id']?.$,
        }))
        fraudData.shopping_cart = itemsForFraudData

        fraudCheckSender(sessionId, fraudData)

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
              if (data?.doc?.ok && data?.doc?.ok?.$ !== 'func=order') {
                if (body?.promocode) cartData.promocode = body.promocode

                analyticsSaver(cartData, data.doc?.payment_id?.$)

                dispatch(billingOperations.getPaymentMethodPage(data.doc.ok.$))
              }

              navigate &&
                navigate(cartState?.redirectPath, {
                  replace: true,
                })
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

const getSalesList = () => (dispatch, getState) => {
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

      /** for new version of API */
      let promoList = data.doc?.list?.find(el => el.$name === 'promotion')?.elem

      if (!promoList) {
        /** for old version of API */
        promoList = data.doc.elem
      }

      dispatch(actions.setPromotionsList(promoList))

      dispatch(actions.hideLoader())
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

const getTariffParameters =
  (
    { service, id, period = 1, ...params },
    setParameters,
    setIsError = () => {},
    signal,
    setIsLoading,
    isClonePage,
  ) =>
  (dispatch, getState) => {
    setIsLoading ? setIsLoading(true) : dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        sessionId ? '/' : process.env.REACT_APP_PROXY_API_URL,
        qs.stringify({
          func: `v2.${service}.order.param`,
          out: 'json',
          lang: 'en',
          period: period,
          pricelist: id,
          auth: sessionId,
          licence_agreement: 'on',
          ...params,
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)
        setParameters(renameAddonFields(data.doc, { isNewFunc: true }))
        handleLoadersClosing('closeLoader', dispatch, setIsLoading)
      })
      .catch(error => {
        setIsError(true)
        const errorMessage = isClonePage ? 'clone_error' : error.message
        checkIfTokenAlive(errorMessage, dispatch)
        handleLoadersClosing(error?.message, dispatch, setIsLoading)
      })
  }

const getTariffInfo =
  (
    { service, id, period, ...params },
    setParameters,
    setPeriods,
    setIsError,
    isClonePage,
  ) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        sessionId ? '/' : process.env.REACT_APP_PROXY_API_URL,
        qs.stringify({
          func: `${service}.order`,
          out: 'json',
          lang: 'en',
          auth: sessionId,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)
        const periods = data.doc.slist.find(el => el.$name === 'period')?.val
        setPeriods(periods)

        dispatch(
          getTariffParameters(
            { service, id, period, ...params },
            setParameters,
            setIsError,
            undefined,
            undefined,
            isClonePage,
          ),
        )
      })
      .catch(error => {
        setIsError(true)
        checkIfTokenAlive(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const setOrderData =
  ({ service, id, period, ...params }, func) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())
    const sessionId = authSelectors.getSessionId(getState())

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: `${service}.order.param`,
          auth: sessionId,
          out: 'json',
          sok: 'ok',
          lang: 'en',
          licence_agreement: 'on',
          period: period,
          pricelist: id,
          ...params,
        }),
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)

        func()
      })
      .catch(err => {
        checkIfTokenAlive(err.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const orderSameTariff = (service, elid, navigate) => (dispatch, getState) => {
  dispatch(actions.showLoader())
  const sessionId = authSelectors.getSessionId(getState())

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: `${service}.edit`,
        auth: sessionId,
        elid,
        out: 'json',
        lang: 'en',
      }),
    )
    .then(({ data }) => {
      if (data.doc?.error) throw new Error(data.doc.error.msg.$)

      const tariff = renameAddonFields(data.doc)
      const {
        register,
        ostempl,
        recipe,
        period,
        pricelist,
        domain,
        server_name,
        autoprolong,
      } = tariff

      const domainParam = domain.$ ? `&domain=${domain?.$}` : ''
      const serverParam = server_name.$ ? `&server_name=${server_name?.$}` : ''
      const ostemplParam = ostempl.$ ? `&ostempl=${ostempl.$}` : ''
      const recipeParam = recipe.$ ? `&recipe=${recipe.$}` : ''
      const autoprolongParam = autoprolong?.$
        ? `&autoprolong=${autoprolong?.$ === 'null' ? 'null' : period.$}`
        : ''
      const addons = Object.values(register).map(el => `${el}=${tariff[el].$}`)

      const params = `service=${service}&id=${pricelist.$}&period=${
        period.$
      }${ostemplParam}${recipeParam}${domainParam}${serverParam}&${addons.join(
        '&',
      )}${autoprolongParam}`

      navigate(`${routes.ORDER}?${params}`, { state: { backLink: service } })
      dispatch(actions.hideLoader())
    })
    .catch(err => {
      checkIfTokenAlive(err.message, dispatch)
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
  getPayMethodItem,
  getTariffParameters,
  getTariffInfo,
  setOrderData,
  orderSameTariff,
}
