import qs from 'qs'
import { toast } from 'react-toastify'
import { actions, ftpActions, cartActions } from '@redux'
import { axiosInstance } from '@config/axiosInstance'
import { checkIfTokenAlive } from '@utils'
import i18n from '@src/i18n'
import * as route from '@src/routes'

//GET SERVERS OPERATIONS

const getFTPList = (data, signal, setIsLoading) => (dispatch, getState) => {
  setIsLoading ? setIsLoading(true) : dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'storage',
        out: 'json',
        auth: sessionId,
        lang: 'en',
        clickstat: 'yes',
        p_cnt: data?.p_cnt || 10,
        ...data,
      }),
      { signal },
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      const ftpRenderData = {
        ftpList: data.doc.elem ? data.doc.elem : [],
        ftpPageRights: data.doc.metadata.toolbar,
      }

      const count = data?.doc?.p_elems?.$ || 0
      dispatch(ftpActions.setFtpCount(count))
      dispatch(ftpActions.setFTPList(ftpRenderData))

      setIsLoading ? setIsLoading(false) : dispatch(actions.hideLoader())
    })
    .catch(error => {
      if (setIsLoading) {
        checkIfTokenAlive(error.message, dispatch, true) && setIsLoading(false)
      } else {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(actions.hideLoader())
      }
    })
}

const getTarifs =
  (setTarifs, data = {}, signal, setIsLoading) =>
  (dispatch, getState) => {
    setIsLoading(true)

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'storage.order',
          out: 'json',
          auth: sessionId,
          lang: 'en',
          ...data,
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        const { elem: tarifList } = data.doc.list[0]
        const { val: datacenter } = data.doc.slist.length > 1 ? data.doc.slist[0] : []
        const { val: period } = data.doc.slist[0]
        const { $: currentDatacenter } = data.doc.datacenter

        const orderData = {
          tarifList,
          datacenter,
          period,
          currentDatacenter,
        }

        setTarifs(orderData)
        setIsLoading(false)
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch, true) && setIsLoading(false)
      })
  }

const getParameters =
  (period, datacenter, pricelist, setParameters, setFieldValue, signal, setIsLoading) =>
  (dispatch, getState) => {
    setIsLoading(true)

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'storage.order.pricelist',
          out: 'json',
          auth: sessionId,
          period,
          datacenter,
          pricelist,
          snext: 'ok',
          sok: 'ok',
          lang: 'en',
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        const { slist: paramsList } = data.doc
        const autoprolong = paramsList?.filter(item => item.$name === 'autoprolong')

        // fields

        setFieldValue('autoprolonglList', autoprolong[0].val)
        setFieldValue('autoprolong', autoprolong[0]?.val[1]?.$key)
        setParameters(paramsList)
        setIsLoading(false)
      })

      .catch(error => {
        checkIfTokenAlive(error.message, dispatch, true) && setIsLoading(false)
      })
  }

