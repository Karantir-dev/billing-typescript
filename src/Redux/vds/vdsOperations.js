import qs from 'qs'
import { axiosInstance } from './../../config/axiosInstance'
import { actions, cartActions } from '../'
import authSelectors from '../auth/authSelectors'
import * as routes from '../../routes'
import { toast } from 'react-toastify'
import { checkIfTokenAlive, renameAddonFields } from '../../utils'
import { t } from 'i18next'
import i18n from './../../i18n'

const getVDS =
  ({ setServers, setRights, setElemsTotal, p_num, p_cnt, setServicesPerPage }) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())
    const sessionId = authSelectors.getSessionId(getState())

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'vds',
          p_cnt: p_cnt || '10',
          p_num: p_num || '1',
          auth: sessionId,
          out: 'json',
          lang: 'en',
        }),
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)

        setServers(data?.doc?.elem || [])
        setServicesPerPage && setServicesPerPage(data.doc?.p_cnt?.$)

        const rights = {}
        data.doc?.metadata?.toolbar?.toolgrp?.forEach(el => {
          el?.toolbtn?.forEach(elem => {
            rights[elem.$name] = true
          })
        })
        setRights && setRights(rights)

        setElemsTotal && setElemsTotal(data?.doc?.p_elems?.$)

        dispatch(actions.hideLoader())
      })
      .catch(err => {
        checkIfTokenAlive(err.message, dispatch)
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
        lang: 'en',
      }),
    )
    .then(({ data }) => {
      if (data.doc?.error) throw new Error(data.doc.error.msg.$)

      setInitialState(renameAddonFields(data.doc))

      dispatch(actions.hideLoader())
    })
    .catch(err => {
      checkIfTokenAlive(err.message, dispatch)
      dispatch(actions.hideLoader())
      console.log('getEditFieldsVDS - ', err.message)
    })
}

const editVDS =
  (
    elid,
    values,
    register,
    selectedField,
    mutateOptionsListData,
    setOrderInfo,
    getVDSHandler,
  ) =>
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
          [register.Control_panel]: values.Control_panel,
          stored_method: values.stored_method,
          [selectedField ? 'sv_field' : '']: selectedField,
          sok: 'ok',
          out: 'json',
          lang: 'en',
          clicked_button: values.clicked_button,
        }),
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)

        if (values.clicked_button === 'basket') {
          const billorder = data?.doc?.billorder?.$

          axiosInstance
            .post(
              '/',
              qs.stringify({
                func: 'basket',
                auth: sessionId,
                billorder,
                sok: 'ok',
              }),
            )
            .then(() => {
              dispatch(actions.hideLoader())

              dispatch(
                cartActions.setCartIsOpenedState({
                  isOpened: true,
                  redirectPath: routes.VDS,
                }),
              )
            })
        } else {
          const newAutoprolongList = data.doc?.slist?.[0]?.val
          mutateOptionsListData && mutateOptionsListData(newAutoprolongList)

          if (data.doc?.orderinfo?.$) {
            const price = data.doc?.orderinfo?.$.match(/Total amount: (.+?)(?= EUR)/)[1]
            let description = data.doc?.orderinfo?.$.match(
              /Control panel (.+?)(?=<br\/>)/,
            )[1].split(' - ')[2]
            description = `(${description})`

            setOrderInfo && setOrderInfo({ price, description })
          } else {
            setOrderInfo && setOrderInfo(null)
            toast.success(i18n.t('Changes saved successfully', { ns: 'other' }), {
              position: 'bottom-right',
            })
          }
        }

        getVDSHandler && getVDSHandler()

        dispatch(actions.hideLoader())
      })
      .catch(err => {
        checkIfTokenAlive(err.message, dispatch)
        getVDSHandler && getVDSHandler()
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
        lang: 'en',
      }),
    )
    .then(({ data }) => {
      if (data.doc?.error) throw new Error(data.doc.error.msg.$)

      setFormInfo(data.doc)
      setTariffsList(data?.doc?.list[0]?.elem)

      dispatch(actions.hideLoader())
    })
    .catch(err => {
      checkIfTokenAlive(err.message, dispatch)
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
        lang: 'en',
      }),
    )
    .then(({ data }) => {
      if (data.doc?.error) throw new Error(data.doc.error.msg.$)
      setTariffsList(data?.doc?.list[0]?.elem)
      dispatch(actions.hideLoader())
    })
    .catch(err => {
      checkIfTokenAlive(err.message, dispatch)
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

        setParametersInfo(renameAddonFields(data.doc))

        dispatch(actions.hideLoader())
      })
      .catch(err => {
        checkIfTokenAlive(err.message, dispatch)
        dispatch(actions.hideLoader())
        console.log('getTariffParameters - ', err)
      })
  }

