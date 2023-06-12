import qs from 'qs'
import axios from 'axios'
import { actions, userOperations, authActions } from '@redux'
import { axiosInstance } from '@config/axiosInstance'
import { checkIfTokenAlive, cookies } from '@utils'
import { API_URL, SITE_URL } from '@config/config'

const SERVER_ERR_MSG = 'auth_error'

const login = (email, password, reCaptcha, setErrMsg, resetRecaptcha) => dispatch => {
  dispatch(actions.showLoader())
  cookies.eraseCookie('sessionId')

  const redirectID = localStorage.getItem('redirectID')

  const formDataLogin = new FormData()

  formDataLogin.append('func', 'auth')
  formDataLogin.append('username', email)
  formDataLogin.append('password', password)

  formDataLogin.append('out', 'json')
  formDataLogin.append('g-recaptcha-response', reCaptcha)
  formDataLogin.append('sok', 'ok')

  if (redirectID) {
    formDataLogin.append('redirect', redirectID)
    formDataLogin.append('forget', 'on')
  }

  axiosInstance
    .post('/', formDataLogin)
    .then(({ data }) => {
      localStorage.removeItem('redirectID')
      if (data.doc.error) throw data.doc.error

      const sessionId = data?.doc?.auth?.$id

      return axiosInstance
        .post(
          '/',
          qs.stringify({
            func: 'whoami',
            out: 'json',
            auth: sessionId,
          }),
        )
        .then(({ data }) => {
          if (data.doc.error) throw new Error(`whoami - ${data.doc.error.msg.$}`)

          if (data.doc?.ok?.$ === 'func=totp.confirm') {
            dispatch(authActions.setTemporaryId(sessionId))

            dispatch(actions.hideLoader())

            dispatch(authActions.openTotpForm())
            return
          }

          dispatch(authActions.loginSuccess(sessionId))
          dispatch(authActions.isLogined(true))
          dispatch(userOperations.getUserInfo(sessionId))
        })
    })
    .catch(error => {
      resetRecaptcha()
      dispatch(actions.hideLoader())
      const errText =
        error?.response?.status === 403
          ? 'blocked_ip'
          : error?.$object
          ? error.$object
          : SERVER_ERR_MSG

      setErrMsg(errText)
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
        const tokenIsExpired = data?.data?.doc?.error?.$type === 'access'
        if (tokenIsExpired) {
          dispatch(authActions.logoutSuccess())
          cookies.eraseCookie('sessionId')
        }
      } else {
        if (data.doc.error.msg.$) throw new Error(data.doc.error.msg.$)
      }
    })
    .catch(e => {
      checkIfTokenAlive('error during getCurrentSessionStatus' + e.message || e, dispatch)
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
      dispatch(authActions.closeTotpForm())
      dispatch(authActions.loginSuccess(data?.doc?.auth?.$id))
    })
    .catch(err => {
      dispatch(actions.hideLoader())
      checkIfTokenAlive('totp.confirm - ' + err.message, dispatch)
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
      checkIfTokenAlive('recovery - ' + err.message, dispatch)
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
            auth: data?.doc?.auth?.$id,
            sok: 'ok',
            out: 'json',
          }),
        )

        onChangeSuccess()
        dispatch(actions.hideLoader())
      })
      .catch(err => {
        dispatch(actions.hideLoader())
        checkIfTokenAlive('recovery.change - ' + err.message, dispatch)
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
        cookies.eraseCookie('sessionId')
        dispatch(actions.hideLoader())
      } else {
        throw new Error(data.doc.error.msg.$)
      }
    })
    .catch(e => {
      checkIfTokenAlive('error during logging out ' + e.message, dispatch)

      dispatch(actions.hideLoader())
    })
}

const getCountriesForRegister =
  (setCountries, setStates, setErrMsg, setSocialLinks) => dispatch => {
    dispatch(actions.showLoader())

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'register',
          out: 'json',
          lang: 'en',
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        const countries = data.doc.slist[0].val
        const states = data.doc.slist[1].val
        const socLinks = data.doc?.imglinks?.elem?.reduce((acc, el) => {
          acc[el.$img] = el.$href
          return acc
        }, {})
        countries.shift()

        localStorage.setItem(
          'countriesForRegister',
          JSON.stringify({
            countries,
            states,
            socLinks,
          }),
        )

        setCountries(countries)
        setStates(states)
        setSocialLinks && setSocialLinks(socLinks)

        dispatch(actions.hideLoader())
      })
      .catch(err => {
        dispatch(actions.hideLoader())
        setErrMsg(SERVER_ERR_MSG)
        checkIfTokenAlive('getCountriesForRegister ' + err.message, dispatch)
      })
  }

