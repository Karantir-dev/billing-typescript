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
import {
  checkIfTokenAlive,
  handleLoadersClosing,
  renameAddonFields,
  cookies,
} from '@utils'
import { t } from 'i18next'
import * as routes from '@src/routes'
import { FOTBO_STATUSES_LIST } from '@utils/constants'

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
        toast.success(t('request_sent', { ns: 'cloud_vps' }))
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
        toast.success(t('request_sent', { ns: 'cloud_vps' }))
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
        toast.success(t('request_sent', { ns: 'cloud_vps' }))
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
          func: 'instances.fleio.changepassword',
          out: 'json',
          sok: 'ok',
          auth: sessionId,
          elid,
          lang: 'en',
          clicked_button: 'ok',
          password,
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)
        toast.success(t('request_sent', { ns: 'cloud_vps' }))
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
          func: `instances.fleio.${action}`,
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
          func: 'instances.fleio.vnc',
          out: 'json',
          auth: sessionId,
          elid,
          lang: 'en',
        }),
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)

        const { $name, $: value } = data.doc.cookies.cookie
        cookies.setCookie($name, value)

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
  (elid, setInstanceInfo, signal, setIsLoading) => (dispatch, getState) => {
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
          rdns_record: renamedSlistData?.rdns_record?.$,
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
  ({ signal, setIsLoading, lastTariffID, closeLoader, datacenter, setSshList }) =>
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

        const osList = data.doc.slist.find(el => el.$name === 'instances_os').val

        const sshList = data.doc.slist.find(el => el.$name === 'instances_ssh_keys').val

        let formatedSshList
        if (sshList[0].$key === 'none') {
          formatedSshList = []
        } else {
          formatedSshList = sshList.map(el => ({
            label: el.$,
            value: el.$key,
          }))
        }

        const operationSystems = { [data.doc.datacenter.$]: osList }

        dispatch(cloudVpsActions.setOperationSystems(operationSystems))
        setSshList && setSshList(formatedSshList)

        closeLoader && closeLoader()
      })
      .catch(err => {
        checkIfTokenAlive(err.message, dispatch)
        handleLoadersClosing(err?.message, dispatch, setIsLoading)
      })
  }

const getAllTariffsInfo =
  ({
    signal,
    setIsLoading,
    needOsList,
    datacenter,
    setSshList,
    needDcList = true,
    isPremium,
  }) =>
  (dispatch, getState) => {
    setIsLoading ? setIsLoading(true) : dispatch(actions.showLoader())
    const sessionId = authSelectors.getSessionId(getState())

    return axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'v2.instances.order.pricelist',
          out: 'json',
          auth: sessionId,
          lang: 'en',
          datacenter,
        }),
        { signal },
      )
      .then(async ({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)

        const datacenter = data.doc.datacenter.$
        const allTariffs = {
          ...writeTariffsWithDC(data),
        }
        const DClist = data.doc.slist.find(el => el.$name === 'datacenter').val

        /**
         * it is important to get ID of the last Tariff because it must have full list of OS,
         * and the Tariff must be from selected DC,
         * because OS IDs differs between DC
         */
        const tariffs = allTariffs[datacenter]
        const windowsTag = data.doc.flist.val.find(el =>
          el.$.toLowerCase().includes('windows'),
        ).$key

        const cloudPremiumTag = data?.doc?.flist?.val.find(el =>
          el?.$.toLowerCase().includes('type:premium'),
        ).$key

        /** This block will be refactored */
        const checkIsItPremiumCloud = tags =>
          tags?.some(tag => tag?.$.includes(cloudPremiumTag))

        const premiumTariffs = []
        const otherTariffs = []

        tariffs?.forEach(tariff => {
          const isItPremiumInstance = checkIsItPremiumCloud(tariff?.flabel?.tag)

          isItPremiumInstance ? premiumTariffs.push(tariff) : otherTariffs.push(tariff)
        })

        let lastTariffID
        if (isPremium) {
          /** we pick last tariff in the list because first one doesn`t have Windows OS */
          lastTariffID = premiumTariffs[premiumTariffs.length - 1].id.$
        } else {
          lastTariffID = otherTariffs[0].id.$
        }
        /** /This block will be refactored */

        if (needOsList) {
          await dispatch(getOsList({ signal, lastTariffID, datacenter, setSshList }))
        }

        dispatch(cloudVpsActions.setInstancesTariffs(allTariffs))
        needDcList && dispatch(cloudVpsActions.setInstancesDCList(DClist))
        dispatch(cloudVpsActions.setWindowsTag(windowsTag))
        dispatch(cloudVpsActions.setCloudPremiumTag(cloudPremiumTag))
      })
      .then(() => {
        handleLoadersClosing('closeLoader', dispatch, setIsLoading)
        return 'success'
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
          licence_agreement: 'on',
          ...orderData,
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)
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

const getSshKeys =
  ({ p_col, p_cnt, p_num, setAllSshItems, setTotalElems, signal, setIsLoading }) =>
  (dispatch, getState) => {
    setIsLoading ? setIsLoading(true) : dispatch(actions.showLoader())

    const sessionId = authSelectors.getSessionId(getState())

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'sshkeys',
          out: 'json',
          auth: sessionId,
          p_num,
          p_cnt,
          p_col,
          lang: 'en',
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)

        const sshList = data.doc.elem || []

        dispatch(cloudVpsActions.setSshCount(Number(data?.doc?.p_elems?.$)))

        setAllSshItems
          ? setAllSshItems(sshList)
          : dispatch(cloudVpsActions.setSshList(sshList))

        setTotalElems && setTotalElems(data?.doc?.p_elems.$)
        handleLoadersClosing('closeLoader', dispatch, setIsLoading)
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        handleLoadersClosing(error?.message, dispatch, setIsLoading)
      })
  }

