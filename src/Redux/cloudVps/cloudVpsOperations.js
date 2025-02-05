import qs from 'qs'
import { actions, authSelectors, cartActions, cloudVpsActions } from '@redux'
import { toast } from 'react-toastify'
import { axiosInstance } from '@config/axiosInstance'
import {
  checkIfTokenAlive,
  handleLoadersClosing,
  renameAddonFields,
  cookies,
  sortCloudsByType,
  handleLongRequest,
  handleLoadersOpen,
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
    setPagination,
    setLocalInstancesItems,
  }) =>
  (dispatch, getState) => {
    isLoader && handleLoadersOpen(setIsLoading, dispatch)

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
        /** unifies the data structure */
        elemsList.forEach(el => {
          if (!el.createdate.$ && el.createdate?.[0]?.$) {
            el.createdate.$ = el.createdate[0].$
          }
        })

        const p_cnt = +data.doc.p_cnt.$
        const p_elems = +data.doc.p_elems.$
        const p_num = +data.doc.p_num.$
        setPagination?.({ p_cnt, p_elems, p_num })

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
          instance_status: FOTBO_STATUSES_LIST,
        }
        const active = {
          id: data.doc?.id?.$ || '',
          ip: data.doc?.ip?.$ || '',
          pricelist: data.doc?.pricelist?.$ || '',
          instance_status: data.doc?.instance_status?.$ || '',
          orderdatefrom: data.doc?.orderdatefrom?.$ || '',
          orderdateto: data.doc?.orderdateto?.$ || '',
          cost_from: data.doc?.cost_from?.$ || '',
          cost_to: data.doc?.cost_to?.$ || '',
          datacenter: data.doc?.datacenter?.$ || '',
          name: data.doc?.name?.$ || '',
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
    handleLoadersOpen(setIsLoading, dispatch)
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
          instance_status: values?.instance_status || '',
          name: values?.name || '',
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
    successToast,
    setIsLoading,
    signal,
  }) =>
  (dispatch, getState) => {
    handleLoadersOpen(setIsLoading, dispatch)
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
        successToast
          ? toast.success(successToast)
          : toast.success(t('request_sent', { ns: 'cloud_vps' }))
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
    handleLoadersOpen(setIsLoading, dispatch)
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
    handleLoadersOpen(setIsLoading, dispatch)
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
          instances_uuid: renamedSlistData?.instances_uuid.$,
          ip: renamedSlistData?.ip?.$,
          ip_v6: renamedSlistData?.ip_v6?.$,
          rdns_record: renamedSlistData?.rdns_record?.$,
          backup_rotation: renamedSlistData?.backup_rotation?.$,
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

const getInstanceNetworkTrafficInfo =
  (elid, setNetworkTrafficInfo, signal, setIsLoading) => (dispatch, getState) => {
    handleLoadersOpen(setIsLoading, dispatch)
    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'instances.fleio.trafficdata',
          out: 'json',
          auth: sessionId,
          lang: 'en',
          elid,
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        const { cycle_traffic, month_traffic } = data.doc

        setNetworkTrafficInfo({ cycle_traffic, month_traffic })
        handleLoadersClosing('closeLoader', dispatch, setIsLoading)
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        handleLoadersClosing('closeLoader', dispatch, setIsLoading)
      })
  }

