/* eslint-disable no-unused-vars */
import qs from 'qs'
import {
  actions,
  authSelectors,
  cartActions,
  cloudVpsActions,
  cloudVpsSelectors,
} from '@redux'
import { toast } from 'react-toastify'
import { axiosInstance } from '@config/axiosInstance'
import { checkIfTokenAlive, handleLoadersClosing, renameAddonFields } from '@utils'
import { t } from 'i18next'
import * as routes from '@src/routes'
import { DC_ID_IN, FOTBO_STATUSES_LIST } from '@utils/constants'

const getInstances =
  ({
    p_cnt,
    p_num,
    p_col,
    signal,
    setIsLoading,
    isLoader = true,
    setLocalInstancesItems,
  }) =>
  (dispatch, getState) => {
    isLoader && (setIsLoading ? setIsLoading(true) : dispatch(actions.showLoader()))
    const sessionId = authSelectors.getSessionId(getState())

    return axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'instances',
          out: 'json',
          auth: sessionId,
          p_cnt,
          p_num,
          p_col,
          lang: 'en',
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)

        const elemsList = data.doc.elem || []

        if (setLocalInstancesItems) {
          setLocalInstancesItems(elemsList)
        } else {
          dispatch(cloudVpsActions.setInstancesList(elemsList))
          dispatch(cloudVpsActions.setInstancesCount(data.doc.p_elems.$))
        }

        return axiosInstance.post(
          '/',
          qs.stringify({
            func: 'instances.filter',
            out: 'json',
            auth: sessionId,
            lang: 'en',
          }),
          { signal },
        )
      })
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)
        data.doc?.slist?.forEach(el => {
          el.val.unshift({ $key: '', $: 'Not selected' })
        })
        const filtersList = {
          autoprolong: data.doc?.slist?.find(el => el.$name === 'autoprolong')?.val,
          status: data.doc?.slist?.find(el => el.$name === 'status')?.val,
          datacenter: data.doc?.slist?.find(el => el.$name === 'datacenter')?.val,
          period: data.doc?.slist?.find(el => el.$name === 'period')?.val,
          pricelist: data.doc?.slist?.find(el => el.$name === 'pricelist')?.val,
          fotbo_status: FOTBO_STATUSES_LIST,
        }
        const active = {
          id: data.doc?.id?.$ || '',
          ip: data.doc?.ip?.$ || '',
          pricelist: data.doc?.pricelist?.$ || '',
          fotbo_status: data.doc?.fotbo_status?.$ || '',
          orderdatefrom: data.doc?.orderdatefrom?.$ || '',
          orderdateto: data.doc?.orderdateto?.$ || '',
          cost_from: data.doc?.cost_from?.$ || '',
          cost_to: data.doc?.cost_to?.$ || '',
          datacenter: data.doc?.datacenter?.$ || '',
        }
        dispatch(cloudVpsActions.setInstancesFilters({ active, filtersList }))
        handleLoadersClosing('closeLoader', dispatch, setIsLoading)
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        handleLoadersClosing(error?.message, dispatch, setIsLoading)
      })
  }

const setInstancesFilter =
  ({ values, signal, setIsLoading, successCallback }) =>
  (dispatch, getState) => {
    setIsLoading ? setIsLoading(true) : dispatch(actions.showLoader())
    const sessionId = authSelectors.getSessionId(getState())

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'instances.filter',
          out: 'json',
          auth: sessionId,
          sok: 'ok',
          lang: 'en',
          autoprolong: values?.autoprolong || '',
          cost_from: values?.cost_from || '',
          cost_to: values?.cost_to || '',
          datacenter: values?.datacenter || '',
          domain: values?.domain || '',
          expiredate: values?.expiredate || '',
          id: values?.id || '',
          ip: values?.ip || '',
          opendate: values?.opendate || '',
          orderdatefrom: values?.orderdatefrom || '',
          orderdateto: values?.orderdateto || '',
          period: values?.period || '',
          pricelist: values?.pricelist || '',
          fotbo_status: values?.fotbo_status || '',
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)
        successCallback()
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        handleLoadersClosing(error?.message, dispatch, setIsLoading)
      })
  }