/* Below being request for changing data of ssh keys */
const editSsh =
  ({
    values,
    elid,
    errorCallback = () => {},
    closeModal = () => {},
    setTotalElems,
    setIsLoading,
    setAllSshItems,
    signal,
    p_col,
    p_num,
    p_cnt,
  }) =>
  (dispatch, getState) => {
    setIsLoading ? setIsLoading(true) : dispatch(actions.showLoader())
    closeModal()
    const sessionId = authSelectors.getSessionId(getState())

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'sshkeys.edit',
          out: 'json',
          sok: 'ok',
          auth: sessionId,
          elid,
          lang: 'en',
          clicked_button: 'ok',
          processingmodulegroup: '1',
          ...values,
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc?.error) {
          /* Get and parse errors */
          const errorObject = JSON.parse(data.doc.error.msg.$)
          /* Get the first key */
          const firstKey = Object.keys(errorObject)[0]
          if (firstKey) {
            const errorMessage = errorObject[firstKey]
            throw new Error(errorMessage)
          }
        } else if (typeof data === 'string') {
          /* if long request - throw Error */
          throw new Error('Request in process, please wait')
        }

        dispatch(
          getSshKeys({
            p_col,
            p_num,
            p_cnt,
            setTotalElems,
            setAllSshItems,
            signal,
            setIsLoading,
          }),
        )
        handleLoadersClosing('closeLoader', dispatch, setIsLoading)
        toast.success(t('Changes saved successfully', { ns: 'other' }))
      })
      .catch(error => {
        closeModal()
        errorCallback()
        checkIfTokenAlive(error?.message, dispatch)
        handleLoadersClosing(error?.message, dispatch, setIsLoading)
      })
  }

const deleteSsh =
  ({ elid, item, closeModal, setTotalElems, successCallback, signal, setIsLoading }) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())
    const sessionId = authSelectors.getSessionId(getState())

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'sshkeys.delete',
          auth: sessionId,
          elid,
          out: 'json',
          lang: 'en',
        }),
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)
        return dispatch(
          getSshKeys({
            setTotalElems,
            signal,
            setIsLoading,
          }),
        )
      })
      .then(() => {
        successCallback && successCallback()
        closeModal()
        toast.success(
          t('server_deleted_success', { ns: 'other', id: `${item?.comment?.$}` }),
        )
        dispatch(actions.hideLoader())
      })
      .catch(err => {
        closeModal()
        checkIfTokenAlive(err.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const generateSsh =
  ({ setSSHKey }) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())
    const sessionId = authSelectors.getSessionId(getState())

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'sshkeys.generator',
          out: 'json',
          auth: sessionId,
          lang: 'en',
        }),
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)
        const publicKey = data.doc.public_key.$
        const privateKey = data.doc.private_key.$
        setSSHKey({ publicKey, privateKey })
        dispatch(actions.hideLoader())
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        handleLoadersClosing(error?.message, dispatch)
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
  getSshKeys,
  editSsh,
  deleteSsh,
  getInstanceInfo,
  openConsole,
  getAllTariffsInfo,
  getTariffParams,
  getOsList,
  setOrderData,
  getTariffParamsRequest,
  generateSsh,
}
