import qs from 'qs'
// import { toast } from 'react-toastify'
import { actions } from '..'
import { axiosInstance } from '../../config/axiosInstance'
import { errorHandler } from '../../utils'
// import i18n from '../../i18n'
import cartActions from '../cart/cartActions'
import * as route from '../../routes'
import dnsActions from './dnsActions'

//GET hostings OPERATIONS

const getDNSList = () => (dispatch, getState) => {
  dispatch(actions.showLoader())

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
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      dispatch(dnsActions.setDNSList(data.doc.elem ? data.doc.elem : []))
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      errorHandler(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getTarifs =
  (setTarifs, data = {}) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())

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
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        const { elem: tarifList } = data.doc.list[0]
        const { val: datacenter } = data.doc.slist.length > 1 ? data.doc.slist[0] : []
        const { val: period } = data.doc.slist[0]
        const { $: currentDatacenter } = data.doc.datacenter

        const orderData = {
          tarifList,
          datacenter,
          period,
          currentDatacenter,
        }

        setTarifs(orderData)
        dispatch(actions.hideLoader())
      })
      .catch(error => {
        console.log('error', error)
        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const getParameters =
  (period, datacenter, pricelist, setParameters, setFieldValue) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())

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
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        const { slist: paramsList } = data.doc
        const autoprolong = paramsList?.filter(item => item.$name === 'autoprolong')
        const domainsLimit = data.doc.metadata.form.field.filter(item =>
          item.$name.includes('addon'),
        )

        const maxLimit = domainsLimit[0].slider[0].$max
        const step = domainsLimit[0].slider[0].$step
        const minLimit = domainsLimit[0].slider[0].$min

        const limitsList = []
        let initialLimit = +minLimit
        limitsList.push(+minLimit)
        while (+initialLimit < +maxLimit) {
          limitsList.push(Number(initialLimit) + Number(step))
          initialLimit += +step
        }

        // fields

        setFieldValue('autoprolonglList', autoprolong[0].val)
        setFieldValue('autoprolong', autoprolong[0]?.val[1]?.$key)
        setFieldValue('addon_961', limitsList[0])
        setFieldValue('limitsList', limitsList)
        setParameters({ paramsList })
        dispatch(actions.hideLoader())
      })

      .catch(error => {
        console.log('error', error)
        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const updateDNSPrice =
  (setNewPrice, data = {}) =>
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
          lang: 'en',
          ...data,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)
        const price = data.doc.orderinfo.$.split('Total amount:')[1].split(' ')[1]

        setNewPrice(price)
        dispatch(actions.hideLoader())
      })
      .catch(error => {
        console.log('error', error)
        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
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
        console.log('error', error)
        errorHandler(error.message, dispatch)
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
      console.log(priceId, 'priceid')
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
      console.log('error', error)
      errorHandler(error.message, dispatch)
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

      console.log(data.doc)

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
      })
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      errorHandler(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

// const editFTP = (elid, autoprolong, handleModal) => (dispatch, getState) => {
//   dispatch(actions.showLoader())

//   const {
//     auth: { sessionId },
//   } = getState()

//   axiosInstance
//     .post(
//       '/',
//       qs.stringify({
//         func: 'storage.edit',
//         out: 'json',
//         auth: sessionId,
//         lang: 'en',
//         elid,
//         autoprolong,
//         clicked_button: 'ok',
//         sok: 'ok',
//       }),
//     )
//     .then(({ data }) => {
//       if (data.doc.error) throw new Error(data.doc.error.msg.$)

//       toast.success(i18n.t('Changes saved successfully', { ns: 'other' }), {
//         position: 'bottom-right',
//         toastId: 'customId',
//       })
//       dispatch(actions.hideLoader())

//       handleModal()
//     })
//     .catch(error => {
//       console.log('error', error)
//       errorHandler(error.message, dispatch)
//       dispatch(actions.hideLoader())
//     })
// }

// const getServiceInstruction = (elid, setInstruction) => (dispatch, getState) => {
//   dispatch(actions.showLoader())

//   const {
//     auth: { sessionId },
//   } = getState()

//   axiosInstance
//     .post(
//       '/',
//       qs.stringify({
//         func: 'service.instruction.html',
//         out: 'json',
//         auth: sessionId,
//         lang: 'en',
//         elid,
//       }),
//     )
//     .then(({ data }) => {
//       if (data.doc.error) throw new Error(data.doc.error.msg.$)
//       setInstruction(data.doc.body)

//       dispatch(actions.hideLoader())
//     })
//     .catch(error => {
//       console.log('error', error)
//       errorHandler(error.message, dispatch)
//       dispatch(actions.hideLoader())
//     })
// }

// const getFTPFilters =
//   (setFilters, data = {}, filtered = false) =>
//   (dispatch, getState) => {
//     dispatch(actions.showLoader())

//     const {
//       auth: { sessionId },
//     } = getState()

//     axiosInstance
//       .post(
//         '/',
//         qs.stringify({
//           func: 'storage.filter',
//           out: 'json',
//           auth: sessionId,
//           ...data,
//         }),
//       )
//       .then(({ data }) => {
//         if (data.doc.error) throw new Error(data.doc.error.msg.$)

//         console.log(filtered)
//         // if (filtered) {
//         //   return dispatch(getFTPList())
//         // }

//         let filters = {}

//         data?.doc?.slist?.forEach(el => {
//           filters[el.$name] = el.val
//         })

//         let currentFilters = {
//           id: data.doc?.id?.$ || '',
//           domain: data.doc?.domain?.$ || '',
//           ip: data.doc?.ip?.$ || '',
//           pricelist: data.doc?.pricelist?.$ || '',
//           period: data.doc?.period?.$ || '',
//           status: data.doc?.status?.$ || '',
//           service_status: data.doc?.service_status?.$ || '',
//           opendate: data.doc?.opendate?.$ || '',
//           expiredate: data.doc?.expiredate?.$ || '',
//           orderdatefrom: data.doc?.orderdatefrom?.$ || '',
//           orderdateto: data.doc?.orderdateto?.$ || '',
//           cost_from: data.doc?.cost_from?.$ || '',
//           cost_to: data.doc?.cost_to?.$ || '',
//           autoprolong: data.doc?.autoprolong?.$ || '',
//           datacenter: data.doc?.datacenter?.$ || '',
//           ostemplate: '',
//         }

//         setFilters({ filters, currentFilters })
//         dispatch(actions.hideLoader())
//       })
//       .catch(error => {
//         console.log('error', error)
//         errorHandler(error.message, dispatch)
//         dispatch(actions.hideLoader())
//       })
//   }

export default {
  getTarifs,
  getDNSList,
  getParameters,
  updateDNSPrice,
  orderDNS,
  // orderFTP,
  getPrintLicense,
  getCurrentDNSInfo,
  // getCurrentStorageInfo,
  // editFTP,
  // getServiceInstruction,
  // getFTPFilters,
}