const editInstance =
  ({
    values,
    elid,
    errorCallback = () => {},
    closeModal = () => {},
    successCallback,
    setIsLoading,
    signal,
  }) =>
  (dispatch, getState) => {
    setIsLoading ? setIsLoading(true) : dispatch(actions.showLoader())
    const sessionId = authSelectors.getSessionId(getState())

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'instances.edit',
          out: 'json',
          sok: 'ok',
          auth: sessionId,
          elid,
          lang: 'en',
          clicked_button: 'ok',
          ...values,
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)
        successCallback()
        closeModal()
        handleLoadersClosing('closeLoader', dispatch, setIsLoading)
        toast.success(t('Changes saved successfully', { ns: 'other' }))
      })
      .catch(error => {
        errorCallback()
        closeModal()
        checkIfTokenAlive(error.message, dispatch)
        handleLoadersClosing(error?.message, dispatch, setIsLoading)
      })
  }

const deleteInstance =
  ({ elid, closeModal, successCallback }) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())
    const sessionId = authSelectors.getSessionId(getState())

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'instances.delete',
          auth: sessionId,
          elid,
          out: 'json',
          lang: 'en',
        }),
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)
        successCallback()
        closeModal()
        toast.success(t('server_deleted_success', { ns: 'other', id: `#${elid}` }))
        dispatch(actions.hideLoader())
      })
      .catch(err => {
        checkIfTokenAlive(err.message, dispatch)
        closeModal()
        dispatch(actions.hideLoader())
      })
  }

const serviceActionRequest = ({ elid, action, sessionId, ...params }) => {
  return axiosInstance.post(
    '/',
    qs.stringify({
      func: `service.${action}`,
      auth: sessionId,
      elid,
      out: 'json',
      lang: 'en',
      ...params,
    }),
  )
}

const changeInstanceState =
  ({ action, elid, closeModal, successCallback }) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())
    const sessionId = authSelectors.getSessionId(getState())

    serviceActionRequest({ elid, action, sessionId })
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)

        successCallback()
        closeModal()
        toast.success(`Server ${action}ed`)
        dispatch(actions.hideLoader())
      })
      .catch(err => {
        checkIfTokenAlive(err.message, dispatch)
        closeModal()
        dispatch(actions.hideLoader())
      })
  }

const getTariffsListToChange = (elid, setTariffs, closeModal) => (dispatch, getState) => {
  dispatch(actions.showLoader())
  const sessionId = authSelectors.getSessionId(getState())
  serviceActionRequest({ elid, action: 'changepricelist', sessionId })
    .then(({ data }) => {
      if (data.doc?.error) throw new Error(data.doc.error.msg.$)
      const tariffs = data.doc.slist.find(item => item.$name === 'pricelist')?.val
      setTariffs(tariffs)
      dispatch(actions.hideLoader())
    })
    .catch(err => {
      checkIfTokenAlive(err.message, dispatch)
      closeModal()
      dispatch(actions.hideLoader())
    })
}
const changeTariff =
  ({ elid, pricelist, successCallback }) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())
    const sessionId = authSelectors.getSessionId(getState())
    serviceActionRequest({
      elid,
      action: 'changepricelist.getmoney',
      sessionId,
      pricelist,
      clicked_button: 'finish',
      snext: 'ok',
      sok: 'ok',
    })
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)
        successCallback()
      })
      .catch(err => {
        checkIfTokenAlive(err.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const changeTariffConfirm =
  ({ action, elid, closeModal, successCallback }) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())
    const sessionId = authSelectors.getSessionId(getState())

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'instances.confirm.resize',
          select_resize: action,
          auth: sessionId,
          elid,
          out: 'json',
          lang: 'en',
          sok: 'ok',
          clicked_button: 'ok',
        }),
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)
        successCallback()
        closeModal()
        toast.success(`${action} success`)
        dispatch(actions.hideLoader())
      })
      .catch(err => {
        checkIfTokenAlive(err.message, dispatch)
        closeModal()
        dispatch(actions.hideLoader())
      })
  }

const changeInstancePassword =
  ({ password, elid, closeModal, setIsLoading, signal }) =>
  (dispatch, getState) => {
    setIsLoading ? setIsLoading(true) : dispatch(actions.showLoader())
    const sessionId = authSelectors.getSessionId(getState())

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'instances.fotbo.fotbochangepassword',
          out: 'json',
          sok: 'ok',
          auth: sessionId,
          elid,
          lang: 'en',
          clicked_button: 'ok',
          fotbochangepassword: password,
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)
        toast.success(t('Password changed', { ns: 'other' }))
        handleLoadersClosing('closeLoader', dispatch, setIsLoading)
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        handleLoadersClosing(error?.message, dispatch, setIsLoading)
      })
      .finally(() => {
        closeModal()
      })
  }