const getOsList =
  ({ signal, setIsLoading, lastTariffID, closeLoader, datacenter, setSshList }) =>
  dispatch => {
    setIsLoading && setIsLoading(true)

    return dispatch(getTariffParamsRequest({ signal, id: lastTariffID, datacenter }))
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)

        try {
          const osList = data.doc.slist.find(el => el.$name === 'instances_os').val

          const OsByZones = {}
          osList.forEach(el => {
            if (!OsByZones[el.$depend]) {
              OsByZones[el.$depend] = [el]
            } else {
              OsByZones[el.$depend].push(el)
            }
          })

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

          const operationSystems = { [data.doc.datacenter.$]: OsByZones }

          dispatch(cloudVpsActions.setOperationSystems(operationSystems))

          setSshList && setSshList(formatedSshList)

          closeLoader && closeLoader()
        } catch (error) {
          console.error(error)
          toast.error(t('warnings.unknown_error', { ns: 'auth' }), {
            toastId: 'unknown_error',
            updateId: 'unknown_error',
          })
        }
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
    isBasic,
  }) =>
  (dispatch, getState) => {
    handleLoadersOpen(setIsLoading, dispatch)
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

        const dcID = data.doc.datacenter.$
        const DClist = data.doc.slist.find(el => el.$name === 'datacenter').val

        const cloudBasicTag = data?.doc?.flist?.val.find(el =>
          el?.$.toLowerCase().includes('type:basic'),
        )?.$key
        const windowsTag = data.doc.flist.val.find(el =>
          el.$.toLowerCase().includes('windows'),
        ).$key
        const soldOutTag = data.doc.flist.val.find(el =>
          el.$.toLowerCase().includes('soldout:true'),
        )?.$key

        const { basicTariffs, premiumTariffs } = sortCloudsByType(data, cloudBasicTag)

        /**
         * it is important to get ID of the last Tariff for Premium type
         * because it must have full list of OS,
         * and the Tariff must be from selected DC,
         * because OS IDs differs between DC
         */
        if (needOsList) {
          let lastTariffID

          if (isBasic) {
            /** we pick last tariff in the list because first one doesn`t have Windows OS */
            lastTariffID = basicTariffs[dcID][basicTariffs[dcID].length - 1].id.$
          } else {
            /** we pick last tariff in the list because first one doesn`t have Windows OS */
            lastTariffID = premiumTariffs[dcID][premiumTariffs[dcID].length - 1].id.$
          }
          await dispatch(
            getOsList({ signal, lastTariffID, datacenter: dcID, setSshList }),
          )
        }

        basicTariffs && dispatch(cloudVpsActions.setBasicTariffs(basicTariffs))
        dispatch(cloudVpsActions.setPremiumTariffs(premiumTariffs))
        needDcList && dispatch(cloudVpsActions.setInstancesDCList(DClist))
        dispatch(cloudVpsActions.setWindowsTag(windowsTag))
        soldOutTag && dispatch(cloudVpsActions.setSoldOutTag(soldOutTag))
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
    handleLoadersOpen(setIsLoading, dispatch)

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
    handleLoadersOpen(setIsLoading, dispatch)
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
      .then(async ({ data }) => {
        function errorHandler(data) {
          if (data.doc?.error) {
            /* Get and parse errors */
            let errorMessage = data.doc?.error?.msg?.$
            const errorObject = JSON.parse(data.doc?.error?.$object)
            /* Get the first key */
            const errorKey = Object.keys(errorObject)?.[0]

            if (errorKey) {
              const specifiedErrorDescr = errorObject[errorKey]?.[0]
              toast.error(t(specifiedErrorDescr, { ns: 'other' }))
              errorMessage = `${errorMessage}: ${specifiedErrorDescr}`
              console.error(errorMessage)
            } else if (data.doc.error.$type) {
              console.error(`${errorMessage}: ${data.doc.error?.$type}`)
            } else {
              console.error(errorMessage)
            }
            handleLoadersClosing('closeLoader', dispatch, setIsLoading)
            throw new Error(errorMessage)
          } else if (typeof data === 'string' && !data.match(/long.+billmgr/)) {
            handleLoadersClosing('closeLoader', dispatch, setIsLoading)
            throw new Error(data)
          }
        }

        const successCallback = () => {
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
          toast.success(t('Changes saved successfully', { ns: 'other' }))
        }

        await handleLongRequest(data, errorHandler, successCallback)
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

const getMetrics =
  ({ elid, metric, hours, setData, signal, setIsLoading }) =>
  (dispatch, getState) => {
    handleLoadersOpen(setIsLoading, dispatch)
    const sessionId = authSelectors.getSessionId(getState())

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'instances.fleio.measures',
          out: 'json',
          auth: sessionId,
          lang: 'en',
          elid,
          hours,
          metric,
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)
        setData(data.doc.measures || [])
        handleLoadersClosing('closeLoader', dispatch, setIsLoading)
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        handleLoadersClosing(error?.message, dispatch)
      })
  }

const setImageFilter =
  ({ func, values, signal, setIsLoading, successCallback }) =>
  (dispatch, getState) => {
    handleLoadersOpen(setIsLoading, dispatch)
    const sessionId = authSelectors.getSessionId(getState())

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: `${func}.filter`,
          out: 'json',
          auth: sessionId,
          sok: 'ok',
          lang: 'en',
          ...values,
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

const getImages =
  ({
    func,
    elid,
    p_cnt,
    p_num,
    p_col,
    setData,
    setPagination,
    setDailyCosts,
    signal,
    setIsLoading,
    setFilters,
    setBackupRotation,
  }) =>
  (dispatch, getState) => {
    handleLoadersOpen(setIsLoading, dispatch)
    const sessionId = authSelectors.getSessionId(getState())

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func,
          out: 'json',
          auth: sessionId,
          lang: 'en',
          elid,
          p_cnt,
          p_num,
          p_col,
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)
        const elemsList = data.doc.elem || []
        /** unifies the data structure */
        elemsList.forEach(el => {
          if (!el.createdate?.$ && el.createdate?.[0]?.$) {
            el.createdate.$ = el.createdate?.[0]?.$
          }
        })

        const created_today_value = data.doc?.manual_created_today?.$ || 0
        const created_total = data.doc?.manual_created_total?.$ || 0
        const priceObj = data.doc.cost || {}

        const costSummaryObj = {
          ...priceObj,
          created_today: { $: Number(created_today_value) },
          created_total: { $: Number(created_total) },
        }

        const p_cnt = +data.doc.p_cnt.$
        const p_elems = +data.doc.p_elems.$
        const p_num = +data.doc.p_num.$

        setDailyCosts?.(costSummaryObj)
        setBackupRotation && setBackupRotation(data.doc?.backup_rotation?.$)
        setPagination({ p_cnt, p_elems, p_num })
        setData(elemsList)
        if (setFilters) {
          return axiosInstance.post(
            '/',
            qs.stringify({
              func: `${func}.filter`,
              out: 'json',
              auth: sessionId,
              lang: 'en',
              elid,
            }),
            { signal },
          )
        } else {
          handleLoadersClosing('closeLoader', dispatch, setIsLoading)
          return
        }
      })
      .then(({ data } = {}) => {
        setFilters?.(data.doc)
        handleLoadersClosing('closeLoader', dispatch, setIsLoading)
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        handleLoadersClosing(error?.message, dispatch)
      })
  }

