import qs from 'qs'
import i18n from '@src/i18n'
import { actions, cartActions, vhostActions } from '@redux'
import { axiosInstance } from '@config/axiosInstance'
import { toast } from 'react-toastify'
import { checkIfTokenAlive } from '@utils'
import * as route from '@src/routes'

const getVhosts =
  (body = {}) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'vhost',
          out: 'json',
          auth: sessionId,
          p_cnt: body?.p_cnt || 10,
          p_col: '+time',
          lang: 'en',
          clickstat: 'yes',
          ...body,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)
        // const elem = data?.doc?.elem || []
        const virtualHostingRenderData = {
          vhostList: data?.doc?.elem || [],
          vhostPageRights: data?.doc?.metadata?.toolbar,
        }

        const count = data?.doc?.p_elems?.$ || 0

        dispatch(vhostActions.setVhostList(virtualHostingRenderData))
        dispatch(vhostActions.setVhostCount(count))
        dispatch(getVhostFilters())
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const getVhostFilters =
  (body = {}, filtered = false) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'vhost.filter',
          out: 'json',
          auth: sessionId,
          lang: 'en',
          ...body,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        if (filtered) {
          return dispatch(getVhosts({ p_cnt: body?.p_cnt }))
        }

        let filters = {}

        data?.doc?.slist?.forEach(el => {
          filters[el.$name] = el.val
        })

        let currentFilters = {
          id: data.doc?.id?.$ || '',
          ip: data.doc?.ip?.$ || '',
          domain: data.doc?.domain?.$ || '',
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
        }

        dispatch(vhostActions.setVhostFilters(currentFilters))
        dispatch(vhostActions.setVhostFiltersLists(filters))
        dispatch(actions.hideLoader())
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const getHistoryVhost =
  (body = {}, setHistoryModal, setHistoryList, setHistoryItemCount) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          auth: sessionId,
          func: 'service.history',
          out: 'json',
          p_cnt: 10,
          ...body,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) {
          toast.error(`${i18n.t(data.doc.error.msg.$.trim(), { ns: 'other' })}`, {
            position: 'bottom-right',
          })

          throw new Error(data.doc.error.msg.$)
        }

        setHistoryItemCount && setHistoryItemCount(data?.doc?.p_elems?.$ || 0)
        setHistoryList && setHistoryList(data?.doc?.elem)
        setHistoryModal && setHistoryModal(true)

        dispatch(actions.hideLoader())
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const getInsructionVhost =
  (body = {}, setInstructionModal, setInstructionData) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          auth: sessionId,
          func: 'service.instruction.html',
          ...body,
        }),
      )
      .then(response => {
        if (
          response?.data?.trim() ===
          'Ошибка формирования инструкции. Пожалуйста, обратитесь в техническую поддержку'
        ) {
          toast.error(
            'Ошибка формирования инструкции. Пожалуйста, обратитесь в техническую поддержку',
            {
              position: 'bottom-right',
            },
          )
          return dispatch(actions.hideLoader())
        }
        setInstructionModal && setInstructionModal(true)
        setInstructionData && setInstructionData(response?.data)

        dispatch(actions.hideLoader())
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const openPlatformVhost =
  (body = {}) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          auth: sessionId,
          func: 'gotoserver',
          out: 'json',
          ...body,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) {
          toast.error(`${i18n.t(data.doc.error.msg.$.trim(), { ns: 'other' })}`, {
            position: 'bottom-right',
          })

          throw new Error(data.doc.error.msg.$)
        }

        if (data.doc.ok) {
          const link = document.createElement('a')
          link.href = data.doc.ok.$
          link.setAttribute('target', '__blank')
          link.setAttribute('rel', 'noopener noreferrer')
          document.body.appendChild(link)
          link.click()
          link.parentNode.removeChild(link)
        }

        dispatch(actions.hideLoader())
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const prolongVhost =
  (body = {}, setProlongModal, setProlongData) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          auth: sessionId,
          func: 'service.prolong',
          out: 'json',
          ...body,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) {
          toast.error(`${i18n.t(data.doc.error.msg.$.trim(), { ns: 'other' })}`, {
            position: 'bottom-right',
          })

          throw new Error(data.doc.error.msg.$)
        }

        const d = {
          title_name: data?.doc?.title_name?.$,
          expiredate: data?.doc?.expiredate?.$,
          newexpiredate: data?.doc?.newexpiredate?.$,
          status: data?.doc?.status?.$,
          period: data?.doc?.period?.$,

          item_status: data?.doc?.messages?.msg?.item_status,
          item_status_0: data?.doc?.messages?.msg?.item_status_0,
          item_status_1: data?.doc?.messages?.msg?.item_status_1,
          item_status_2: data?.doc?.messages?.msg?.item_status_2,
          item_status_2_2_16: data?.doc?.messages?.msg?.item_status_2_2_16,
          item_status_2_2_29: data?.doc?.messages?.msg?.item_status_2_2_29,
          item_status_2_genkey: data?.doc?.messages?.msg?.item_status_2_genkey,
          item_status_2_hardreboot: data?.doc?.messages?.msg?.item_status_2_hardreboot,
          item_status_2_reboot: data?.doc?.messages?.msg?.item_status_2_reboot,
          item_status_2_start: data?.doc?.messages?.msg?.item_status_2_start,
          item_status_2_stop: data?.doc?.messages?.msg?.item_status_2_stop,
          item_status_3: data?.doc?.messages?.msg?.item_status_3,
          item_status_3_abusesuspend:
            data?.doc?.messages?.msg?.item_status_3_abusesuspend,
          item_status_3_autosuspend: data?.doc?.messages?.msg?.item_status_3_autosuspend,
          item_status_3_employeesuspend:
            data?.doc?.messages?.msg?.item_status_3_employeesuspend,
          item_status_4: data?.doc?.messages?.msg?.item_status_4,
          item_status_5: data?.doc?.messages?.msg?.item_status_5,
          item_status_5_close: data?.doc?.messages?.msg?.item_status_5_close,
          item_status_5_hardreboot: data?.doc?.messages?.msg?.item_status_5_hardreboot,
          item_status_5_need_configure:
            data?.doc?.messages?.msg?.item_status_5_need_configure,
          item_status_5_open: data?.doc?.messages?.msg?.item_status_5_open,
          item_status_5_prolong: data?.doc?.messages?.msg?.item_status_5_prolong,
          item_status_5_reboot: data?.doc?.messages?.msg?.item_status_5_reboot,
          item_status_5_reopen: data?.doc?.messages?.msg?.item_status_5_reopen,
          item_status_5_resume: data?.doc?.messages?.msg?.item_status_5_resume,
          item_status_5_suspend: data?.doc?.messages?.msg?.item_status_5_suspend,
          item_status_5_transfer: data?.doc?.messages?.msg?.item_status_5_transfer,
          item_status_hardreboot: data?.doc?.messages?.msg?.item_status_hardreboot,
          item_status_reboot: data?.doc?.messages?.msg?.item_status_reboot,
          item_status_service_nosuitable:
            data?.doc?.messages?.msg?.item_status_service_nosuitable,
        }

        data?.doc?.slist?.forEach(list => {
          if (list?.$name === 'period') {
            d['period_list'] = list?.val
          }
        })

        setProlongData && setProlongData(d)
        setProlongModal && setProlongModal(true)

        if (body?.sok === 'ok') {
          setProlongData && setProlongData(null)
          setProlongModal && setProlongModal(false)
          dispatch(
            cartActions.setCartIsOpenedState({
              isOpened: true,
              redirectPath: route.SHARED_HOSTING,
            }),
          )
        }

        dispatch(actions.hideLoader())
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const editVhost =
  (body = {}, setEditModal, setEditData) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          auth: sessionId,
          func: 'vhost.edit',
          out: 'json',
          ...body,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) {
          toast.error(`${i18n.t(data.doc.error.msg.$.trim(), { ns: 'other' })}`, {
            position: 'bottom-right',
          })

          throw new Error(data.doc.error.msg.$)
        }

        const d = {
          title_name: data?.doc?.title_name?.$,
          createdate: data?.doc?.createdate?.$,
          expiredate: data?.doc?.expiredate?.$,
          status: data?.doc?.status?.$,
          period: data?.doc?.period?.$,
          orderinfo: data?.doc?.orderinfo?.$,

          autoprolong: data?.doc?.autoprolong?.$,
          ip: data?.doc?.ip?.$,
          stored_method: data?.doc?.stored_method?.$,
          domain: data?.doc?.domain?.$,
          username: data?.doc?.username?.$,
          password: data?.doc?.password?.$,
          nameserver1: data?.doc?.nameserver1?.$,
          nameserver2: data?.doc?.nameserver2?.$,
          nameserver3: data?.doc?.nameserver3?.$,
          nameserver4: data?.doc?.nameserver4?.$,
        }

        data.doc?.slist?.forEach(list => {
          if (list?.$name === 'stored_method' || list?.$name === 'autoprolong') {
            d[`${list?.$name}_list`] = list?.val?.filter(
              v => v?.$key && v?.$key?.length > 0,
            )
          }
        })

        setEditData && setEditData(d)
        setEditModal && setEditModal(true)

        if (body?.sok === 'ok') {
          setEditData && setEditData(null)
          setEditModal && setEditModal(false)
          toast.success(
            i18n.t('Shared hosting edited successfully', { ns: 'virtual_hosting' }),
            {
              position: 'bottom-right',
            },
          )
          return dispatch(getVhosts())
        }

        dispatch(actions.hideLoader())
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const changeTariffVhost =
  (body = {}, setChangeTariffModal, setChangeTariffData) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          auth: sessionId,
          func: 'service.changepricelist',
          out: 'json',
          lang: 'en',
          ...body,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) {
          toast.error(`${i18n.t(data.doc.error.msg.$.trim(), { ns: 'other' })}`, {
            position: 'bottom-right',
          })

          throw new Error(data.doc.error.msg.$)
        }

        const d = {}

        data.doc?.slist?.forEach(list => {
          if (list?.$name === 'pricelist') {
            d[`${list?.$name}_list`] = list?.val?.filter(
              v => v?.$key && v?.$key?.length > 0,
            )
          }
        })

        setChangeTariffData && setChangeTariffData(d)
        setChangeTariffModal && setChangeTariffModal(true)

        dispatch(actions.hideLoader())
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const changeTariffPriceListVhost =
  (body = {}, setChangeTariffData) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          auth: sessionId,
          func: 'service.changepricelist.pricelist',
          out: 'json',
          lang: 'en',
          ...body,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) {
          toast.error(`${i18n.t(data.doc.error.msg.$.trim(), { ns: 'other' })}`, {
            position: 'bottom-right',
          })

          throw new Error(data.doc.error.msg.$)
        }

        const d = {
          money_info: data.doc?.money_info?.$,
          newprice: data.doc?.newprice?.$,
          newpricelist: data.doc?.newpricelist?.$,
          oldprice: data.doc?.oldprice?.$,
          oldpricelist: data.doc?.oldpricelist?.$,

          oldDate: data.doc?.oldexpiredate?.$,
          newDate: data.doc?.newexpiredate?.$,
        }

        setChangeTariffData && setChangeTariffData(d)

        dispatch(actions.hideLoader())
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const changeTariffSaveVhost =
  (body = {}, setChangeTariffModal, setChangeTariffData) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          auth: sessionId,
          func: 'service.changepricelist.getmoney',
          out: 'json',
          lang: 'en',
          ...body,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) {
          toast.error(`${i18n.t(data.doc.error.msg.$.trim(), { ns: 'other' })}`, {
            position: 'bottom-right',
          })

          throw new Error(data.doc.error.msg.$)
        }

        toast.success(
          i18n.t('Shared hosting tariff changed successfully', { ns: 'virtual_hosting' }),
          {
            position: 'bottom-right',
          },
        )

        setChangeTariffData && setChangeTariffData(null)
        setChangeTariffModal && setChangeTariffModal(false)

        dispatch(getVhosts())
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const orderVhost =
  (body = {}, setData) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          auth: sessionId,
          func: 'vhost.order.pricelist',
          out: 'json',
          lang: 'en',
          ...body,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) {
          toast.error(`${i18n.t(data.doc.error.msg.$.trim(), { ns: 'other' })}`, {
            position: 'bottom-right',
          })

          throw new Error(data.doc.error.msg.$)
        }

        const d = {
          period: data.doc?.period?.$,
          datacenter: data.doc?.datacenter?.$,
        }

        data.doc?.slist?.forEach(list => {
          if (list?.$name === 'period') {
            d[`${list?.$name}_list`] = list?.val?.filter(
              v => v?.$key && v?.$key?.length > 0,
            )
          }
        })

        data.doc?.list?.forEach(list => {
          if (list?.$name === 'tariflist') {
            d[`${list?.$name}_list`] = list?.elem
          }
        })

        setData && setData(d)

        dispatch(actions.hideLoader())
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const orderParamVhost =
  (body = {}, setParamsData) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          auth: sessionId,
          func: 'vhost.order.param',
          out: 'json',
          lang: 'en',
          ...body,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) {
          toast.error(`${i18n.t(data.doc.error.msg.$.trim(), { ns: 'other' })}`, {
            position: 'bottom-right',
          })

          throw new Error(data.doc.error.msg.$)
        }

        const d = {
          autoprolong: data.doc?.autoprolong?.$,
          orderinfo: data.doc?.orderinfo?.$,
        }

        data.doc?.slist?.forEach(list => {
          if (list?.$name === 'autoprolong') {
            d[`${list?.$name}_list`] = list?.val?.filter(
              v => v?.$key && v?.$key?.length > 0,
            )
          }
        })

        if (body?.sok === 'ok') {
          dispatch(
            cartActions?.setCartIsOpenedState({
              isOpened: true,
              redirectPath: route.SHARED_HOSTING,
            }),
          )
        } else {
          setParamsData && setParamsData(d)
        }

        dispatch(actions.hideLoader())
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

export default {
  getVhosts,
  getVhostFilters,
  getHistoryVhost,
  getInsructionVhost,
  openPlatformVhost,
  prolongVhost,
  editVhost,
  changeTariffVhost,
  changeTariffPriceListVhost,
  changeTariffSaveVhost,
  orderVhost,
  orderParamVhost,
}
