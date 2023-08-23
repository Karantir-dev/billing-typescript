import qs from 'qs'
import { toast } from 'react-toastify'
import { actions, billingActions, payersActions } from '@redux'
import { axiosInstance } from '@config/axiosInstance'
import i18n from '@src/i18n'
import { checkIfTokenAlive } from '@utils'

const getPayers =
  (body = {}, signal, setIsLoading) =>
  (dispatch, getState) => {
    setIsLoading(true)

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'profile',
          out: 'json',
          auth: sessionId,
          p_col: '+time',
          clickstat: 'yes',
          ...body,
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        const elem = data?.doc?.elem || []
        const count = data?.doc?.p_elems?.$ || 0

        dispatch(
          payersActions.setPayersList(elem?.filter(({ name, id }) => name?.$ && id?.$)),
        )
        dispatch(payersActions.setPayersCount(count))
        dispatch(getPayerCountryType(signal, setIsLoading))
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch, true) && setIsLoading(false)
      })
  }

const getPayerCountryType = (signal, setIsLoading) => (dispatch, getState) => {
  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'profile.add.country',
        out: 'json',
        auth: sessionId,
      }),
      { signal },
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      const filters = {}

      data?.doc?.slist?.forEach(el => {
        filters[el.$name] = el?.val
      })

      dispatch(payersActions.setPayersSelectLists(filters))

      setIsLoading(false)
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch, true) && setIsLoading(false)
    })
}

const deletePayer = elid => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'profile.delete',
        out: 'json',
        auth: sessionId,
        lang: 'en',
        elid,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      dispatch(payersActions.deletePayer(elid))
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      if (
        error.message.trim() === 'You cannot delete the payer who already made payments'
      ) {
        toast.error(
          i18n.t('You cannot delete the payer who already made payments', {
            ns: 'payers',
          }),
          {
            position: 'bottom-right',
            toastId: 'customId',
          },
        )
      }

      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getPayerModalInfo =
  (
    body = {},
    isCreate = false,
    closeModal,
    setSelectedPayerFields,
    newPayer = false,
    loader = false,
  ) =>
  (dispatch, getState) => {
    loader === 'billing'
      ? dispatch(billingActions.showLoaderAutoPayment())
      : dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'profile.add.profiledata',
          out: 'json',
          auth: sessionId,
          lang: 'en',
          ...body,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) {
          if (data.doc.error.msg.$.includes('The VAT-number does not correspond to')) {
            toast.error(
              i18n.t('does not correspond to country', {
                ns: 'payers',
              }),
              {
                position: 'bottom-right',
                toastId: 'customId',
              },
            )
          }
          if (
            data.doc.error.msg.$.includes('The maximum number of payers') &&
            data.doc.error.msg.$.includes('Company')
          ) {
            toast.error(
              i18n.t('The maximum number of payers Company', {
                ns: 'payers',
              }),
              {
                position: 'bottom-right',
                toastId: 'customId',
              },
            )
          }
          if (
            data.doc.error?.$object === 'eu_vat' &&
            data.doc.error.msg.$.includes('field has invalid value')
          ) {
            toast.error(
              i18n.t('eu_vat field has invalid value', {
                ns: 'payers',
              }),
              {
                position: 'bottom-right',
                toastId: 'customId',
              },
            )
          }
          throw new Error(data.doc.error.msg.$)
        }

        if (isCreate) {
          closeModal()
          return dispatch(getPayers())
        }

        let linkName = ''
        let passportField = false
        let euVatField = false

        data.doc?.metadata?.form?.page?.forEach(e => {
          if (e?.$name === 'offer' && e?.field && e?.field?.length !== 0) {
            linkName = e?.field[0]?.$name
          }
          if (e?.$name === 'contract' && e?.field && e?.field?.length !== 0) {
            e?.field?.forEach(field => {
              if (field?.$name === 'passport') {
                passportField = true
              }
            })
          }
          if (e?.$name === 'buh_settings' && e?.field && e?.field?.length !== 0) {
            e?.field?.forEach(field => {
              if (field?.$name === 'eu_vat') {
                euVatField = true
              }
            })
          }
        })

        const linkRx = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1>(.*?)<\/a>/

        let link = ''
        let linkText = ''

        if (data.doc?.messages?.msg[`${linkName}_data`]?.match(linkRx)?.length > 0) {
          linkText = data.doc?.messages?.msg[`${linkName}_data`]?.match(linkRx)[3]
          link = data.doc?.messages?.msg[`${linkName}_data`]?.match(linkRx)[2]
        }

        const selectedFields = {
          country: data.doc?.country?.$ || '',
          country_physical: data.doc?.country_physical?.$ || '',
          profiletype: data.doc?.profiletype?.$ || '',
          offer_link: link || '',
          offer_name: linkText || '',
          offer_field: linkName || '',
          passport_field: passportField,
          eu_vat_field: euVatField,
          profile: newPayer ? 'new' : null,
        }

        const filters = {}

        data?.doc?.slist?.forEach(el => {
          if (el?.$name === 'maildocs') filters[el.$name] = el?.val
        })

        if (setSelectedPayerFields) {
          setSelectedPayerFields(selectedFields)
          return loader === 'billing'
            ? dispatch(billingActions.hideLoaderAutoPayment())
            : dispatch(actions.hideLoader())
        }

        dispatch(payersActions.setPayersSelectedFields(selectedFields))

        dispatch(payersActions.updatePayersSelectLists(filters))

        loader === 'billing'
          ? dispatch(billingActions.hideLoaderAutoPayment())
          : dispatch(actions.hideLoader())
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        loader === 'billing'
          ? dispatch(billingActions.hideLoaderAutoPayment())
          : dispatch(actions.hideLoader())
      })
  }