const rebuildInstance =
  ({ action, elid, successCallback, errorCallback, ...params }) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())
    const sessionId = authSelectors.getSessionId(getState())

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: `instances.fotbo.${action}`,
          out: 'json',
          auth: sessionId,
          elid,
          lang: 'en',
          ...params,
        }),
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)
        successCallback(data.doc)
        dispatch(actions.hideLoader())
      })
      .catch(err => {
        errorCallback && errorCallback()
        checkIfTokenAlive(err.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const openConsole =
  ({ elid }) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())
    const sessionId = authSelectors.getSessionId(getState())

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'instances.fotbovnc',
          out: 'json',
          auth: sessionId,
          elid,
          lang: 'en',
        }),
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)
        const url = data.doc.ok.$
        const link = document.createElement('a')
        link.setAttribute('target', '__blank')
        link.href = url
        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)

        dispatch(actions.hideLoader())
      })
      .catch(err => {
        checkIfTokenAlive(err.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

/* EDIT SERVERS OPERATION TO GET FULL DATA */
const getInstanceInfo =
  (elid, params, setInstanceInfo, signal, setIsLoading) => (dispatch, getState) => {
    setIsLoading ? setIsLoading(true) : dispatch(actions.showLoader())
    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'instances.edit',
          out: 'json',
          auth: sessionId,
          lang: 'en',
          elid,
          ...params,
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        const renamedSlistData = renameAddonFields(data?.doc, { isEditFunc: true })

        const d = {
          createdate: renamedSlistData?.createdate?.$,
          fotbo_id: renamedSlistData?.fotbo_id.$,
          ip: renamedSlistData?.ip?.$,
          ip_v6: renamedSlistData?.ip_v6?.$,
        }

        const clearStr = /\s*\(.*?\)\s*\.?/g

        renamedSlistData?.slist?.forEach(list => {
          if (list?.$name === 'stored_method') {
            d[`${list?.$name}_list`] = list?.val?.filter(
              v => v?.$key && v?.$key?.length > 0,
            )
          } else {
            d[`${list?.$name}`] =
              list?.val?.length > 1
                ? list?.val?.map(v => {
                    const { $ } = v
                    return $?.replace(clearStr, '')
                  })
                : list?.val?.[0]?.$.replace(clearStr, '')
          }
        })

        setInstanceInfo(d)
        handleLoadersClosing('closeLoader', dispatch, setIsLoading)
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        handleLoadersClosing('closeLoader', dispatch, setIsLoading)
      })
  }

const writeTariffsWithDC = data => {
  return {
    [data.doc.datacenter.$]:
      data.doc.list.find(el => el.$name === 'pricelist').elem || [],
  }
}

const getOsList =
  ({ signal, setIsLoading, lastTariffID, closeLoader, datacenter }) =>
  (dispatch, getState) => {
    setIsLoading && setIsLoading(true)

    if (!lastTariffID) {
      const tariffs = cloudVpsSelectors.getInstancesTariffs(getState())
      const tariffsArray = tariffs[datacenter || Object.keys(tariffs)[0]]
      lastTariffID = tariffsArray[tariffsArray.length - 1].id.$
    }

    return dispatch(getTariffParamsRequest({ signal, id: lastTariffID, datacenter }))
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)
        console.log(data.doc)
        const osList = data.doc.slist.find(el => el.$name === 'instances_os').val
        const sshList = data.doc.slist
          .find(el => el.$name === 'instances_ssh_keys')
          .val.map(el => ({
            label: el.$,
            value: el.$key,
          }))

        const operationSystems = { [data.doc.datacenter.$]: osList }

        dispatch(cloudVpsActions.setOperationSystems(operationSystems))
        dispatch(cloudVpsActions.setSshList(sshList))

        closeLoader && closeLoader()
      })
      .catch(err => {
        checkIfTokenAlive(err.message, dispatch)
        handleLoadersClosing(err?.message, dispatch, setIsLoading)
      })
  }