const register =
  (values, partner, sesid, setErrMsg, successRegistration, resetRecaptcha) =>
  dispatch => {
    dispatch(actions.showLoader())
    cookies.eraseCookie('sessionId')

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
          partner: partner,
          sesid: sesid,
          'g-recaptcha-response': values.reCaptcha,
          out: 'json',
          sok: 'ok',
          lang: 'en',
        }),
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
        err.message.trim() ===
        'This email is already registered in the system. If you forgot your password, please use the password recovery form'
          ? setErrMsg('soc_email_exist')
          : setErrMsg(SERVER_ERR_MSG)
      })
  }

const checkGoogleState = (state, redirectToRegistration, redirectToLogin) => dispatch => {
  dispatch(actions.showLoader())

  const fromsite = cookies.getCookie('loginFromSite')

  const sendInfoToSite = data => {
    if (fromsite === 'true') {
      cookies.setCookie('socialLoginData', JSON.stringify(data), 1)
      cookies.eraseCookie('loginFromSite')
      location.href = SITE_URL
    }
  }

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'oauth',
        state: state,
        out: 'json',
        sok: 'ok',
      }),
    )
    .then(({ data }) => {
      // LOGIN
      if (
        data.doc?.error?.$object === 'nolink' ||
        data.doc?.error?.$object === 'socialrequest'
      ) {
        sendInfoToSite({ error: data.doc?.error?.$object })
        redirectToLogin(
          'soc_net_not_integrated',
          data.doc?.error?.param.find(el => el.$name === 'network')?.$,
        )
      } else if (data.doc?.auth?.$id) {
        const sessionId = data.doc?.auth?.$id
        sendInfoToSite({ sessionId })
        axiosInstance
          .post(
            '/',
            qs.stringify({
              func: 'whoami',
              out: 'json',
              auth: sessionId,
            }),
          )
          .then(({ data }) => {
            if (data.doc.error) throw new Error(`whoami - ${data.doc.error.msg.$}`)

            if (data.doc?.ok?.$ === 'func=totp.confirm') {
              dispatch(authActions.setTemporaryId(sessionId))

              dispatch(actions.hideLoader())

              dispatch(authActions.openTotpForm())
              return
            }

            dispatch(authActions.loginSuccess(sessionId))
            // is it necessary request?
            dispatch(userOperations.getUserInfo(sessionId))
          })

        //REGISTER
      } else if (data.doc?.ok?.$) {
        axiosInstance
          .get(
            '?' +
              qs.stringify({
                func: 'register',
                state: state,
                type: 'bill',
                newwindow: 'yes',
                code: '',
                sok: 'ok',
                out: 'json',
                lang: 'en',
              }),
          )
          .then(({ data }) => {
            if (data.doc?.error?.$object === 'account_exist') {
              sendInfoToSite({ error: data.doc?.error?.$object })
              redirectToLogin(
                'social_akk_registered',
                data.doc.error.param.find(el => el.$name === 'email')?.$,
              )
            } else if (data.doc?.error?.$type === 'email_exist') {
              // need to handle this error
              sendInfoToSite({ error: data.doc?.error?.$type })
              const email = data.doc.error.param.find(el => el.$name === 'value')?.$
              redirectToLogin('soc_email_exist', email)
            } else if (data.doc?.error?.$object === 'email') {
              sendInfoToSite({ error: data.doc?.error?.$object })
              // need to handle this error
              // const email = data.doc.error.param.find(el => el.$name === 'value')?.$
              redirectToRegistration('no_email_from_social', '', '')
            } else if (data.doc?.ok?.$) {
              axiosInstance
                .post(
                  '/',
                  qs.stringify({
                    func: 'auth',
                    email: data.doc.doc.email.$,
                    key: data.doc.ok.$.match(/key=(.+?)(?=&)/)[1],
                    out: 'json',
                    sok: 'ok',
                  }),
                )
                .then(({ data }) => {
                  const sessionId = data?.doc?.auth?.$
                  sendInfoToSite({ sessionId })
                  dispatch(authActions.loginSuccess(sessionId))
                })
            }
          })
      }

      dispatch(actions.hideLoader())
    })
    .catch(err => {
      dispatch(actions.hideLoader())

      checkIfTokenAlive('checkGoogleState ' + err.message, dispatch)
    })
}

