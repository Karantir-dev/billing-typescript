import qs from 'qs'
import i18n from './../../i18n'
import { actions, domainsActions } from '..'
import { axiosInstance } from '../../config/axiosInstance'
import { toast } from 'react-toastify'
import { errorHandler } from '../../utils'

const getDomains =
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
          func: 'domain',
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

        dispatch(domainsActions.setDomainsList(elem))
        dispatch(domainsActions.setDomainsCount(count))
        dispatch(actions.hideLoader())
      })
      .catch(error => {
        console.log('error', error)
        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const getDomainsOrderName =
  (setDomains, body = {}, search = false) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'domain.order.name',
          out: 'json',
          auth: sessionId,
          ...body,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        const domainData = data.doc

        const domains = []
        if (!search) {
          domainData?.list?.forEach(l => {
            if (l?.$name === 'pricelist_info') {
              l?.elem.forEach(e => {
                if (e?.id) {
                  domains.push(e)
                }
              })
            }
          })

          setDomains(domains)
          return dispatch(actions.hideLoader())
        }

        domainData?.list?.forEach(l => {
          if (l?.$name === 'domain_list') {
            l?.elem.forEach(e => {
              if (e?.id) {
                domains.push(e)
              }
            })
          }
        })

        if (!domainData?.list) {
          toast.error(`${i18n.t('No matching options', { ns: 'other' })}`, {
            position: 'bottom-right',
          })
        }

        const selected = []
        if (domainData) {
          for (let key in domainData) {
            if (Object.prototype.hasOwnProperty.call(domainData, key)) {
              if (key.includes('select_domain_')) {
                selected.push(key)
              }
            }
          }
        }

        const domainsData = {
          list: domains,
          checked_domain: domainData?.checked_domain,
          selected: selected,
          domain_name: domainData?.tparams?.domain_name?.$,
        }

        setDomains(domainsData)
        dispatch(actions.hideLoader())
      })
      .catch(error => {
        console.log('error', error)
        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const registerDomainsOrderName =
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
          func: 'domain.order.name',
          out: 'json',
          auth: sessionId,
          sok: 'ok',
          snext: 'ok',
          ...body,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        delete body['sv_field']

        body['checked_domain'] = data?.doc?.checked_domain?.$

        axiosInstance
          .post(
            '/',
            qs.stringify({
              func: 'domain.order.name',
              out: 'json',
              auth: sessionId,
              sok: 'ok',
              snext: 'ok',
              ...body,
            }),
          )
          .then(r => {
            if (r.data.doc.error) throw new Error(r.data.doc.error.msg.$)

            console.log(r?.data.doc)

            dispatch(createDomain(body))
            dispatch(actions.hideLoader())
          })
          .catch(error => {
            errorHandler(error.message, dispatch)
            dispatch(actions.hideLoader())
          })
      })
      .catch(error => {
        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const createDomain =
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
          func: 'domain.order.payment',
          sok: 'ok',
          out: 'json',
          checked_domain: body?.checked_domain,
          admin_contact_use_first: 'on',
          admin_fax: '+380',
          admin_fax_country: '230',
          admin_phone: '+380',
          admin_phone_country: '230',
          bill_contact_use_first: 'on',
          bill_fax: '+380',
          bill_fax_country: '230',
          bill_phone: '+380',
          bill_phone_country: '230',
          domain_action: 'register',
          domain_name: body?.domain_name,
          skipbasket: 'on',
          ns0: 'ns1.zomro.com',
          ns1: 'ns1.zomro.com',
          ns2: '',
          ns3: '',
          ns_additional: '',
          owner_contact_select: '1',
          owner_email: 'mikhail.tatochenko@zomro.org',
          owner_firstname: 'Mykhailo',
          owner_firstname_locale: 'Mykhailo',
          owner_lastname: 'Tatochenko',
          owner_lastname_locale: 'Tatochenko',
          owner_location_address: 'Kyiv',
          owner_location_city: 'Kyiv',
          owner_location_country: '230',
          owner_location_postcode: '321323',
          owner_location_state: 'Kyiv',
          owner_middlename: '',
          owner_middlename_locale: '',
          owner_name: 'BlaBlaBLa',
          owner_phone: '+380 (66) 666-66-66',
          owner_phone_country: '230',
          owner_private: 'off',
          owner_profiletype: '1',
          period: '12',
          selected_domain: body?.selected_domain,
          tech_contact_use_first: 'on',
          tech_fax: '+380',
          tech_fax_country: '230',
          tech_phone: '+380',
          tech_phone_country: '230',
          use_specific: 'off',
          'zoom-domain_name': body?.domain_name,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        console.log(data.doc)
        dispatch(actions.hideLoader())
      })
      .catch(error => {
        console.log('error', error)
        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

export default {
  getDomains,
  getDomainsOrderName,
  createDomain,
  registerDomainsOrderName,
}
