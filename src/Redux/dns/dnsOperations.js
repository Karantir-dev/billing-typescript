import qs from 'qs'
import { toast } from 'react-toastify'
import { axiosInstance } from '@config/axiosInstance'
import { checkIfTokenAlive, handleLoadersClosing } from '@utils'
import i18n from '@src/i18n'
import * as route from '@src/routes'
import { actions, cartActions, dnsActions } from '@redux'

//GET hostings OPERATIONS

const getDNSList = (data, signal, setIsLoading) => (dispatch, getState) => {
  setIsLoading ? setIsLoading(true) : dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'dnshost',
        out: 'json',
        auth: sessionId,
        lang: 'en',
        clickstat: 'yes',
        p_cnt: data?.p_cnt || 10,
        ...data,
      }),
      { signal },
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      const dnsRenderData = {
        dnsList: data.doc.elem ? data.doc.elem : [],
        dnsPageRights: data.doc.metadata.toolbar,
      }
      const count = data?.doc?.p_elems?.$ || 0

      dispatch(dnsActions.setDNSList(dnsRenderData))
      dispatch(dnsActions.setDNSCount(count))

      handleLoadersClosing('closeLoader', dispatch, setIsLoading)
    })
    .catch(error => {
      handleLoadersClosing(error?.message, dispatch, setIsLoading)
      checkIfTokenAlive(error.message, dispatch, true)
    })
}

const getTarifs =
  (setTarifs, data = {}, signal, setIsLoading) =>
  (dispatch, getState) => {
    setIsLoading(true)

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'dnshost.order',
          out: 'json',
          auth: sessionId,
          lang: 'en',
          ...data,
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        const { elem: tarifList } =
          data.doc.list.find(el => el?.$name === 'tariflist') || {}
        const { val: datacenter } =
          data.doc.slist.find(el => el?.$name === 'datacenter') || {}
        const { val: period } = data.doc.slist.find(el => el.$name === 'period') || {}
        const { $: currentDatacenter } = data.doc.datacenter

        const orderData = {
          tarifList,
          datacenter,
          period,
          currentDatacenter,
        }

        setTarifs(orderData)
        setIsLoading(false)
      })
      .catch(error => {
        if (error.message === 'No tariff plans available for order') {
          setTarifs(error.message)
        }
        handleLoadersClosing(error?.message, dispatch, setIsLoading)
        checkIfTokenAlive(error.message, dispatch, true)
      })
  }

const getParameters =
  (period, datacenter, pricelist, setParameters, setFieldValue, signal, setIsLoading) =>
  (dispatch, getState) => {
    setIsLoading(true)

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'dnshost.order.pricelist',
          out: 'json',
          auth: sessionId,
          period,
          datacenter,
          pricelist,
          snext: 'ok',
          sok: 'ok',
          lang: 'en',
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        let domainsLimitAddon = ''

        for (let key in data?.doc?.messages?.msg) {
          if (
            data?.doc?.messages?.msg[key]?.toLowerCase()?.includes('domain') &&
            data?.doc?.messages?.msg[key]?.toLowerCase()?.includes('limit')
          ) {
            domainsLimitAddon = key
          }
        }

        const { slist: paramsList } = data.doc
        const autoprolong = paramsList?.filter(item => item.$name === 'autoprolong')
        const domainsLimit = data.doc.metadata.form.field.filter(
          item => item.$name === domainsLimitAddon,
        )

        const maxLimit = domainsLimit[0]?.slider[0]?.$max
        const step = domainsLimit[0]?.slider[0]?.$step
        const minLimit = domainsLimit[0]?.slider[0]?.$min

        const limitsList = []

        if (minLimit) {
          let initialLimit = +minLimit
          limitsList.push(+minLimit)

          while (+initialLimit < +maxLimit) {
            limitsList.push(Number(initialLimit) + Number(step))
            initialLimit += +step
          }
        }

        // fields

        setFieldValue('autoprolonglList', autoprolong[0].val)
        setFieldValue('autoprolong', autoprolong[0]?.val[1]?.$key)
        setFieldValue('addon_961', limitsList[0])
        setFieldValue('limitsList', limitsList)
        setParameters({ ...paramsList, domainsLimitAddon })
        setIsLoading(false)
      })

      .catch(error => {
        handleLoadersClosing(error?.message, dispatch, setIsLoading)
        checkIfTokenAlive(error.message, dispatch, true)
      })
  }

const updateDNSPrice =
  (setNewPrice, data = {}, signal, setIsLoading) =>
  (dispatch, getState) => {
    setIsLoading(true)

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'dnshost.order.param',
          out: 'json',
          auth: sessionId,
          lang: 'en',
          ...data,
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)
        const price = data.doc.orderinfo.$.split('Total amount:')[1].split(' ')[1]

        setNewPrice(price)
        setIsLoading(false)
      })
      .catch(error => {
        handleLoadersClosing(error?.message, dispatch, setIsLoading)
        checkIfTokenAlive(error.message, dispatch, true)
      })
  }