const getRedirectLink = network => (dispatch, getState) => {
  const {
    auth: { sessionId },
  } = getState()

  dispatch(actions.showLoader())

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'oauth.redirect',
        network,
        auth: sessionId,
        sok: 'ok',
      }),
    )
    .then(({ data }) => {
      // const url = window.URL.createObjectURL(new Blob([data.location]))

      const link = document.createElement('a')
      link.href = data.location
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
    })
    .catch(err => {
      dispatch(actions.hideLoader())
      checkIfTokenAlive('redirect link - ' + err.message, dispatch)
    })
}

const geoConfirm = (redirect, redirectToLogin) => () => {
  redirect = decodeURIComponent(redirect)

  localStorage.setItem('redirectID', redirect)
  redirectToLogin(redirect)
}

const addLoginWithSocial = (state, redirectToSettings) => (dispatch, getState) => {
  const {
    auth: { sessionId },
  } = getState()

  dispatch(actions.showLoader())

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'oauth',
        state: state,
        auth: sessionId,
        out: 'json',
        sok: 'ok',
      }),
    )
    .then(({ data }) => {
      if (
        data?.doc?.ok?.$?.includes('linkexists') ||
        data?.doc?.ok?.$?.includes('nouser') ||
        data?.doc?.error
      ) {
        redirectToSettings('denied')
      } else {
        redirectToSettings('success')
      }

      dispatch(actions.hideLoader())
    })
    .catch(err => {
      dispatch(actions.hideLoader())
      checkIfTokenAlive('checkLoginWithSocial - ' + err.message, dispatch)
    })
}

const getLoginSocLinks = setSocialLinks => dispatch => {
  dispatch(actions.showLoader())

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'logon',
        out: 'json',
      }),
    )
    .then(({ data }) => {
      // if (data.doc.error) throw data.doc.error

      const socLinks = data.doc?.imglinks?.elem?.reduce((acc, el) => {
        acc[el.$img] = el.$href
        return acc
      }, {})
      setSocialLinks(socLinks)
      // const sessionId = data.doc.auth.$id

      // return axiosInstance
      //   .post(
      //     '/',
      //     qs.stringify({
      //       func: 'whoami',
      //       out: 'json',
      //       auth: sessionId,
      //     }),
      //   )
      //   .then(({ data }) => {
      //     if (data.doc.error) throw new Error(`usrparam - ${data.doc.error.msg.$}`)

      //     if (data.doc?.ok?.$ === 'func=totp.confirm') {
      //       dispatch(authActions.setTemporaryId(sessionId))

      //       dispatch(authActions.openTotpForm())
      //       return
      //     }

      //     dispatch(authActions.loginSuccess(sessionId))
      //     dispatch(userOperations.getUserInfo(sessionId))
      //   })
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      dispatch(actions.hideLoader())
      checkIfTokenAlive('getLoginSocLinks - ' + error, dispatch)
    })
}

const getLocation = () => dispatch => {
  axios.get(`${API_URL}/api/service/geo/`).then(({ data }) => {
    dispatch(
      authActions.geoData({
        clients_country_code: data?.clients_country_code,
        clients_country_id: data?.clients_country_id,
        has_country_state: data?.clients_state?.has_country_state,
        state_id: data?.clients_state?.state_id,
        clients_city: data?.clients_city,
        clients_country_name: data?.clients_country_name,
      }),
    )
  })
}

export default {
  login,
  register,
  reset,
  changePassword,
  sendTotp,
  logout,
  getCountriesForRegister,
  getCurrentSessionStatus,
  checkGoogleState,
  getLoginSocLinks,
  addLoginWithSocial,
  getRedirectLink,
  getLocation,
  geoConfirm,
}