const changeOrderFormField =
  (period, values, recipe, pricelist, fieldName, setParametersInfo, register) =>
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
          recipe: recipe,
          autoprolong: values.autoprolong,
          [register.CPU_count]: values.CPU_count,
          [register.Control_panel]: values.Control_panel,
          [register.Disk_space]: values.Disk_space,
          [register.IP_addresses_count]: values.IP_addresses_count,
          [register.Memory]: values.Memory,
          [register.Port_speed]: values.Port_speed.slice(0, 3),
          sv_field: fieldName,
          lang: 'en',
        }),
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)

        data.doc.doc.messages = data.doc.messages
        data.doc?.doc?.slist?.forEach(el => {
          if (el.$name === 'autoprolong') {
            el.val = data.doc?.slist[0]?.val
          }

          if (!Array.isArray(el.val)) {
            el.val = [el.val]
          }
        })

        setParametersInfo(renameAddonFields(data.doc.doc))

        dispatch(actions.hideLoader())
      })
      .catch(err => {
        checkIfTokenAlive(err.message, dispatch)
        dispatch(actions.hideLoader())
        console.log('changeOrderFormField - ', err)
      })
  }

const setOrderData =
  (period, count, recipe, values, pricelist, register, sale) => (dispatch, getState) => {
    dispatch(actions.showLoader())
    const sessionId = authSelectors.getSessionId(getState())

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
          recipe: recipe,
          [register.CPU_count]: values.CPU_count,
          [register.Control_panel]: values.Control_panel,
          [register.Disk_space]: values.Disk_space,
          [register.IP_addresses_count]: values.IP_addresses_count,
          [register.Memory]: values.Memory,
          [register.Port_speed]: values.Port_speed.slice(0, 3),
          licence_agreement: values.agreement,
          order_count: String(count),
          lang: 'en',
        }),
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)

        dispatch(
          cartActions.setCartIsOpenedState({
            isOpened: true,
            redirectPath: routes.VDS,
            salePromocode: sale,
          }),
        )
        dispatch(actions.hideLoader())
      })
      .catch(err => {
        checkIfTokenAlive(err.message, dispatch)
        dispatch(actions.hideLoader())
        console.log('setOrderData - ', err)
      })
  }

const deleteVDS = (id, setServers, closeFn, setElemsTotal) => (dispatch, getState) => {
  dispatch(actions.showLoader())
  const sessionId = authSelectors.getSessionId(getState())

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'vds.delete',
        auth: sessionId,
        elid: id.join(', '),
        out: 'json',
        lang: 'en',
      }),
    )
    .then(({ data }) => {
      if (data.doc?.error) throw new Error(data.doc.error.msg.$)

      dispatch(getVDS({ setServers, setElemsTotal }))
      closeFn()

      toast.success(t('server_deleted', { ns: 'other', id: `#${id.join(', #')}` }), {
        position: 'bottom-right',
      })
    })
    .catch(err => {
      checkIfTokenAlive(err.message, dispatch)
      closeFn()
      toast.error(t('unknown_error', { ns: 'other' }), {
        position: 'bottom-right',
      })
      dispatch(actions.hideLoader())
      console.log('deleteVDS - ', err)
    })
}