const getPayerEditInfo =
  (
    body = {},
    isCreate = false,
    closeModal,
    setSelectedPayerFields,
    cart = false,
    setPayerFieldList,
  ) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'profile.edit',
          out: 'json',
          auth: sessionId,
          lang: 'en',
          ...body,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) {
          if (data.doc.error.msg.$.includes('The VAT-number does not correspond to')) {
            toast.error(
              i18n.t('does not correspond to country', {
                ns: 'payers',
              }),
              {
                position: 'bottom-right',
                toastId: 'customId',
              },
            )
          }
          if (
            data.doc.error.msg.$.includes('The maximum number of payers') &&
            data.doc.error.msg.$.includes('Company')
          ) {
            toast.error(
              i18n.t('The maximum number of payers Company', {
                ns: 'payers',
              }),
              {
                position: 'bottom-right',
                toastId: 'customId',
              },
            )
          }
          if (
            data.doc.error?.$object === 'eu_vat' &&
            data.doc.error.msg.$.includes('field has invalid value')
          ) {
            toast.error(
              i18n.t('eu_vat field has invalid value', {
                ns: 'payers',
              }),
              {
                position: 'bottom-right',
                toastId: 'customId',
              },
            )
          }
          throw new Error(data.doc.error.msg.$)
        }

        if (isCreate) {
          closeModal && closeModal()
          return dispatch(getPayers())
        }

        let passportField = false
        let euVatField = false

        data.doc?.metadata?.form?.page?.forEach(e => {
          if (e?.$name === 'contract' && e?.field && e?.field?.length !== 0) {
            e?.field?.forEach(field => {
              if (field?.$name === 'passport') {
                passportField = true
              }
            })
          }
          if (e?.$name === 'buh_settings' && e?.field && e?.field?.length !== 0) {
            e?.field?.forEach(field => {
              if (field?.$name === 'eu_vat') {
                euVatField = true
              }
            })
          }
        })

        let mailDocs = ''
        if (Array.isArray(data.doc?.maildocs)) {
          mailDocs = data.doc?.maildocs.map(doc => doc.$).join(',')
        } else {
          mailDocs = data.doc?.maildocs?.$
        }

        const selectedFields = {
          country: data.doc?.country?.$ || '',
          country_physical: data.doc?.country_physical?.$ || '',
          profiletype: data.doc?.profiletype?.$ || '',
          address_physical: data.doc?.address_physical?.$ || '',
          city_physical: data.doc?.city_physical?.$ || '',
          email: data.doc?.email?.$ || '',
          maildocs: mailDocs || '',
          person: data.doc?.person?.$ || '',
          phone: data.doc?.phone?.$ || '',
          name: data.doc?.name?.$ || '',
          eu_vat: data.doc?.eu_vat?.$ || '',
          postcode_physical: data.doc?.postcode_physical?.$ || '',
          passport: data.doc?.passport?.$ || '',
          passport_field: passportField,
          eu_vat_field: euVatField,
          profile: data.doc?.elid?.$ || '',
        }

        const filters = {}

        data?.doc?.slist?.forEach(el => {
          if (el?.$name === 'maildocs') filters[el.$name] = el?.val
          if (el?.$name === 'profiletype') filters[el.$name] = el?.val
        })

        if (setSelectedPayerFields) {
          setSelectedPayerFields(selectedFields)
          setPayerFieldList && setPayerFieldList(filters)
          return cart
            ? setTimeout(() => dispatch(actions.hideLoader()), 1000)
            : dispatch(actions.hideLoader())
        }

        dispatch(payersActions.setPayersSelectedFields(selectedFields))
        dispatch(payersActions.updatePayersSelectLists(filters))

        dispatch(actions.hideLoader())
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const getPayerOfferText = link => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  link = `/billmgr?func=license.print&out=doc_print&elid=5768&auth=${sessionId}`
  axiosInstance
    .get(
      link,
      qs.stringify({
        auth: sessionId,
      }),
      { responseType: 'blob' },
    )
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
    .catch(err => {
      checkIfTokenAlive(err?.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

export default {
  getPayers,
  deletePayer,
  getPayerModalInfo,
  getPayerEditInfo,
  getPayerOfferText,
}
