import qs from 'qs'
// import { toast } from 'react-toastify'
import { actions } from '..'
import { axiosInstance } from '../../config/axiosInstance'
import { errorHandler } from '../../utils'
import ftpActions from './ftpActions'
// import dedicActions from './ftpActions'
// import i18n from '../../i18n'
import cartActions from '../cart/cartActions'
import * as route from '../../routes'

//GET SERVERS OPERATIONS

const getFTPList = () => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'storage',
        out: 'json',
        auth: sessionId,
        lang: 'en',
        clickstat: 'yes',
        // sok: 'ok',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      dispatch(ftpActions.setFTPList(data.doc.elem ? data.doc.elem : []))
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
          func: 'storage.order',
          out: 'json',
          auth: sessionId,
          lang: 'en',
          ...data,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        console.log(data, 'tarifffffs')

        // const { val: fpricelist } = data.doc.flist
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
          func: 'storage.order.pricelist',
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

        // fields

        setFieldValue('autoprolonglList', autoprolong[0].val)
        setFieldValue('autoprolong', autoprolong[0]?.val[1]?.$key)
        setParameters(paramsList)
        dispatch(actions.hideLoader())
      })

      .catch(error => {
        console.log('error', error)
        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const orderFTP = (autoprolong, datacenter, period, pricelist) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'storage.order.param',
        out: 'json',
        auth: sessionId,
        period,
        datacenter,
        pricelist,
        autoprolong,
        licence_agreement: 'on',
        clicked_button: 'finish',
        sok: 'ok',
        lang: 'en',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      dispatch(
        cartActions.setCartIsOpenedState({
          isOpened: true,
          redirectPath: route.DEDICATED_SERVERS,
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
  getTarifs,
  getFTPList,
  getParameters,
  orderFTP,
}