const orderDNS =
  (data = {}) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'dnshost.order.param',
          out: 'json',
          auth: sessionId,
          sok: 'ok',
          licence_agreement: 'on',
          clicked_button: 'finish',
          lang: 'en',
          ...data,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        dispatch(
          cartActions.setCartIsOpenedState({
            isOpened: true,
            redirectPath: route.DNS,
          }),
        )

        dispatch(actions.hideLoader())
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const getPrintLicense = priceId => (dispatch, getState) => {
  const {
    auth: { sessionId },
  } = getState()

  dispatch(actions.showLoader())

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'license.print',
        out: 'doc_print',
        auth: sessionId,
        elid: priceId,
      }),
      { responseType: 'blob' },
    )
    .then(response => {
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'text/html' }),
      )
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('target', '_blank')
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)

      dispatch(actions.hideLoader())
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getCurrentDNSInfo = (elid, setInitialParams) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'dnshost.edit',
        out: 'json',
        auth: sessionId,
        lang: 'en',
        elid,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      const autoprolongList = data.doc.slist.filter(
        item => item.$name === 'autoprolong',
      )[0]
      const payment_method = data.doc.slist.filter(
        item => item.$name === 'stored_method',
      )[0]

      const domainsLimit = data.doc.metadata.form.page.filter(item =>
        item.$name.includes('addon'),
      )

      const countLimit = domainsLimit[0].field.filter(item =>
        item.$name.includes('addon'),
      )

      const maxLimit = countLimit[0]?.slider[0]?.$max
      const step = countLimit[0]?.slider[0]?.$step
      const minLimit = countLimit[0]?.slider[0]?.$min

      let limitsList = []
      let initialLimit = +minLimit
      limitsList.push(+minLimit)
      while (+initialLimit < +maxLimit) {
        limitsList.push(Number(initialLimit) + Number(step))
        initialLimit += +step
      }

      if (limitsList.includes(NaN)) {
        limitsList = null
      }

      const {
        username,
        autoprolong,
        opendate,
        password,
        period,
        name,
        id,
        expiredate,
        createdate,
        ip,
        addon_961_current_value,
      } = data.doc

      setInitialParams({
        autoprolongList,
        autoprolong,
        opendate,
        password,
        period,
        name,
        username,
        id,
        ip,
        expiredate,
        createdate,
        payment_method,
        addon_961_current_value,
        limitsList,
      })
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const editDNS = (elid, autoprolong, handleModal) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'dnshost.edit',
        out: 'json',
        auth: sessionId,
        lang: 'en',
        elid,
        autoprolong,
        clicked_button: 'ok',
        sok: 'ok',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      dispatch(getDNSList({ p_num: 1 }))

      toast.success(i18n.t('Changes saved successfully', { ns: 'other' }), {
        position: 'bottom-right',
        toastId: 'customId',
      })
      dispatch(actions.hideLoader())

      handleModal()
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getDNSExtraPayText =
  (elid, autoprolong, addon_961, setAdditionalText) => (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'dnshost.edit',
          out: 'json',
          auth: sessionId,
          lang: 'en',
          elid,
          autoprolong,
          addon_961,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        dispatch(actions.hideLoader())
        setAdditionalText(data.doc.orderinfo.$)
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const editDNSWithExtraCosts =
  (elid, autoprolong, addon_961, handleModal) => (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'dnshost.edit',
          out: 'json',
          auth: sessionId,
          lang: 'en',
          elid,
          autoprolong,
          addon_961,
          clicked_button: 'basket',
          sok: 'ok',
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)
        handleModal()

        dispatch(
          cartActions.setCartIsOpenedState({
            isOpened: true,
            redirectPath: route.DNS,
          }),
        )
        dispatch(actions.hideLoader())
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }
const getServiceInstruction = (elid, setInstruction) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'service.instruction.html',
        out: 'json',
        auth: sessionId,
        lang: i18n.language,
        elid,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)
      setInstruction(data.doc.body.$)

      dispatch(actions.hideLoader())
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getDNSFilters =
  (setFilters, data = {}, filtered = false, setEmptyFilter, signal, setIsLoading) =>
  (dispatch, getState) => {
    setIsLoading(true)

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'dnshost.filter',
          out: 'json',
          auth: sessionId,
          lang: 'en',
          ...data,
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        if (filtered) {
          setEmptyFilter && setEmptyFilter(true)
          return dispatch(
            getDNSList({ p_num: 1, p_cnt: data?.p_cnt }, signal, setIsLoading),
          )
        }

        let filters = {}

        data?.doc?.slist?.forEach(el => {
          filters[el.$name] = el.val
        })

        let currentFilters = {
          id: data.doc?.id?.$ || '',
          pricelist: data.doc?.pricelist?.$ || '',
          period: data.doc?.period?.$ || '',
          status: data.doc?.status?.$ || '',
          service_status: data.doc?.service_status?.$ || '',
          opendate: data.doc?.opendate?.$ || '',
          expiredate: data.doc?.expiredate?.$ || '',
          orderdatefrom: data.doc?.orderdatefrom?.$ || '',
          orderdateto: data.doc?.orderdateto?.$ || '',
          cost_from: data.doc?.cost_from?.$ || '',
          cost_to: data.doc?.cost_to?.$ || '',
          autoprolong: data.doc?.autoprolong?.$ || '',
          datacenter: data.doc?.datacenter?.$ || '',
        }

        setFilters({ filters, currentFilters })
        setIsLoading(false)
      })
      .catch(error => {
        if (error.message.includes('filter')) {
          dispatch(getDNSList({ p_num: 1 }, signal, setIsLoading))
        }
        handleLoadersClosing(error?.message, dispatch, setIsLoading)
        checkIfTokenAlive(error.message, dispatch, true)
      })
  }

const getChangeTariffPricelist = (elid, setInitialState) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'service.changepricelist',
        out: 'json',
        auth: sessionId,
        lang: 'en',
        elid,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)
      setInitialState(data.doc)

      dispatch(actions.hideLoader())
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

export default {
  getTarifs,
  getDNSList,
  getParameters,
  updateDNSPrice,
  orderDNS,
  getPrintLicense,
  getCurrentDNSInfo,
  editDNS,
  getDNSExtraPayText,
  editDNSWithExtraCosts,
  getServiceInstruction,
  getDNSFilters,
  getChangeTariffPricelist,
}
