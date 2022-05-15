import qs from 'qs'
import { actions, payersActions } from '..'
import { axiosInstance } from '../../config/axiosInstance'
// import { toast } from 'react-toastify'
// import i18n from '../../i18n'

const getPayers =
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
        dispatch(actions.hideLoader())
      })
      .catch(error => {
        console.log('error', error)
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
      dispatch(actions.hideLoader())
    })
}

const getPayerModalInfo = () => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        // profiletype: 1,
        func: 'profile.add.country',
        out: 'json',
        auth: sessionId,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)
      console.log(data.doc)
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
}
