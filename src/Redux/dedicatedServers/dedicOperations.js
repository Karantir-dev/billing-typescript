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
      console.log('got tariffs', data)
      const { val: fpricelist } = data.doc.flist
      const { elem: tarifList } = data.doc.list[0]
      const { val: datacenter } = data.doc.slist[0]
      const { val: period } = data.doc.slist[0]
      const { $: currentDatacenter } = data.doc.datacenter

      const orderData = {
        fpricelist,
        tarifList,
        datacenter,
        period,
        currentDatacenter,
      }

      console.log('tariffs, first page', data)
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
      const { val: period } = data.doc.slist[0]

      const orderData = {
        fpricelist,
        tarifList,
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

const getUpdatedPeriod = (period, datacenter, setNewPeriod) => (dispatch, getState) => {
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
        datacenter,
        lang: 'en',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)
      const { val: fpricelist } = data.doc.flist
      const { elem: tarifList } = data.doc.list[0]
      // const { val: datacenter } = data.doc.slist[0]
      const { val: period } = data.doc.slist[0]

      const orderData = {
        fpricelist,
        tarifList,
        period,
      }

      setNewPeriod(orderData)
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      errorHandler(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getParameters =
  (period, datacenter, pricelist, setFieldValue) => (dispatch, getState) => {
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
        console.log('params', data)
        const IP = Object.keys(data.doc)
        const currentSumIp = IP.filter(
          item => item.includes('addon') && item.includes('current_value'),
        )

        // setParameters([
        //   ...data.doc.slist,
        //   ...[{ $name: currentSumIp.join('').slice(0, 10) }],
        // ])

        const { slist: paramsList } = data.doc

        const ostempl = paramsList?.filter(item => item.$name === 'ostempl')
        const recipe = paramsList?.filter(item => item.$name === 'recipe')
        const managePanel = paramsList?.filter(item => item.$name.includes('addon'))
        const portSpeed = paramsList?.filter(item => item.$name.includes('addon'))
        const autoprolong = paramsList?.filter(item => item.$name === 'autoprolong')
        const ipName = currentSumIp.join('').slice(0, 10).slice(-1)[0]?.$name

        // setParameters([
        //   ...data.doc.slist,
        //   ...[{ $name: currentSumIp.join('').slice(0, 10) }],
        // ])

        setFieldValue('ostemplList', ostempl[0].val)
        setFieldValue('recipelList', recipe[0].val)
        setFieldValue('managePanellList', managePanel[0].val)
        setFieldValue('portSpeedlList', portSpeed[0].val)
        setFieldValue('autoprolonglList', autoprolong[0].val)
        setFieldValue('ipName', ipName)
        // setFieldValue('ostemplList', ostempl)
        // setFieldValue('ostemplList', ostempl)

        dispatch(actions.hideLoader())
      })

      .catch(error => {
        console.log('error', error)
        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const updatePrice =
  (
    datacenter,
    period,
    pricelist,
    domain,
    ostempl,
    recipe,
    portSpeed,
    portSpeedName,
    managePanelName,
    ipTotal,
    ipName,
    managePanel,
    updatePrice,
  ) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    console.log('managePanelName', managePanelName)
    console.log('ipName', ipName)

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
          [managePanelName]: managePanel,
          // licence_agreement: 'on',
          snext: 'ok',
          sok: 'ok',
          lang: 'en',
          [ipName]: ipTotal,
        }),
      )
      .then(({ data }) => {
        console.log(data, 'newPrice')
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        let price = data.doc.orderinfo.$.split('Total amount:')[1].replace(' </b>', '')

        updatePrice(price)
        dispatch(actions.hideLoader())
      })
      .catch(error => {
        console.log('error', error)
        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const orderServer =
  (
    autoprolong,
    datacenter,
    period,
    pricelist,
    domain,
    ostempl,
    recipe,
    portSpeed,
    portSpeedName,
    managePanelName,
    ipTotal,
    ipName,
    setParameters,
  ) =>
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
          autoprolong,
          domain,
          ostempl,
          [portSpeedName]: recipe,
          [managePanelName]: portSpeed,
          licence_agreement: 'on',
          snext: 'ok',
          sok: 'ok',
          lang: 'en',
          [ipName]: ipTotal,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        setParameters(false)
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
  updatePrice,
}
