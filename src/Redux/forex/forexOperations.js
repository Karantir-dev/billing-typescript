import qs from 'qs'
import { toast } from 'react-toastify'
import { axiosInstance } from '@config/axiosInstance'
import { checkIfTokenAlive, handleLoadersClosing } from '@utils'
import i18n from '@src/i18n'
import * as route from '@src/routes'
import { actions, cartActions, forexActions } from '@redux'

//GET hostings OPERATIONS
const getForexList = (data, signal, setIsLoading) => (dispatch, getState) => {
  setIsLoading ? setIsLoading(true) : dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'forexbox',
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

      const forexRenderData = {
        forexList: data.doc.elem ? data.doc.elem : [],
        forexPageRights: data.doc.metadata.toolbar,
      }

      const count = data?.doc?.p_elems?.$ || 0

      dispatch(forexActions.setForexList(forexRenderData))
      dispatch(forexActions.setForexCount(count))
      // setForexList(data.doc.elem ? data.doc.elem : [])
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
          func: 'forexbox.order',
          out: 'json',
          auth: sessionId,
          lang: 'en',
          ...data,
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        const { elem: tarifList } = data.doc.list[0]
        const { val: datacenter } = data.doc.slist.length > 1 ? data.doc.slist[0] : []
        const { val: period } = data.doc.slist[0]
        const { $: currentDatacenter } = data.doc.datacenter

        const transformedTarifList = tarifList?.map(elem => {
          const currentForexRate = elem?.desc?.$?.split(' ')[2]

          elem.countTerminal = currentForexRate
          elem.countRAM = currentForexRate
          // if (index === 0 || index === 1) {
          //   elem.countRAM = 1
          // } else {
          //   elem.countRAM = currentForexRate * 0.5
          // }
          elem.countMemory = currentForexRate * 3 + ' ' + 'Gb'
          elem.osName = 'Windows'

          return elem
        })

        const orderData = {
          transformedTarifList,
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
          func: 'forexbox.order.pricelist',
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

        const { slist: paramsList, server_package } = data.doc
        const autoprolong = paramsList?.filter(item => item.$name === 'autoprolong')

        // fields

        setFieldValue('autoprolonglList', autoprolong[0].val)
        setFieldValue('autoprolong', autoprolong[0]?.val[1]?.$key)
        setFieldValue('server_package', server_package?.$)

        setParameters({ paramsList })
        setIsLoading(false)
      })

      .catch(error => {
        handleLoadersClosing(error?.message, dispatch, setIsLoading)
        checkIfTokenAlive(error.message, dispatch, true)
      })
  }

const orderForex =
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
          func: 'forexbox.order.param',
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
            redirectPath: route.FOREX,
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

const getCurrentForexInfo =
  (elid, setInitialParams, autoprolong) => (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'forexbox.edit',
          out: 'json',
          auth: sessionId,
          lang: 'en',
          elid,
          autoprolong,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        const autoprolongList = data?.doc?.slist?.filter(
          item => item.$name === 'autoprolong',
        )[0].val
        const paymentMethodList = data?.doc?.slist?.filter(
          item => item.$name === 'stored_method',
        )[0].val

        const serverPackageList = data?.doc?.slist?.filter(
          item => item.$name === 'server_package',
        )[0].val

        const {
          autoprolong,
          opendate,
          period,
          name,
          id,
          expiredate,
          createdate,
          server_ip,
          server_name,
          server_hostname,
          server_package,
          server_password,
          server_user,
          url_rdp,
          stored_method,
        } = data.doc

        setInitialParams({
          autoprolong,
          opendate,
          period,
          id,
          expiredate,
          createdate,
          name,
          server_ip,
          server_name,
          server_hostname,
          server_package,
          server_password,
          server_user,
          paymentMethodList,
          serverPackageList,
          autoprolongList,
          url_rdp,
          stored_method,
        })
        dispatch(actions.hideLoader())
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const editForex = (values, elid, handleModal) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'forexbox.edit',
        out: 'json',
        auth: sessionId,
        lang: 'en',
        elid,
        clicked_button: 'ok',
        sok: 'ok',
        ...values,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      dispatch(getForexList({ p_num: 1 }))

      toast.success(i18n.t('Changes saved successfully', { ns: 'other' }), {
        position: 'bottom-right',
        toastId: 'customId',
      })
      dispatch(actions.hideLoader())

      handleModal && handleModal()
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const deleteForex = (elid, handleModal) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'forexbox.delete',
        out: 'json',
        auth: sessionId,
        lang: 'en',
        elid,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      dispatch(getForexList({ p_num: 1 }))

      dispatch(actions.hideLoader())
      handleModal()

      toast.success(i18n.t('Service has been successfully removed', { ns: 'other' }), {
        position: 'bottom-right',
        toastId: 'customId',
      })
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getForexFilters =
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
          func: 'forexbox.filter',
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
            getForexList({ p_num: 1, p_cnt: data?.p_cnt }, signal, setIsLoading),
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
          dispatch(getForexList({ p_num: 1 }, signal, setIsLoading))
        }
        handleLoadersClosing(error?.message, dispatch, setIsLoading)
        checkIfTokenAlive(error.message, dispatch, true)
      })
  }

export default {
  getForexList,
  getTarifs,
  getParameters,
  orderForex,
  getPrintLicense,
  getCurrentForexInfo,
  editForex,
  getForexFilters,
  deleteForex,
}
