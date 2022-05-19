import qs from 'qs'
import authActions from './authActions'
import { actions } from '../'
import { axiosInstance } from './../../config/axiosInstance'
import userOperations from '../userInfo/userOperations'

const SERVER_ERR_MSG = 'auth_error'

const login = (email, password, reCaptcha, setErrMsg, resetRecaptcha) => dispatch => {
  dispatch(actions.showLoader())

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'auth',
        username: email,
        password: password,
        sok: 'ok',
        out: 'json',
        'g-recaptcha-response': reCaptcha,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) {
        setErrMsg(data.doc.error.$object)

        throw new Error(data.doc.error.msg.$)
      }
      const sessionId = data.doc.auth.$id

      return axiosInstance
        .post(
          '/',
          qs.stringify({
            func: 'usrparam',
            sok: 'ok',
            out: 'json',
            auth: sessionId,
          }),
        )
        .then(({ data }) => {
          if (data.doc?.error) {
            if (data.doc.error.$type === 'extraconfirm') {
              dispatch(authActions.setTemporaryId(sessionId))

              dispatch(actions.hideLoader())

              dispatch(authActions.openTotpForm())
              return
            } else {
              throw new Error(`usrparam - ${data.doc.error.msg.$}`)
            }
          }

          dispatch(authActions.loginSuccess(sessionId))
          dispatch(userOperations.getUserInfo(sessionId))
        })
    })
    .catch(error => {
      resetRecaptcha()
      dispatch(actions.hideLoader())
      setErrMsg(SERVER_ERR_MSG)
      console.log('auth -', error.message)
    })
}

const getCurrentSessionStatus = () => (dispatch, getState) => {
  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'keepalive',
        auth: sessionId,
        out: 'json',
      }),
    )
    .then(data => {
      if (data.status === 200) {
        if (data?.data?.doc?.error?.$type === 'access') {
          dispatch(authActions.logoutSuccess())
        }
      } else {
        throw new Error(data.doc.error.msg.$)
      }
    })
    .catch(e => {
      console.log('error during getCurrentSessionStatus', e.message)
    })
}

const sendTotp = (totp, setError) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { temporaryId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'totp.confirm',
        sok: 'ok',
        out: 'json',
        clicked_button: 'ok',
        qrcode: totp,
        auth: temporaryId,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) {
        setError(true)
        throw new Error(data.doc.error.msg.$)
      }

      dispatch(authActions.clearTemporaryId())
      dispatch(authActions.loginSuccess(data.doc.auth.$id))
    })
    .catch(err => {
      dispatch(actions.hideLoader())
      console.log('totp.confirm - ', err.message)
    })
}

const reset = (email, setEmailSended, setErrorType, setErrorTime) => dispatch => {
  dispatch(actions.showLoader())

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'recovery',
        email,
        sok: 'ok',
        out: 'json',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) {
        setErrorType(data.doc.error.$type)

        if (data.doc.error.$type === 'min_email_send_timeout') {
          setErrorTime(data.doc.error.param[1].$)
        }

        throw new Error(data.doc.error.msg.$)
      }

      setEmailSended(true)
      dispatch(actions.hideLoader())
    })
    .catch(err => {
      dispatch(actions.hideLoader())
      console.log('recovery - ', err.message)
    })
}

const changePassword =
  (password, userId, secretKey, setErrType, onChangeSuccess) => dispatch => {
    dispatch(actions.showLoader())

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'recovery.change',
          sok: 'ok',
          userid: userId,
          secret: secretKey,
          password,
          confirm: password,
          out: 'json',
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) {
          setErrType(data.doc.error.$type)
          throw new Error(data.doc.error.msg.$)
        }

        axiosInstance.post(
          '/',
          qs.stringify({
            func: 'logon',
            auth: data.doc.auth.$id,
            sok: 'ok',
            out: 'json',
          }),
        )

        onChangeSuccess()
        dispatch(actions.hideLoader())
      })
      .catch(err => {
        dispatch(actions.hideLoader())
        console.log('recovery.change - ', err.message)
      })
  }

const logout = () => (dispatch, getState) => {
  const {
    auth: { sessionId },
  } = getState()

  dispatch(actions.showLoader())

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'logon',
        auth: sessionId,
        sok: 'ok',
        out: 'json',
      }),
    )
    .then(data => {
      if (data.status === 200) {
        dispatch(authActions.logoutSuccess())
        dispatch(actions.hideLoader())
      } else {
        throw new Error(data.doc.error.msg.$)
      }
    })
    .catch(e => {
      console.log('error during logging out', e.message)
      dispatch(actions.hideLoader())
    })
}

const getCountries = (setCountries, setStates, setErrMsg) => dispatch => {
  dispatch(actions.showLoader())

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'register',
        out: 'json',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) {
        throw new Error(data.doc.error.msg.$)
      }

      const countries = data.doc.slist[0].val
      const states = data.doc.slist[1].val
      countries.shift()

      setCountries(countries)
      setStates(states)

      dispatch(actions.hideLoader())
    })
    .catch(err => {
      dispatch(actions.hideLoader())
      setErrMsg(SERVER_ERR_MSG)
      console.log('getCountries - ', err.message)
    })
}

const register = (values, setErrMsg, successRegistration, resetRecaptcha) => dispatch => {
  dispatch(actions.showLoader())

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'register',
        realname: values.name,
        email: values.email,
        passwd: values.password,
        confirm: values.passConfirmation,
        country: values.country,
        state: values.region,
        'g-recaptcha-response': values.reCaptcha,
        out: 'json',
        sok: 'ok',
      }),
      {
        // withCredentials: true,
      },
    )
    .then(({ data }) => {
      if (data.doc.error) {
        setErrMsg(data.doc.error.$type)
        throw new Error(data.doc.error.msg.$)
      }
      successRegistration()

      dispatch(actions.hideLoader())
    })
    .catch(err => {
      resetRecaptcha()
      dispatch(actions.hideLoader())
      setErrMsg(SERVER_ERR_MSG)
      console.log('registration - ', err.message)
    })
}

export default {
  login,
  register,
  reset,
  changePassword,
  sendTotp,
  logout,
  getCountries,
  getCurrentSessionStatus,
}
