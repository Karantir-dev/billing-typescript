import qs from 'qs'
// import { toast } from 'react-toastify'
import { actions } from '..'
import { axiosInstance } from '../../config/axiosInstance'
import { errorHandler } from '../../utils'
// import i18n from '../../i18n'
// import cartActions from '../cart/cartActions'
// import * as route from '../../routes'
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

        console.log(data, 'data for order dns host')

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

        dispatch(setTarifs(orderData))
        dispatch(actions.hideLoader())
      })
      .catch(error => {
        console.log('error', error)
        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }
console.log('dns operations')
console.log('new in dns')
console.log('new in dns2')

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

        console.log('params', data)

        const { slist: paramsList } = data.doc
        const autoprolong = paramsList?.filter(item => item.$name === 'autoprolong')
        const domainsLimit = data.doc.metadata.form.field.filter(item =>
          item.$name.includes('addon'),
        )

        const maxLimit = domainsLimit[0].slider[0].$max
        const minLimit = domainsLimit[0].slider[0].$step
        const step = domainsLimit[0].slider[0].$min

        const limitsList = []
        let initialLimit = 100
        for (let i = minLimit; i <= maxLimit; i += step) {
          limitsList.push(initialLimit + step)
        }

        console.log(domainsLimit[0].slider[0])

        console.log(maxLimit, minLimit, step)

        // fields

        setFieldValue('autoprolonglList', autoprolong[0].val)
        setFieldValue('autoprolong', autoprolong[0]?.val[1]?.$key)
        setFieldValue('addon_961', domainsLimit)
        setParameters({ paramsList, domainsLimit })
        dispatch(actions.hideLoader())
      })

      .catch(error => {
        console.log('error', error)
        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

// const orderFTP = (autoprolong, datacenter, period, pricelist) => (dispatch, getState) => {
//   dispatch(actions.showLoader())

//   const {
//     auth: { sessionId },
//   } = getState()

//   axiosInstance
//     .post(
//       '/',
//       qs.stringify({
//         func: 'storage.order.param',
//         out: 'json',
//         auth: sessionId,
//         period,
//         datacenter,
//         pricelist,
//         autoprolong,
//         licence_agreement: 'on',
//         clicked_button: 'finish',
//         sok: 'ok',
//         lang: 'en',
//       }),
//     )
//     .then(({ data }) => {
//       if (data.doc.error) throw new Error(data.doc.error.msg.$)

//       dispatch(
//         cartActions.setCartIsOpenedState({
//           isOpened: true,
//           redirectPath: route.FTP,
//         }),
//       )
//       dispatch(actions.hideLoader())
//     })
//     .catch(error => {
//       console.log('error', error)
//       errorHandler(error.message, dispatch)
//       dispatch(actions.hideLoader())
//     })
// }

// const getPrintLicense = priceId => (dispatch, getState) => {
//   const {
//     auth: { sessionId },
//   } = getState()

//   dispatch(actions.showLoader())

//   axiosInstance
//     .post(
//       '/',
//       qs.stringify({
//         func: 'license.print',
//         out: 'doc_print',
//         auth: sessionId,
//         elid: priceId,
//       }),
//       { responseType: 'blob' },
//     )
//     .then(response => {
//       const url = window.URL.createObjectURL(
//         new Blob([response.data], { type: 'text/html' }),
//       )
//       const link = document.createElement('a')
//       link.href = url
//       link.setAttribute('target', '_blank')
//       document.body.appendChild(link)
//       link.click()
//       link.parentNode.removeChild(link)

//       dispatch(actions.hideLoader())
//     })
//     .catch(error => {
//       console.log('error', error)
//       errorHandler(error.message, dispatch)
//       dispatch(actions.hideLoader())
//     })
// }

// const getCurrentStorageInfo = (elid, setInitialParams) => (dispatch, getState) => {
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
//       }),
//     )
//     .then(({ data }) => {
//       if (data.doc.error) throw new Error(data.doc.error.msg.$)

//       const autoprolongList = data.doc.slist.filter(
//         item => item.$name === 'autoprolong',
//       )[0]
//       const payment_method = data.doc.slist.filter(
//         item => item.$name === 'stored_method',
//       )[0]

//       const {
//         user,
//         autoprolong,
//         opendate,
//         passwd,
//         period,
//         name,
//         id,
//         expiredate,
//         createdate,
//       } = data.doc

//       setInitialParams({
//         autoprolongList,
//         autoprolong,
//         opendate,
//         passwd,
//         period,
//         name,
//         user,
//         id,
//         expiredate,
//         createdate,
//         payment_method,
//       })
//       dispatch(actions.hideLoader())
//     })
//     .catch(error => {
//       console.log('error', error)
//       errorHandler(error.message, dispatch)
//       dispatch(actions.hideLoader())
//     })
// }

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
  // orderFTP,
  // getPrintLicense,
  // getCurrentStorageInfo,
  // editFTP,
  // getServiceInstruction,
  // getFTPFilters,
}
