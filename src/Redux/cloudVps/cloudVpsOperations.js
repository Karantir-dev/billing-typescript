/* eslint-disable no-unused-vars */
import qs from 'qs'
import { actions, authSelectors } from '@redux'
import { toast } from 'react-toastify'
import { axiosInstance } from '@config/axiosInstance'
import { checkIfTokenAlive, handleLoadersClosing } from '@utils'
import { t } from 'i18next'

const getInstances =
  ({
    setInstances,
    setTotalElems,
    setFilters,
    p_cnt,
    p_num,
    signal,
    setIsLoading,
    p_col,
  }) =>
  (dispatch, getState) => {
    setIsLoading ? setIsLoading(true) : dispatch(actions.showLoader())
    const sessionId = authSelectors.getSessionId(getState())

    axiosInstance
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
        setInstances(data.doc.elem || [])
        setTotalElems(data.doc.p_elems.$)

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
        setFilters({ active: data.doc, filtersList })
        handleLoadersClosing('closeLoader', dispatch, setIsLoading)
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        handleLoadersClosing(error?.message, dispatch, setIsLoading)
      })
  }

const setInstancesFilter =
  ({
    values,
    setInstances,
    setTotalElems,
    setFilters,
    p_cnt,
    p_num,
    signal,
    setIsLoading,
    p_col,
  }) =>
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
            setInstances,
            setTotalElems,
            setFilters,
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
    setInstances,
    setTotalElems,
    setFilters,
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
            setInstances,
            setTotalElems,
            setFilters,
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
  ({ elid, closeModal, setInstances, setTotalElems, setFilters, signal, setIsLoading }) =>
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

        dispatch(
          getInstances({
            setInstances,
            setTotalElems,
            setFilters,
            signal,
            setIsLoading,
          }),
        )
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
  ({
    action,
    elid,
    closeModal,
    setInstances,
    setTotalElems,
    setFilters,
    signal,
    setIsLoading,
    p_num,
    p_cnt,
  }) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())
    const sessionId = authSelectors.getSessionId(getState())

    serviceActionRequest({ elid, action, sessionId })
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)

        dispatch(
          getInstances({
            setInstances,
            setTotalElems,
            setFilters,
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
  ({ elid, pricelist, elname }) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())
    const sessionId = authSelectors.getSessionId(getState())
    serviceActionRequest({
      elid,
      action: 'changepricelist.pricelist',
      sessionId,
      pricelist,
      clicked_button: 'next',
      snext: 'ok',
      sok: 'ok',
      elname,
    })
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)
        console.log(data, ' data change tariff')
        dispatch(actions.hideLoader())
      })
      .catch(err => {
        checkIfTokenAlive(err.message, dispatch)
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
  ({ elid, setState }) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())
    const sessionId = authSelectors.getSessionId(getState())

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'instances.fotbo.rebuild',
          out: 'json',
          auth: sessionId,
          elid,
          lang: 'en',
        }),
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)
        setState(data.doc)
        dispatch(actions.hideLoader())
      })
      .catch(err => {
        checkIfTokenAlive(err.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const getSshKeys =
  ({ setSshItems, setTotalElems, p_cnt, p_num, signal, setIsLoading, p_col }) =>
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

        console.log('data from sshkeys request: ', data)
        setSshItems(data.doc.elem || [])
        setTotalElems(data.doc.p_elems.$)
        handleLoadersClosing('closeLoader', dispatch, setIsLoading)
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        handleLoadersClosing(error?.message, dispatch, setIsLoading)
      })
  }

const setSshKey =
  ({
    values,
    closeModal = () => {},
    errorCallback = () => {},
    setSshItems,
    setTotalElems,
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
          func: 'sshkeys.edit',
          out: 'json',
          sok: 'ok',
          processingmodules: '234' /* 233 - Poland, 234 - Netherlands */,
          auth: sessionId,

          lang: 'en',
          clicked_button: 'ok',
          ...values,
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)

        dispatch(
          getSshKeys({
            setSshItems,
            setTotalElems,
            signal,
            setIsLoading,
          }),
        )
        closeModal()
        handleLoadersClosing('closeLoader', dispatch, setIsLoading)
        toast.success(t('Saved successfully', { ns: 'other' }))
      })
      .catch(error => {
        errorCallback()
        closeModal()
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
    setSshItems,
    setTotalElems,
    setIsLoading,
    signal,
  }) =>
  (dispatch, getState) => {
    setIsLoading ? setIsLoading(true) : dispatch(actions.showLoader())
    const sessionId = authSelectors.getSessionId(getState())

    console.log('values on editing: ', values)

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
          ...values,
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)

        dispatch(
          getSshKeys({
            setSshItems,
            setTotalElems,
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

export default {
  getInstances,
  setInstancesFilter,
  editInstance,
  deleteInstance,
  changeInstanceState,
  changeInstancePassword,
  getTariffsListToChange,
  changeTariff,
  rebuildInstance,
  getSshKeys,
  setSshKey,
  editSsh,
}
