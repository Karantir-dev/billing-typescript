import qs from 'qs'
import { axiosInstance } from './../../config/axiosInstance'
import { actions } from '../'
import authSelectors from '../auth/authSelectors'
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
  (period, value, pricelist, fieldName, mutateOptionsListData) =>
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
          sv_field: fieldName,
          [fieldName]: value,
        }),
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)

        console.log(data.doc)
        let autoprolongList
        let orderinfo
        if (data.doc.slist) {
          autoprolongList = data.doc.slist[0].val
          orderinfo = data.doc.orderinfo.$
        } else {
          autoprolongList = data.doc.doc.slist[0].val
          orderinfo = data.doc.doc.orderinfo.$
        }
        mutateOptionsListData(autoprolongList, orderinfo)

        dispatch(actions.hideLoader())
      })
      .catch(err => {
        errorHandler(err.message, dispatch)
        dispatch(actions.hideLoader())
        console.log('changeOrderFormField - ', err)
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
}