const changePassword = (id, passwd, confirm) => (dispatch, getState) => {
  dispatch(actions.showLoader())
  const sessionId = authSelectors.getSessionId(getState())

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'service.changepassword',
        auth: sessionId,
        elid: id,
        passwd: passwd,
        confirm: confirm,
        out: 'json',
        sok: 'ok',
        lang: 'en',
      }),
    )
    .then(({ data }) => {
      if (data.doc?.error) throw new Error(data.doc.error.msg.$)

      toast.success(
        `${t('passwd_change_success', { ns: 'vds' })} ${data.doc.banner[0].param.$}`,
        {
          position: 'bottom-right',
          toastId: 'customId',
        },
      )

      dispatch(actions.hideLoader())
    })
    .catch(err => {
      checkIfTokenAlive(err.message, dispatch)
      toast.error(t('unknown_error', { ns: 'other' }), {
        position: 'bottom-right',
      })
      dispatch(actions.hideLoader())
      console.log('changePassword - ', err)
    })
}

const groupChangePassword = (id, passwd, confirm) => (dispatch, getState) => {
  dispatch(actions.showLoader())
  const sessionId = authSelectors.getSessionId(getState())

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'groupedit',
        faction: 'service.changepassword',
        auth: sessionId,
        elid: id.join(', '),
        passwd: passwd,
        confirm: confirm,
        out: 'json',
        sok: 'ok',
        lang: 'en',
      }),
    )
    .then(({ data }) => {
      if (data.doc?.error) throw new Error(data.doc.error.msg.$)
      toast.success(`${t('passwd_change_success', { ns: 'vds' })} #${id.join(', #')}`, {
        position: 'bottom-right',
        toastId: 'customId',
      })

      dispatch(actions.hideLoader())
    })
    .catch(err => {
      checkIfTokenAlive(err.message, dispatch)
      toast.error(t('unknown_error', { ns: 'other' }), {
        position: 'bottom-right',
      })
      dispatch(actions.hideLoader())
      console.log('groupChangePassword - ', err)
    })
}

const rebootServer = id => (dispatch, getState) => {
  dispatch(actions.showLoader())
  const sessionId = authSelectors.getSessionId(getState())

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'service.reboot',
        auth: sessionId,
        elid: id.join(', '),
        out: 'json',
        lang: 'en',
      }),
    )
    .then(({ data }) => {
      if (data.doc?.error) throw new Error(data.doc.error.msg.$)

      toast.success(t('reboot_launched', { ns: 'vds' }) + `: #${id.join(', #')}`, {
        position: 'bottom-right',
      })
      dispatch(actions.hideLoader())
    })
    .catch(err => {
      checkIfTokenAlive(err.message, dispatch)
      toast.error(t('unknown_error', { ns: 'other' }), {
        position: 'bottom-right',
      })
      dispatch(actions.hideLoader())
      console.log('rebootServer - ', err)
    })
}

const getIpInfo = (id, setElements, setName) => (dispatch, getState) => {
  dispatch(actions.showLoader())
  const sessionId = authSelectors.getSessionId(getState())

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'service.ip',
        auth: sessionId,
        elid: id,
        out: 'json',
        lang: 'en',
      }),
    )
    .then(({ data }) => {
      if (data.doc?.error) throw new Error(data.doc.error.msg.$)

      setElements(data?.doc?.elem)
      setName(data.doc?.plname.$)

      dispatch(actions.hideLoader())
    })
    .catch(err => {
      checkIfTokenAlive(err.message, dispatch)
      dispatch(actions.hideLoader())
      console.log('getIpInfo - ', err)
    })
}

const getEditIPInfo = (serverID, id, setInitialState) => (dispatch, getState) => {
  dispatch(actions.showLoader())
  const sessionId = authSelectors.getSessionId(getState())

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'service.ip.edit',
        auth: sessionId,
        plid: serverID,
        elid: id,
        out: 'json',
        lang: 'en',
      }),
    )
    .then(({ data }) => {
      if (data.doc?.error) throw new Error(data.doc.error.msg.$)

      setInitialState(data.doc)
      dispatch(actions.hideLoader())
    })
    .catch(err => {
      checkIfTokenAlive(err.message, dispatch)
      dispatch(actions.hideLoader())
      console.log('getEditIPInfo - ', err)
    })
}

