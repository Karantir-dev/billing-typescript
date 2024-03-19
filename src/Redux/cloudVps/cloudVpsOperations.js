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
import { DC_ID_IN } from '@src/utils/constants'
import * as routes from '@src/routes'

const getInstances =
  ({ p_cnt, p_num, p_col, signal, setIsLoading }) =>
  (dispatch, getState) => {
    setIsLoading ? setIsLoading(true) : dispatch(actions.showLoader())
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
        dispatch(cloudVpsActions.setInstancesList(data.doc.elem || []))
        dispatch(cloudVpsActions.setInstancesCount(data.doc.p_elems.$))

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
        }
        dispatch(cloudVpsActions.setInstancesFilters({ active: data.doc, filtersList }))
        handleLoadersClosing('closeLoader', dispatch, setIsLoading)
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        handleLoadersClosing(error?.message, dispatch, setIsLoading)
      })
  }

const setInstancesFilter =
  ({ values, p_cnt, p_num, signal, setIsLoading, p_col }) =>
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
          status: values?.status || '',
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)
        return dispatch(
          getInstances({
            p_cnt,
            p_num,
            signal,
            setIsLoading,
            p_col,
          }),
        )
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

        dispatch(
          getInstances({
            signal,
            setIsLoading,
          }),
        )
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
  ({ elid, closeModal, successCallback, signal, setIsLoading }) =>
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
        return dispatch(
          getInstances({
            signal,
            setIsLoading,
          }),
        )
      })
      .then(() => {
        successCallback && successCallback()
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
  ({ action, elid, closeModal, signal, setIsLoading, p_num, p_cnt }) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())
    const sessionId = authSelectors.getSessionId(getState())

    serviceActionRequest({ elid, action, sessionId })
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)

        dispatch(
          getInstances({
            signal,
            setIsLoading,
            p_num,
            p_cnt,
          }),
        )
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
  ({ elid, pricelist, successCallback, signal, setIsLoading, p_num, p_cnt }) =>
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
        successCallback && successCallback()
        dispatch(
          getInstances({
            signal,
            setIsLoading,
            p_num,
            p_cnt,
          }),
        )
      })
      .catch(err => {
        checkIfTokenAlive(err.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const changeTariffConfirm =
  ({ action, elid, closeModal, signal, setIsLoading, p_num, p_cnt }) =>
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

        dispatch(
          getInstances({
            signal,
            setIsLoading,
            p_num,
            p_cnt,
          }),
        )
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
  ({ signal, setIsLoading, lastTariffID, closeLoader }) =>
  (dispatch, getState) => {
    setIsLoading(true)

    if (!lastTariffID) {
      const tariffs = cloudVpsSelectors.getInstancesTariffs(getState())
      const tariffsArray = tariffs[Object.keys(tariffs)[0]]
      lastTariffID = tariffsArray[tariffsArray.length - 1].id.$
    }

    dispatch(getTariffParamsRequest({ signal, id: lastTariffID }))
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)
        console.log(data.doc)
        const osList = data.doc.slist.find(el => el.$name === 'instances_os').val
        const sshList = data.doc.slist.find(el => el.$name === 'instances_ssh_keys').val

        dispatch(cloudVpsActions.setOsList(osList))
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

        const DClist = netherlandsData.doc.slist.find(el => el.$name === 'datacenter').val

        const windowsTag = netherlandsData.doc.flist.val.find(el =>
          el.$.toLowerCase().includes('windows'),
        ).$key

        const tariffs = polandData.doc.list.find(el => el.$name === 'pricelist').elem

        const lastTariffID = tariffs[tariffs.length - 1].id.$

        if (needOsList) {
          await dispatch(getOsList({ signal, setIsLoading, lastTariffID }))
        }

        dispatch(
          cloudVpsActions.setInstancesTariffs({
            ...writeTariffsWithDC(netherlandsData),
            ...writeTariffsWithDC(polandData),
          }),
        )
        dispatch(cloudVpsActions.setInstancesDCList(DClist))
        dispatch(cloudVpsActions.setWindowsTag(windowsTag))
      })
      .then(() => {
        handleLoadersClosing('closeLoader', dispatch, setIsLoading)
      })
      .catch(err => {
        checkIfTokenAlive(err.message, dispatch)
        handleLoadersClosing(err?.message, dispatch, setIsLoading)
      })
  }

// const getTariffParams =
//   ({ signal, id, setIsLoading }) =>
//   dispatch => {
//     setIsLoading(true)

//     dispatch(getTariffParamsRequest({ signal, id }))
//       .then(({ data }) => {
//         if (data.doc.error) throw new Error(data.doc.error.msg.$)

//         renameAddonFields(data.doc, { isNewFunc: true })
//         console.log(data.doc)
//       })
//       .then(() => {
//         handleLoadersClosing('closeLoader', dispatch, setIsLoading)
//       })
//       .catch(err => {
//         checkIfTokenAlive(err.message, dispatch)
//         handleLoadersClosing(err?.message, dispatch, setIsLoading)
//       })
//   }

const getTariffParamsRequest =
  ({ signal, id }) =>
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
  // getTariffParams,
  getOsList,
  setOrderData,
}
