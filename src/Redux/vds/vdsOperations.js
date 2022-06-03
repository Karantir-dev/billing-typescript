import qs from 'qs'
import { axiosInstance } from './../../config/axiosInstance'
import { actions } from '../'
import authSelectors from '../auth/authSelectors'
import { errorHandler } from '../../utils'

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
      console.log(data.doc)
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
        console.log(data.doc)

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

export default {
  getVDS,
  getEditFieldsVDS,
  editVDS,
}