const orderFTP = (autoprolong, datacenter, period, pricelist) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'storage.order.param',
        out: 'json',
        auth: sessionId,
        period,
        datacenter,
        pricelist,
        autoprolong,
        licence_agreement: 'on',
        clicked_button: 'finish',
        sok: 'ok',
        lang: 'en',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      dispatch(
        cartActions.setCartIsOpenedState({
          isOpened: true,
          redirectPath: route.FTP,
        }),
      )
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getPrintLicense = priceId => (dispatch, getState) => {
  const {
    auth: { sessionId },
  } = getState()

  dispatch(actions.showLoader())

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'license.print',
        out: 'doc_print',
        auth: sessionId,
        elid: priceId,
      }),
      { responseType: 'blob' },
    )
    .then(response => {
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'text/html' }),
      )
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('target', '_blank')
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)

      dispatch(actions.hideLoader())
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getCurrentStorageInfo = (elid, setInitialParams) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'storage.edit',
        out: 'json',
        auth: sessionId,
        lang: 'en',
        elid,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      const autoprolongList = data.doc.slist.filter(
        item => item.$name === 'autoprolong',
      )[0]
      const payment_method = data.doc.slist.filter(
        item => item.$name === 'stored_method',
      )[0]

      const {
        user,
        autoprolong,
        opendate,
        passwd,
        period,
        name,
        id,
        expiredate,
        createdate,
      } = data.doc

      setInitialParams({
        autoprolongList,
        autoprolong,
        opendate,
        passwd,
        period,
        name,
        user,
        id,
        expiredate,
        createdate,
        payment_method,
      })
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const editFTP = (elid, autoprolong, handleModal) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'storage.edit',
        out: 'json',
        auth: sessionId,
        lang: 'en',
        elid,
        autoprolong,
        clicked_button: 'ok',
        sok: 'ok',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      toast.success(i18n.t('Changes saved successfully', { ns: 'other' }), {
        position: 'bottom-right',
        toastId: 'customId',
      })
      dispatch(getFTPList({ p_num: 1 }))
      dispatch(actions.hideLoader())

      handleModal()
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getServiceInstruction = (elid, setInstruction) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'service.instruction.html',
        out: 'json',
        auth: sessionId,
        lang: i18n.language,
        elid,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)
      setInstruction(data.doc.body.$)

      dispatch(actions.hideLoader())
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getFTPFilters =
  (setFilters, data = {}, filtered = false, setEmptyFilter, signal, setIsLoading) =>
  (dispatch, getState) => {
    setIsLoading(true)

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'storage.filter',
          out: 'json',
          auth: sessionId,
          lang: 'en',
          ...data,
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        if (filtered) {
          setEmptyFilter && setEmptyFilter(true)
          return dispatch(
            getFTPList({ p_num: 1, p_cnt: data?.p_cnt }, signal, setIsLoading),
          )
        }

        let filters = {}

        data?.doc?.slist?.forEach(el => {
          filters[el.$name] = el.val
        })

        let currentFilters = {
          id: data.doc?.id?.$ || '',
          domain: data.doc?.domain?.$ || '',
          ip: data.doc?.ip?.$ || '',
          pricelist: data.doc?.pricelist?.$ || '',
          period: data.doc?.period?.$ || '',
          status: data.doc?.status?.$ || '',
          service_status: data.doc?.service_status?.$ || '',
          opendate: data.doc?.opendate?.$ || '',
          expiredate: data.doc?.expiredate?.$ || '',
          orderdatefrom: data.doc?.orderdatefrom?.$ || '',
          orderdateto: data.doc?.orderdateto?.$ || '',
          cost_from: data.doc?.cost_from?.$ || '',
          cost_to: data.doc?.cost_to?.$ || '',
          autoprolong: data.doc?.autoprolong?.$ || '',
          datacenter: data.doc?.datacenter?.$ || '',
          ostemplate: '',
        }

        setFilters({ filters, currentFilters })
        setIsLoading(false)
      })
      .catch(error => {
        if (error.message.includes('filter')) {
          dispatch(getFTPList({ p_num: 1 }, signal, setIsLoading))
        }

        checkIfTokenAlive(error.message, dispatch, true) && setIsLoading(false)
      })
  }

const deleteFtp = (id, closeFn, signal, setIsLoading) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'storage.delete',
        auth: sessionId,
        elid: id.join(', '),
        out: 'json',
        lang: 'en',
      }),
    )
    .then(({ data }) => {
      if (data.doc?.error) throw new Error(data.doc.error.msg.$)

      dispatch(getFTPList({}, signal, setIsLoading))
      closeFn()

      toast.success(
        i18n.t('server_deleted_success', { ns: 'other', id: `#${id.join(', #')}` }),
      )

      dispatch(actions.hideLoader())
    })
    .catch(err => {
      checkIfTokenAlive(err.message, dispatch)
      closeFn()

      dispatch(actions.hideLoader())
    })
}

export default {
  getTarifs,
  getFTPList,
  getParameters,
  orderFTP,
  getPrintLicense,
  getCurrentStorageInfo,
  editFTP,
  getServiceInstruction,
  getFTPFilters,
  deleteFtp,
}
