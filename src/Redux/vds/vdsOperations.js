import qs from 'qs'
import { axiosInstance } from './../../config/axiosInstance'
import { actions, cartActions } from '../'
import authSelectors from '../auth/authSelectors'
import * as routes from '../../routes'
import { errorHandler, renameAddonFields } from '../../utils'

const getVDS = setServers => (dispatch, getState) => {
  dispatch(actions.showLoader())
  const sessionId = authSelectors.getSessionId(getState())

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'vds',
        auth: sessionId,
        out: 'json',
      }),
    )
    .then(({ data }) => {
      if (data.doc?.error) throw new Error(data.doc.error.msg.$)

      setServers(data.doc.elem)

      dispatch(actions.hideLoader())
    })
    .catch(err => {
      errorHandler(err.message, dispatch)
      dispatch(actions.hideLoader())
      console.log('getVDS - ', err.message)
    })
}

const getEditFieldsVDS = (elid, setInitialState) => (dispatch, getState) => {
  dispatch(actions.showLoader())
  const sessionId = authSelectors.getSessionId(getState())

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'vds.edit',
        auth: sessionId,
        elid,
        out: 'json',
      }),
    )
    .then(({ data }) => {
      if (data.doc?.error) throw new Error(data.doc.error.msg.$)

      setInitialState(data.doc)

      dispatch(actions.hideLoader())
    })
    .catch(err => {
      errorHandler(err.message, dispatch)
      dispatch(actions.hideLoader())
      console.log('getEditFieldsVDS - ', err.message)
    })
}

const editVDS =
  (elid, values, selectedField, mutateOptionsListData, setOrderInfo) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())
    const sessionId = authSelectors.getSessionId(getState())

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'vds.edit',
          auth: sessionId,
          elid,
          autoprolong: values.autoprolong,
          addon_5772: values.license,
          [selectedField ? 'sv_field' : '']: selectedField,
          sok: 'ok',
          out: 'json',
        }),
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)

        const newAutoprolongList = data.doc?.slist?.[0]?.val
        mutateOptionsListData && mutateOptionsListData(newAutoprolongList)

        if (data.doc?.orderinfo?.$) {
          const price = data.doc?.orderinfo?.$.match(/(?<=Total amount: )(.+?)(?= EUR)/g)
          let description = data.doc?.orderinfo?.$.match(
            /(?<=Control panel )(.+?)(?=<br\/>)/g,
          )[0].split(' - ')[2]
          description = `(${description})`

          setOrderInfo({ price, description })
        } else {
          setOrderInfo(null)
        }

        dispatch(actions.hideLoader())
      })
      .catch(err => {
        errorHandler(err.message, dispatch)
        dispatch(actions.hideLoader())
        console.log('editVDS - ', err.message)
      })
  }

const getVDSOrderInfo = (setFormInfo, setTariffsList) => (dispatch, getState) => {
  dispatch(actions.showLoader())
  const sessionId = authSelectors.getSessionId(getState())

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'vds.order',
        auth: sessionId,
        out: 'json',
      }),
    )
    .then(({ data }) => {
      if (data.doc?.error) throw new Error(data.doc.error.msg.$)
      console.log(data.doc)

      setFormInfo(data.doc)
      setTariffsList(data.doc.list[0].elem)

      dispatch(actions.hideLoader())
    })
    .catch(err => {
      errorHandler(err.message, dispatch)
      dispatch(actions.hideLoader())
      console.log('getVDSOrderInfo - ', err.message)
    })
}

const getNewPeriodInfo = (period, setTariffsList) => (dispatch, getState) => {
  dispatch(actions.showLoader())
  const sessionId = authSelectors.getSessionId(getState())

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'vds.order.pricelist',
        auth: sessionId,
        out: 'json',
        period: period,
        sv_field: 'period',
      }),
    )
    .then(({ data }) => {
      if (data.doc?.error) throw new Error(data.doc.error.msg.$)
      console.log(data.doc)
      setTariffsList(data.doc.list[0].elem)
      dispatch(actions.hideLoader())
    })
    .catch(err => {
      errorHandler(err.message, dispatch)
      dispatch(actions.hideLoader())
      console.log('getNewPeriodInfo - ', err.message)
    })
}