const getAllTariffsInfo =
  ({ signal, setIsLoading, needOsList }) =>
  (dispatch, getState) => {
    setIsLoading ? setIsLoading(true) : dispatch(actions.showLoader())
    const sessionId = authSelectors.getSessionId(getState())

    Promise.all([
      axiosInstance.post(
        '/',
        qs.stringify({
          func: 'v2.instances.order.pricelist',
          out: 'json',
          auth: sessionId,
          lang: 'en',
          datacenter: DC_ID_IN.netherlands,
        }),
        { signal },
      ),
      axiosInstance.post(
        '/',
        qs.stringify({
          func: 'v2.instances.order.pricelist',
          out: 'json',
          auth: sessionId,
          lang: 'en',
          datacenter: DC_ID_IN.poland,
        }),
        { signal },
      ),
    ])
      .then(async ([{ data: netherlandsData }, { data: polandData }]) => {
        if (netherlandsData.doc?.error) throw new Error(netherlandsData.doc.error.msg.$)
        if (polandData.doc?.error) throw new Error(polandData.doc.error.msg.$)

        const allTariffs = {
          ...writeTariffsWithDC(netherlandsData),
          ...writeTariffsWithDC(polandData),
        }
        const DClist = netherlandsData.doc.slist.find(el => el.$name === 'datacenter').val

        /** it is important to get lastTariff ID from the first DC in the list,
         * as it will be selected in the UI,
         * because then we will get OS list with this tariff (OS IDs differs between DC) */
        const firstDCid = DClist[0].$key
        const firstDCtariffs = allTariffs[firstDCid]
        const lastTariffID = firstDCtariffs[firstDCtariffs.length - 1].id.$

        const windowsTag = netherlandsData.doc.flist.val.find(el =>
          el.$.toLowerCase().includes('windows'),
        ).$key

        if (needOsList) {
          const qwe = await dispatch(
            getOsList({ signal, lastTariffID, datacenter: firstDCid }),
          )
          console.log(qwe)
        }
        console.log(DClist)
        dispatch(cloudVpsActions.setInstancesTariffs(allTariffs))
        dispatch(cloudVpsActions.setInstancesDCList(DClist))
        dispatch(cloudVpsActions.setWindowsTag(windowsTag))
      })
      .then(() => {
        console.log('then')
        handleLoadersClosing('closeLoader', dispatch, setIsLoading)
      })
      .catch(err => {
        checkIfTokenAlive(err.message, dispatch)
        handleLoadersClosing(err?.message, dispatch, setIsLoading)
      })
  }

const getTariffParams =
  ({ signal, id, datacenter, setIsLoading }) =>
  dispatch => {
    setIsLoading(true)

    return dispatch(getTariffParamsRequest({ signal, id, datacenter }))
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        renameAddonFields(data.doc, { isNewFunc: true })

        const networkOptions = data.doc.slist.find(el => el.$name === 'network').val
        const ipv6_id = networkOptions.find(el => el.$.includes('v6')).$key
        const addon_name = data.doc.register.network
        const ipv6_parametr = { [addon_name]: ipv6_id }

        return ipv6_parametr
      })
      .catch(err => {
        checkIfTokenAlive(err.message, dispatch)
        handleLoadersClosing(err?.message, dispatch, setIsLoading)
      })
  }

const getTariffParamsRequest =
  ({ signal, id, datacenter }) =>
  (_, getState) => {
    const sessionId = authSelectors.getSessionId(getState())
    const specialTariffFieldName = `period_${id}`

    return axiosInstance.post(
      '/',
      qs.stringify({
        func: 'v2.instances.order.param',
        out: 'json',
        auth: sessionId,
        lang: 'en',
        pricelist: id,
        datacenter,
        [specialTariffFieldName]: '-50',
      }),
      { signal },
    )
  }

const setOrderData =
  ({ signal, setIsLoading, orderData }) =>
  (dispatch, getState) => {
    const sessionId = authSelectors.getSessionId(getState())

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'v2.instances.order.param',
          auth: sessionId,
          out: 'json',
          sok: 'ok',
          lang: 'en',
          order_period: '-50',

          ...orderData,
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)
        console.log(data.doc)
        dispatch(
          cartActions.setCartIsOpenedState({
            isOpened: true,
            redirectPath: routes.CLOUD_VPS,
          }),
        )
      })
      .then(() => {
        handleLoadersClosing('closeLoader', dispatch, setIsLoading)
      })
      .catch(err => {
        checkIfTokenAlive(err.message, dispatch)
        handleLoadersClosing(err?.message, dispatch, setIsLoading)
      })
  }

export default {
  getInstances,
  setInstancesFilter,
  editInstance,
  deleteInstance,
  changeInstanceState,
  changeInstancePassword,
  getTariffsListToChange,
  changeTariff,
  changeTariffConfirm,
  rebuildInstance,
  getInstanceInfo,
  openConsole,
  getAllTariffsInfo,
  getTariffParams,
  getOsList,
  setOrderData,
  getTariffParamsRequest,
}
