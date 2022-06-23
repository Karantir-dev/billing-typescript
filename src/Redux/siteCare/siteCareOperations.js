import qs from 'qs'
import i18n from '../../i18n'
import {
  actions,
  //  cartActions,
  siteCareActions,
} from '..'
import { axiosInstance } from '../../config/axiosInstance'
import { toast } from 'react-toastify'
import { errorHandler } from '../../utils'
// import * as route from '../../routes'

const getSiteCare =
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
          func: 'zabota-o-servere',
          out: 'json',
          auth: sessionId,
          p_cnt: 30,
          p_col: '+time',
          clickstat: 'yes',
          ...body,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        const elem = data?.doc?.elem || []
        const count = data?.doc?.p_elems?.$ || 0

        dispatch(siteCareActions.setSiteCareList(elem))
        dispatch(siteCareActions.setSiteCareCount(count))
        dispatch(getSiteCareFilters())
      })
      .catch(error => {
        console.log('error', error)
        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const getSiteCareFilters =
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
          func: 'zabota-o-servere.filter',
          out: 'json',
          auth: sessionId,
          ...body,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        if (filtered) {
          return dispatch(getSiteCare())
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

        dispatch(siteCareActions.setSiteCareFilters(currentFilters))
        dispatch(siteCareActions.setSiteCareFiltersLists(filters))
        dispatch(actions.hideLoader())
      })
      .catch(error => {
        console.log('error', error)
        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const getHistorySiteCare =
  (body = {}, setHistoryModal, setHistoryList) =>
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
          p_cnt: 10000,
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

        setHistoryList && setHistoryList(data?.doc?.elem)
        setHistoryModal && setHistoryModal(true)

        dispatch(actions.hideLoader())
      })
      .catch(error => {
        console.log(error)

        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const prolongSiteCare =
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
          toast.success(i18n.t('Prolonged successfully', { ns: 'virtual_hosting' }), {
            position: 'bottom-right',
          })
          return dispatch(getSiteCare())
        }

        dispatch(actions.hideLoader())
      })
      .catch(error => {
        console.log(error)

        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const editSiteCare =
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
          func: 'zabota-o-servere.edit',
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

        console.log(data.doc)

        const d = {
          title_name: data?.doc?.title_name?.$,
          createdate: data?.doc?.createdate?.$,
          expiredate: data?.doc?.expiredate?.$,
          status: data?.doc?.status?.$,
          period: data?.doc?.period?.$,
          orderinfo: data?.doc?.orderinfo?.$,

          autoprolong: data?.doc?.autoprolong?.$,
          stored_method: data?.doc?.stored_method?.$,
          ipServer: data?.doc?.ipServer?.$,
          loginServer: data?.doc?.loginServer?.$,
          passwordServer: data?.doc?.passwordServer?.$,
          port: data?.doc?.port?.$,
          url: data?.doc?.url?.$,
          pause: data?.doc?.pause?.$,
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
            i18n.t('Site care edited successfully', { ns: 'virtual_hosting' }),
            {
              position: 'bottom-right',
            },
          )
          return dispatch(getSiteCare())
        }

        dispatch(actions.hideLoader())
      })
      .catch(error => {
        console.log(error)

        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const deleteSiteCare =
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
          func: 'zabota-o-servere.delete',
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

        toast.success(i18n.t('Site care deleted successfully', { ns: 'domains' }), {
          position: 'bottom-right',
        })

        dispatch(siteCareActions.deleteSiteCare(body?.elid))

        dispatch(actions.hideLoader())
      })
      .catch(error => {
        console.log(error)

        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

export default {
  getSiteCare,
  getSiteCareFilters,
  prolongSiteCare,
  deleteSiteCare,
  editSiteCare,
  getHistorySiteCare,
}