const changeDomainName =
  (serverID, id, domain, closeFn, setElements) => (dispatch, getState) => {
    dispatch(actions.showLoader())
    const sessionId = authSelectors.getSessionId(getState())

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'service.ip.edit',
          auth: sessionId,
          plid: serverID,
          elid: id,
          domain: domain,
          sok: 'ok',
          out: 'json',
          lang: 'en',
        }),
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)

        axiosInstance
          .post(
            '/',
            qs.stringify({
              func: 'service.ip',
              auth: sessionId,
              elid: serverID,
              out: 'json',
            }),
          )
          .then(({ data }) => {
            if (data.doc?.error) throw new Error(data.doc.error.msg.$)

            setElements(data?.doc?.elem)
          })
        closeFn()

        dispatch(actions.hideLoader())
        toast.success(i18n.t('Changes saved successfully', { ns: 'other' }), {
          position: 'bottom-right',
        })
      })
      .catch(err => {
        checkIfTokenAlive(err.message, dispatch)
        dispatch(actions.hideLoader())
        console.log('changeDomainName - ', err)
      })
  }

const setVdsFilters =
  (
    values,
    setFiltersState,
    setfiltersListState,
    setServers,
    setRights,
    setElemsTotal,
    setServicesPerPage,
    p_cnt,
  ) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())
    const sessionId = authSelectors.getSessionId(getState())

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'vds.filter',
          auth: sessionId,
          out: 'json',
          sok: 'ok',
          id: values?.id || '',
          ip: values?.ip || '',
          domain: values?.domain || '',
          pricelist: values?.pricelist || '',
          period: values?.period || '',
          status: values?.status || '',
          opendate: values?.opendate || '',
          expiredate: values?.expiredate || '',
          orderdatefrom: values?.orderdatefrom || '',
          orderdateto: values?.orderdateto || '',
          cost_from: values?.cost_from || '',
          cost_to: values?.cost_to || '',
          autoprolong: values?.autoprolong || '',
          datacenter: values?.datacenter || '',
          ostemplate: values?.ostemplate || '',
          lang: 'en',
        }),
      )
      .then(({ data }) => {
        if (data.doc?.error) throw new Error(data.doc.error.msg.$)

        axiosInstance
          .post(
            '/',
            qs.stringify({
              func: 'vds.filter',
              auth: sessionId,
              out: 'json',
            }),
          )
          .then(({ data }) => {
            if (data.doc?.error) throw new Error(data.doc.error.msg.$)

            setFiltersState(data.doc)
            data.doc?.slist?.forEach(el => {
              el.val.push({ $key: '', $: 'Not selected' })
            })
            const filtersList = {
              autoprolong: data.doc?.slist?.find(el => el.$name === 'autoprolong').val,
              ostemplate: data.doc?.slist?.find(el => el.$name === 'ostemplate').val,
              status: data.doc?.slist?.find(el => el.$name === 'status').val,
              datacenter: data.doc?.slist?.find(el => el.$name === 'datacenter').val,
              period: data.doc?.slist?.find(el => el.$name === 'period').val,
              pricelist: data.doc?.slist?.find(el => el.$name === 'pricelist')?.val,
            }
            setfiltersListState(filtersList)
          })

        dispatch(
          getVDS({ setServers, setRights, setElemsTotal, setServicesPerPage, p_cnt }),
        )
      })
      .catch(err => {
        if (err.message.includes('filter')) {
          dispatch(getVDS({ setServers, setRights, setElemsTotal }))
        }

        checkIfTokenAlive(err.message, dispatch)
        dispatch(actions.hideLoader())
        console.log('setVdsFilters - ', err)
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
  deleteVDS,
  changePassword,
  rebootServer,
  getIpInfo,
  getEditIPInfo,
  changeDomainName,
  setVdsFilters,
  groupChangePassword,
}
