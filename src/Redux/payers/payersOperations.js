import qs from 'qs'
import { actions, payersActions } from '..'
import { axiosInstance } from '../../config/axiosInstance'
import { errorHandler } from '../../utils'

const getPayers =
  (body = {}) =>
  (dispatch, getState) => {
    // dispatch(actions.showLoader())

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

        dispatch(payersActions.setPayersList(elem))
        dispatch(payersActions.setPayersCount(count))
        dispatch(getPayerCountryType())
      })
      .catch(error => {
        console.log('error', error)
        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const getPayerCountryType = () => (dispatch, getState) => {
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
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      const filters = {}

      data?.doc?.slist?.forEach(el => {
        filters[el.$name] = el?.val
      })

      dispatch(payersActions.setPayersSelectLists(filters))
      // dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      errorHandler(error.message, dispatch)
      dispatch(actions.hideLoader())
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
        elid,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)

      dispatch(payersActions.deletePayer(elid))
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      errorHandler(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getPayerModalInfo =
  (body = {}, isCreate = false, closeModal) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())
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
          ...body,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        if (isCreate) {
          closeModal()
          return dispatch(getPayers())
        }

        let linkName = ''

        let passportField = false

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
        }

        const filters = {}

        data?.doc?.slist?.forEach(el => {
          if (el?.$name === 'maildocs') filters[el.$name] = el?.val
        })

        dispatch(payersActions.setPayersSelectedFields(selectedFields))

        dispatch(payersActions.updatePayersSelectLists(filters))

        dispatch(actions.hideLoader())
      })
      .catch(error => {
        console.log('error', error)
        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const getPayerEditInfo =
  (body = {}, isCreate = false, closeModal) =>
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
          ...body,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        if (isCreate) {
          closeModal()
          return dispatch(getPayers())
        }

        let passportField = false

        data.doc?.metadata?.form?.page?.forEach(e => {
          if (e?.$name === 'contract' && e?.field && e?.field?.length !== 0) {
            e?.field?.forEach(field => {
              if (field?.$name === 'passport') {
                passportField = true
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
          postcode_physical: data.doc?.postcode_physical?.$ || '',
          passport: data.doc?.passport?.$ || '',
          passport_field: passportField,
        }

        const filters = {}

        data?.doc?.slist?.forEach(el => {
          if (el?.$name === 'maildocs') filters[el.$name] = el?.val
        })

        dispatch(payersActions.setPayersSelectedFields(selectedFields))

        dispatch(payersActions.updatePayersSelectLists(filters))

        dispatch(actions.hideLoader())
      })
      .catch(error => {
        console.log('error', error)
        errorHandler(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const getPayerOfferText = link => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

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
    .catch(error => {
      console.log('error', error)
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