const editImage =
  ({ func, values, successCallback = () => {}, elid, signal, setIsLoading }) =>
  (dispatch, getState) => {
    handleLoadersOpen(setIsLoading, dispatch)
    const sessionId = authSelectors.getSessionId(getState())

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: `${func}.edit`,
          out: 'json',
          auth: sessionId,
          lang: 'en',
          elid,
          ...values,
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc?.error && !data.doc?.error?.$object === 'runningoperation')
          throw new Error(data.doc.error.msg.$)

        successCallback(data.doc)

        handleLoadersClosing('closeLoader', dispatch, setIsLoading)
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        handleLoadersClosing(error?.message, dispatch)
      })
  }

const getImageParams =
  ({ setData, signal, setIsLoading } = {}) =>
  (dispatch, getState) => {
    handleLoadersOpen(setIsLoading, dispatch)
    const sessionId = authSelectors.getSessionId(getState())

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'v2.image.order.pricelist',
          out: 'json',
          auth: sessionId,
          lang: 'en',
          plid: '',
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)

        const pricelistElem = data.doc.list.find(el => el.$name === 'pricelist')
          ?.elem?.[0]

        const pricelist = pricelistElem.id.$
        const pricePeriod = pricelistElem.prices.price.period.$

        return axiosInstance.post(
          '/',
          qs.stringify({
            func: 'v2.image.order.param',
            out: 'json',
            auth: sessionId,
            lang: 'en',
            [`period_${pricelist}`]: pricePeriod,
            pricelist,
          }),
          { signal },
        )
      })
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)
        setData(data.doc)
        handleLoadersClosing('closeLoader', dispatch, setIsLoading)
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        handleLoadersClosing(error?.message, dispatch)
      })
  }

const createImage =
  ({ values, successCallback, closeModal, signal, setIsLoading }) =>
  (dispatch, getState) => {
    handleLoadersOpen(setIsLoading, dispatch)
    const sessionId = authSelectors.getSessionId(getState())

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'v2.image.order.param',
          out: 'xjson',
          auth: sessionId,
          lang: 'en',
          sok: 'ok',
          image_type: 'image',
          skipbasket: 'on',
          ...values,
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)
        successCallback()
        closeModal()

        handleLoadersClosing('closeLoader', dispatch)
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        closeModal()
        handleLoadersClosing(error?.message, dispatch)
      })
  }

const deleteImage =
  ({ func, elid, successCallback, signal, setIsLoading, values }) =>
  (dispatch, getState) => {
    handleLoadersOpen(setIsLoading, dispatch)
    const sessionId = authSelectors.getSessionId(getState())

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: `${func}.delete`,
          out: 'json',
          auth: sessionId,
          lang: 'en',
          elid,
          ...values,
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)
        successCallback()
        handleLoadersClosing('closeLoader', dispatch, setIsLoading)
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        handleLoadersClosing(error?.message, dispatch, setIsLoading)
      })
  }

const copyModal =
  ({ elid, values, successCallback = () => {}, setItemData, signal, setIsLoading }) =>
  (dispatch, getState) => {
    handleLoadersOpen(setIsLoading, dispatch)
    const sessionId = authSelectors.getSessionId(getState())

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'image.copy',
          out: 'json',
          auth: sessionId,
          lang: 'en',
          elid,
          ...values,
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)
        setItemData && setItemData(data.doc)
        successCallback()
        values?.sok === 'ok' && toast.success(t('request_sent', { ns: 'cloud_vps' }))
        handleLoadersClosing('closeLoader', dispatch, setIsLoading)
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        handleLoadersClosing(error?.message, dispatch, setIsLoading)
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
  getInstanceNetworkTrafficInfo,
  openConsole,
  getAllTariffsInfo,
  getTariffParams,
  getOsList,
  setOrderData,
  getTariffParamsRequest,
  generateSsh,
  getMetrics,
  getImages,
  editImage,
  getImageParams,
  createImage,
  deleteImage,
  copyModal,
  setImageFilter,
}
