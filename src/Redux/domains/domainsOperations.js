import qs from 'qs'
import i18n from './../../i18n'
import { actions, domainsActions, cartActions } from '..'
import { axiosInstance } from '../../config/axiosInstance'
import { toast } from 'react-toastify'
import { errorHandler } from '../../utils'
import * as route from '../../routes'

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

          setDomains && setDomains(domains)
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

        setDomains && setDomains(domainsData)
        dispatch(actions.hideLoader())
      })
      .catch(error => {
        console.log('error', error)
        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const getDomainsContacts =
  (setDomains, body = {}, navigate) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'domain.order.contact',
          out: 'json',
          auth: sessionId,
          ...body,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) {
          toast.error(`${i18n.t(data.doc.error.msg.$, { ns: 'other' })}`, {
            position: 'bottom-right',
          })

          throw new Error(data.doc.error.msg.$)
        }

        const domainData = data.doc

        const d = {
          owner_email: domainData?.owner_email,
          owner_phone: domainData?.owner_phone?.$,

          owner_firstname: domainData?.owner_firstname,
          owner_firstname_locale: domainData?.owner_firstname_locale,
          owner_lastname: domainData?.owner_lastname,
          owner_lastname_locale: domainData?.owner_lastname_locale,
          owner_middlename: domainData?.owner_middlename,
          owner_middlename_locale: domainData?.owner_middlename_locale,

          owner_name: domainData?.owner_name,

          owner_location_country: domainData?.owner_location_country?.$,
          owner_location_address: domainData?.owner_location_address,
          owner_location_city: domainData?.owner_location_city,
          owner_location_postcode: domainData?.owner_location_postcode,
          owner_location_state: domainData?.owner_location_state,

          owner_profiletype: domainData?.owner_profiletype?.$,
          owner_contact_select: domainData?.owner_contact_select?.$,

          admin_contact_use_first: domainData?.admin_contact_use_first?.$,
          admin_email: domainData?.admin_email,
          admin_phone: domainData?.admin_phone?.$,

          admin_firstname: domainData?.admin_firstname,
          admin_firstname_locale: domainData?.admin_firstname_locale,
          admin_lastname: domainData?.admin_lastname,
          admin_lastname_locale: domainData?.admin_lastname_locale,
          admin_middlename: domainData?.admin_middlename,
          admin_middlename_locale: domainData?.admin_middlename_locale,

          admin_name: domainData?.admin_name,

          admin_location_country: domainData?.admin_location_country?.$,
          admin_location_address: domainData?.admin_location_address,
          admin_location_city: domainData?.admin_location_city,
          admin_location_postcode: domainData?.admin_location_postcode,
          admin_location_state: domainData?.admin_location_state,

          admin_profiletype: domainData?.admin_profiletype?.$,
          admin_contact_select: domainData?.admin_contact_select?.$,

          tech_contact_use_first: domainData?.tech_contact_use_first?.$,
          tech_email: domainData?.tech_email,
          tech_phone: domainData?.tech_phone?.$,

          tech_firstname: domainData?.tech_firstname,
          tech_firstname_locale: domainData?.tech_firstname_locale,
          tech_lastname: domainData?.tech_lastname,
          tech_lastname_locale: domainData?.tech_lastname_locale,
          tech_middlename: domainData?.tech_middlename,
          tech_middlename_locale: domainData?.tech_middlename_locale,

          tech_name: domainData?.tech_name,

          tech_location_country: domainData?.tech_location_country?.$,
          tech_location_address: domainData?.tech_location_address,
          tech_location_city: domainData?.tech_location_city,
          tech_location_postcode: domainData?.tech_location_postcode,
          tech_location_state: domainData?.tech_location_state,

          tech_profiletype: domainData?.tech_profiletype?.$,
          tech_contact_select: domainData?.tech_contact_select?.$,

          bill_contact_use_first: domainData?.bill_contact_use_first?.$,
          bill_email: domainData?.bill_email,
          bill_phone: domainData?.bill_phone?.$,

          bill_firstname: domainData?.bill_firstname,
          bill_firstname_locale: domainData?.bill_firstname_locale,
          bill_lastname: domainData?.bill_lastname,
          bill_lastname_locale: domainData?.bill_lastname_locale,
          bill_middlename: domainData?.bill_middlename,
          bill_middlename_locale: domainData?.bill_middlename_locale,

          bill_name: domainData?.bill_name,

          bill_location_country: domainData?.bill_location_country?.$,
          bill_location_address: domainData?.bill_location_address,
          bill_location_city: domainData?.bill_location_city,
          bill_location_postcode: domainData?.bill_location_postcode,
          bill_location_state: domainData?.bill_location_state,

          bill_profiletype: domainData?.bill_profiletype?.$,
          bill_contact_select: domainData?.bill_contact_select?.$,
        }

        domainData?.slist?.forEach(el => {
          if (
            el?.$name === 'owner_contact_select' ||
            el?.$name === 'owner_profiletype' ||
            el?.$name === 'owner_location_country' ||
            el?.$name === 'admin_contact_select' ||
            el?.$name === 'admin_profiletype' ||
            el?.$name === 'admin_location_country' ||
            el?.$name === 'tech_contact_select' ||
            el?.$name === 'tech_profiletype' ||
            el?.$name === 'tech_location_country' ||
            el?.$name === 'bill_contact_select' ||
            el?.$name === 'bill_profiletype' ||
            el?.$name === 'bill_location_country'
          ) {
            d[`${el.$name}_list`] = el.val
          }
        })

        setDomains && setDomains(d)
        if (body?.sok === 'ok') {
          delete body['sok']
          delete body['snext']
          navigate && navigate(route.DOMAINS_NS, { state: { contacts: body } })
        }
        dispatch(actions.hideLoader())
      })
      .catch(error => {
        console.log('error', error)
        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const getDomainsNS =
  (body = {}, setNS) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'domain.order.ns',
          out: 'json',
          auth: sessionId,
          hfields: 'bill_company',
          ...body,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        const domainData = data.doc

        setNS && setNS(domainData)
        dispatch(actions.hideLoader())
      })
      .catch(error => {
        console.log('error', error)
        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const getDomainPaymentInfo =
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
          func: 'domain.order.payment',
          out: 'json',
          ...body,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        const selectedDomains = body?.selected_domain?.split(', ')

        const paymentData = {}

        selectedDomains?.forEach(selected => {
          paymentData[`autoprolong_${selected}`] = data?.doc[`autoprolong_${selected}`]

          paymentData[`licence_link_${selected}`] = data?.doc[`licence_link_${selected}`]

          paymentData[`licence_agreement_${selected}`] =
            data?.doc[`licence_agreement_${selected}`]

          paymentData[`domain_${selected}_details`] =
            data?.doc[`domain_${selected}_details`]

          paymentData[`domain_${selected}_details`] =
            data?.doc[`domain_${selected}_details`]

          data?.doc?.slist?.forEach(s => {
            if (s?.$name === `autoprolong_${selected}`) {
              paymentData[`autoprolong_${selected}_list`] = s?.val
            }
          })
        })

        data?.doc?.metadata?.form?.field?.forEach(field => {
          if (field?.$name?.includes('addon')) {
            paymentData[field?.$name] = data?.doc[field?.$name]
            paymentData[`${field?.$name}_sum`] = data?.doc?.messages?.msg[field?.$name]
          }
        })

        setData && setData(paymentData)
        dispatch(actions.hideLoader())
      })
      .catch(error => {
        console.log('error', error)
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
          ...body,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) {
          toast.error(`${i18n.t(data.doc.error.msg.$, { ns: 'other' })}`, {
            position: 'bottom-right',
          })

          throw new Error(data.doc.error.msg.$)
        }

        dispatch(
          cartActions.setCartIsOpenedState({
            isOpened: true,
            redirectPath: route.DOMAINS,
          }),
        )
        dispatch(actions.hideLoader())
      })
      .catch(error => {
        console.log(error)

        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const getTermsOfConditionalText = link => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .get(`${link}&auth=${sessionId}`, { responseType: 'blob' })
    .then(response => {
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'text/html' }),
      )
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('target', '__blank')
      link.setAttribute('rel', 'noopener noreferrer')
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)

      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      dispatch(actions.hideLoader())
    })
}

export default {
  getDomains,
  getDomainsOrderName,
  createDomain,
  getDomainsContacts,
  getDomainsNS,
  getDomainPaymentInfo,
  getTermsOfConditionalText,
}
