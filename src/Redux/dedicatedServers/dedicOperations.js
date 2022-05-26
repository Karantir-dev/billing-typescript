import qs from 'qs'
import { actions } from '..'
import { axiosInstance } from '../../config/axiosInstance'
import { errorHandler } from '../../utils'
import dedicActions from './dedicActions'

const getTarifs = () => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'dedic.order',
        out: 'json',
        auth: sessionId,
        lang: 'en',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)
      const { val: fpricelist } = data.doc.flist
      const { elem: tarifList } = data.doc.list[0]
      const { val: datacenter } = data.doc.slist[0]
      const { val: period } = data.doc.slist[1]

      const orderData = {
        fpricelist,
        tarifList,
        datacenter,
        period,
      }

      dispatch(dedicActions.setTarifList(orderData))

      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      errorHandler(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getUpdatedTarrifs = (datacenterId, setNewTariffs) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'dedic.order',
        out: 'json',
        auth: sessionId,
        datacenter: datacenterId,
        lang: 'en',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)
      const { val: fpricelist } = data.doc.flist
      const { elem: tarifList } = data.doc.list[0]
      const { val: datacenter } = data.doc.slist[0]
      const { val: period } = data.doc.slist[1]

      const orderData = {
        fpricelist,
        tarifList,
        datacenter,
        period,
      }

      setNewTariffs(orderData)

      // dispatch(dedicActions.setTarifList(orderData))

      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      errorHandler(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getUpdatedPeriod = (period, setNewPeriod) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'dedic.order',
        out: 'json',
        auth: sessionId,
        period,
        lang: 'en',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)
      const { val: fpricelist } = data.doc.flist
      const { elem: tarifList } = data.doc.list[0]
      const { val: datacenter } = data.doc.slist[0]
      const { val: period } = data.doc.slist[1]

      const orderData = {
        fpricelist,
        tarifList,
        datacenter,
        period,
      }

      setNewPeriod(orderData)

      console.log('orderData', orderData)

      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      errorHandler(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getParameters =
  (period, datacenter, pricelist, setParameters) => (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'dedic.order.pricelist',
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
        console.log(data)

        setParameters(data.doc.slist)

        dispatch(actions.hideLoader())
      })
      .catch(error => {
        console.log('error', error)
        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const orderServer =
  (period, datacenter, pricelist, autoprolong, domain, setParameters) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'dedic.order.param',
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
        console.log(data)

        setParameters(data.doc.slist)

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
  getUpdatedTarrifs,
  getUpdatedPeriod,
  getParameters,
  orderServer,
}