const getTariffParameters =
  (period, pricelist, setParametersInfo) => (dispatch, getState) => {
    dispatch(actions.showLoader())
    const sessionId = authSelectors.getSessionId(getState())

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'vds.order.pricelist',
          auth: sessionId,
          out: 'json',
          snext: 'ok',
          sok: 'ok',
          period: period,
          pricelist: pricelist,
          lang: 'en',
        }),
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)

        console.log(data.doc)
        setParametersInfo(renameAddonFields(data.doc))

        dispatch(actions.hideLoader())
      })
      .catch(err => {
        errorHandler(err.message, dispatch)
        dispatch(actions.hideLoader())
        console.log('getTariffParameters - ', err)
      })
  }

const changeOrderFormField =
  (period, values, pricelist, fieldName, setParametersInfo, register) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())
    const sessionId = authSelectors.getSessionId(getState())

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'vds.order.param',
          auth: sessionId,
          out: 'json',
          period: period,
          pricelist: pricelist,
          ostempl: values.ostempl,
          domain: values.domain,
          recipe: values.recipe,
          autoprolong: values.autoprolong,
          [register.CPU_count]: values.CPU_count,
          [register.Control_panel]: values.Control_panel,
          [register.Disk_space]: values.Disk_space,
          [register.IP_addresses_count]: values.IP_addresses_count,
          [register.Memory]: values.Memory,
          [register.Port_speed]: values.Port_speed.slice(0, 3),
          sv_field: fieldName,
        }),
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)

        console.log(data.doc)
        data.doc.doc.messages = data.doc.messages
        data.doc.doc.slist.forEach(el => {
          if (el.$name === 'autoprolong') {
            el.val = data.doc.slist[0].val
          }

          if (!Array.isArray(el.val)) {
            el.val = [el.val]
          }
        })

        setParametersInfo(renameAddonFields(data.doc.doc))

        dispatch(actions.hideLoader())
      })
      .catch(err => {
        errorHandler(err.message, dispatch)
        dispatch(actions.hideLoader())
        console.log('changeOrderFormField - ', err)
      })
  }

const setOrderData =
  (period, count, values, pricelist, register) => (dispatch, getState) => {
    dispatch(actions.showLoader())
    const sessionId = authSelectors.getSessionId(getState())

    // console.log({
    //   auth: sessionId,
    //   period: period,
    //   pricelist: pricelist,
    //   ostempl: values.ostempl,
    //   autoprolong: values.autoprolong,
    //   domain: values.domain,
    //   recipe: values.recipe,
    //   [register.CPU_count]: values.CPU_count,
    //   [register.Control_panel]: values.Control_panel,
    //   [register.Disk_space]: values.Disk_space,
    //   [register.IP_addresses_count]: values.IP_addresses_count,
    //   [register.Memory]: values.Memory,
    //   [register.Port_speed]: values.Port_speed.slice(0, 3),
    //   licence_agreement: values.agreement,
    //   order_count: String(count),
    // })

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'vds.order.param',
          auth: sessionId,
          out: 'json',
          sok: 'ok',
          period: period,
          pricelist: pricelist,
          ostempl: values.ostempl,
          autoprolong: values.autoprolong,
          domain: values.domain,
          recipe: values.recipe,
          [register.CPU_count]: values.CPU_count,
          [register.Control_panel]: values.Control_panel,
          [register.Disk_space]: values.Disk_space,
          [register.IP_addresses_count]: values.IP_addresses_count,
          [register.Memory]: values.Memory,
          [register.Port_speed]: values.Port_speed.slice(0, 3),
          licence_agreement: values.agreement,
          order_count: String(count),
        }),
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)

        console.log(data.doc)
        dispatch(
          cartActions.setCartIsOpenedState({
            isOpened: true,
            redirectPath: routes.VDS,
          }),
        )
        dispatch(actions.hideLoader())
      })
      .catch(err => {
        errorHandler(err.message, dispatch)
        dispatch(actions.hideLoader())
        console.log('setOrderData - ', err)
      })
  }

export default {
  getVDS,
  getEditFieldsVDS,
  editVDS,
  getVDSOrderInfo,
  getNewPeriodInfo,
  getTariffParameters,
  changeOrderFormField,
  setOrderData,
}
