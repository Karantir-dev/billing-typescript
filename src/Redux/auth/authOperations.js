import qs from 'qs'
import axios from 'axios'
import { actions, authActions, settingsActions } from '@redux'
import { axiosInstance } from '@config/axiosInstance'
import { checkIfTokenAlive, cookies, getParameterByName, throwServerError } from '@utils'
import { exists as isTranslationExists } from 'i18next'
import * as route from '@src/routes'

const login =
  (email, password, reCaptcha, resetRecaptcha, navigateAfterLogin) => dispatch => {
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
        if (data.doc.error) {
          throwServerError(data.doc.error.$object)
        }

        const sessionId = data?.doc?.auth?.$id

        cookies.setCookie('sessionId', sessionId, 1)

        return axiosInstance
          .post(
            '/',
            qs.stringify({
              func: 'whoami',
              out: 'json',
              lang: 'en',
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

            navigateAfterLogin && navigateAfterLogin()
          })
      })
      .catch(error => {
        resetRecaptcha()
        dispatch(actions.hideLoader())

        // billing response errors handling
        if (error.serverResponse) {
          if (isTranslationExists(`warnings.${error.message}`, { ns: 'auth' })) {
            dispatch(authActions.setAuthErrorMsg(`warnings.${error.message}`))
          } else {
            dispatch(authActions.setAuthErrorMsg('warnings.unknown_error'))
          }

          // access errors handling
        } else {
          checkIfTokenAlive(error, dispatch)
        }
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
          dispatch(authActions.setAuthErrorMsg('warnings.token_is_expired'))

          dispatch(authActions.logoutSuccess())
          cookies.eraseCookie('sessionId')
        }
      } else if (data.doc?.error?.msg?.$) {
        throw new Error(data.doc.error.msg.$)
      }
    })
    .catch(e => {
      checkIfTokenAlive(e)
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

      const sessionId = data?.doc?.auth?.$id

      cookies.setCookie('sessionId', sessionId, 1)
      dispatch(authActions.clearTemporaryId())
      dispatch(authActions.loginSuccess(sessionId))
      dispatch(authActions.isLogined(true))
      dispatch(authActions.closeTotpForm())
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
        if (isTranslationExists(`warnings.${data.doc.error.$type}`, { ns: 'auth' })) {
          setErrorType(data.doc.error.$type)

          if (data.doc.error.$type === 'min_email_send_timeout') {
            setErrorTime(data.doc.error.param[1].$)
          }
          dispatch(actions.hideLoader())
          return
        } else {
          throw new Error(data.doc.error.msg.$)
        }
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
          if (isTranslationExists(`warnings.${data.doc.error.$type}`, { ns: 'auth' })) {
            setErrType(data.doc.error.$type)
            dispatch(actions.hideLoader())
            return
          } else {
            throw new Error(data.doc.error.msg.$)
          }
        }

        axiosInstance.post(
          '/',
          qs.stringify({
            func: 'logon',
            auth: data?.doc?.auth?.$id,
            out: 'json',
          }),
        )

        onChangeSuccess()
        dispatch(actions.hideLoader())
      })
      .catch(err => {
        dispatch(actions.hideLoader())
        checkIfTokenAlive('recovery - ' + err.message, dispatch)
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

const getCountriesForRegister = (setCountries, setStates) => dispatch => {
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
      // const socLinks = data.doc?.imglinks?.elem?.reduce((acc, el) => {
      //   acc[el.$img] = el.$href
      //   return acc
      // }, {})
      countries.shift()

      localStorage.setItem(
        'countriesForRegister',
        JSON.stringify({
          countries,
          states,
          // socLinks,
        }),
      )

      setCountries(countries)
      setStates(states)

      dispatch(actions.hideLoader())
    })
    .catch(err => {
      dispatch(actions.hideLoader())

      checkIfTokenAlive(err.message, dispatch)
    })
}

const autoLogin = (email, key, successRegistration) => dispatch => {
  dispatch(actions.showLoader())
  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'auth',
        username: email,
        key,
        out: 'json',
        lang: 'en',
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) {
        throwServerError(data.doc.error.$object)
      }

      const sessionId = data?.doc?.auth?.$id
      cookies.setCookie('sessionId', sessionId, 1)

      dispatch(authActions.loginSuccess(sessionId))
      dispatch(authActions.isLogined(true))

      successRegistration()
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      dispatch(actions.hideLoader())

      // billing response errors handling
      if (error.serverResponse) {
        if (isTranslationExists(`warnings.${error.message}`, { ns: 'auth' })) {
          dispatch(authActions.setAuthErrorMsg(`warnings.${error.message}`))
        } else {
          dispatch(authActions.setAuthErrorMsg('warnings.unknown_error'))
        }

        // access errors handling
      } else {
        checkIfTokenAlive(error, dispatch)
      }
    })
}

const register =
  (values, partner, sesid, setErrMsg, successRegistration, resetRecaptcha, isAutologin) =>
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
          sesid: sesid || ' ',
          'g-recaptcha-response': values.reCaptcha,
          out: 'json',
          sok: 'ok',
          lang: 'en',
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) {
          throwServerError(data.doc.error.$type)
        }

        /** ---- Analytics ----  */
        window.dataLayer?.push({ event: 'signup-success' })
        if (window.fbq) window.fbq('track', 'CompleteRegistration')
        if (window.qp) window.qp('track', 'CompleteRegistration')
        /** ---- /Analytics ----  */

        if (isAutologin) {
          dispatch(
            autoLogin(
              values.email,
              getParameterByName('key', data?.doc?.ok?.$),
              successRegistration,
            ),
          )
          return
        }

        successRegistration()

        dispatch(actions.hideLoader())
      })
      .catch(error => {
        resetRecaptcha()
        dispatch(actions.hideLoader())

        // billing response errors handling
        if (error.serverResponse) {
          if (isTranslationExists(`warnings.${error.message}`, { ns: 'auth' })) {
            setErrMsg(`warnings.${error.message}`)
          } else {
            setErrMsg('warnings.unknown_error')
          }

          // access errors handling
        } else {
          checkIfTokenAlive(error, dispatch)
        }
      })
  }

const checkGoogleState =
  (state, redirectToRegistration, redirectToLogin, navigate) => dispatch => {
    dispatch(actions.showLoader())

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
        /** Errors handling */
        if (data.doc?.error?.$object === 'socialrequest') {
          redirectToLogin('warnings.soc_net_auth_failed')
        } else if (data.doc?.error?.$object === 'nolink') {
          redirectToLogin(
            'warnings.soc_net_not_integrated',
            data.doc?.error?.param?.find(el => el.$name === 'network')?.$,
          )
        } else if (data.doc?.error?.$object === 'nouser') {
          redirectToLogin(
            'warnings.soc_net_acc_info_missing',
            data.doc?.error?.param?.find(el => el.$name === 'network')?.$,
          )

          /** LOGIN */
        } else if (data.doc?.auth?.$id) {
          const sessionId = data.doc?.auth?.$id
          cookies.setCookie('sessionId', sessionId, 1)

          /** Check if two-factor authentication is enabled */
          return axiosInstance
            .post(
              '/',
              qs.stringify({
                func: 'whoami',
                out: 'json',
                lang: 'en',
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
              navigate(route.SERVICES, { replace: true })
            })

          /** REGISTRATION */
        } else if (data.doc?.ok?.$) {
          /** Errors handling */
          /** if there is registered account with same email as soc network account has */
          if (data.doc?.ok?.$.includes('email_exists')) {
            // const email = data.doc.error.param.find(el => el.$name === 'value')?.$
            redirectToLogin('warnings.soc_email_exist')

            /** if there is registered account linked with this soc network account */
          } else if (data.doc?.ok?.$.includes('socnetwork_account_exist')) {
            const url = new URLSearchParams(data.doc?.ok?.$)
            redirectToLogin('warnings.social_akk_registered', url.get('realname'))

            /** if there is missing data (email) in the soc net account */
          } else if (data.doc?.ok?.$.includes('need_manual_action')) {
            redirectToRegistration('warnings.no_email_from_social', '', '')
          } else {
            return axiosInstance
              .get(
                '?' +
                  data.doc?.ok?.$ +
                  '&' +
                  qs.stringify({
                    out: 'json',
                    lang: 'en',
                  }),
              )
              .then(({ data }) => {
                const sessionId = data?.doc?.auth?.$
                cookies.setCookie('sessionId', sessionId, 1)

                /** ---- Analytics ----  */
                window.dataLayer?.push({ event: 'signup-success' })
                if (window.fbq) window.fbq('track', 'CompleteRegistration')
                if (window.qp) window.qp('track', 'CompleteRegistration')
                /** ---- /Analytics ----  */

                dispatch(authActions.loginSuccess(sessionId))
              })
          }
        }

        dispatch(actions.hideLoader())
      })
      .catch(err => {
        dispatch(actions.hideLoader())

        checkIfTokenAlive(err.message, dispatch)
      })
  }

// const getRedirectLink = network => (dispatch, getState) => {
//   const {
//     auth: { sessionId },
//   } = getState()

//   dispatch(actions.showLoader())

//   axiosInstance
//     .post(
//       '/',
//       qs.stringify({
//         func: 'oauth.redirect',
//         network,
//         auth: sessionId,
//         sok: 'ok',
//       }),
//     )
//     .then(({ data }) => {
//       // const url = window.URL.createObjectURL(new Blob([data.location]))

//       const link = document.createElement('a')
//       link.href = data.location
//       document.body.appendChild(link)
//       link.click()
//       link.parentNode.removeChild(link)
//     })
//     .catch(err => {
//       dispatch(actions.hideLoader())
//       checkIfTokenAlive('redirect link - ' + err.message, dispatch)
//     })
// }

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
        lang: 'en',
        out: 'json',
        sok: 'ok',
      }),
    )
    .then(({ data }) => {
      console.log(data)
      const SocNetIntegrationResult = {
        status: 'success',
        msg: '',
      }

      if (data?.doc?.error) {
        // data.doc.error?.$object === 'account_not_found'

        SocNetIntegrationResult.status = 'fail'
        SocNetIntegrationResult.msg = data.doc.error?.msg?.$
      } else if (data?.doc?.ok?.$?.includes('nouser')) {
        SocNetIntegrationResult.status = 'fail'
        SocNetIntegrationResult.msg = 'nouser'
      }

      dispatch(settingsActions.setSocNetIntegration(SocNetIntegrationResult))
      redirectToSettings()

      dispatch(actions.hideLoader())
    })
    .catch(err => {
      dispatch(actions.hideLoader())
      checkIfTokenAlive(err.message, dispatch)
    })
}

// const getLoginSocLinks = setSocialLinks => dispatch => {
//   dispatch(actions.showLoader())

//   axiosInstance
//     .post(
//       '/',
//       qs.stringify({
//         func: 'logon',
//         out: 'json',
//       }),
//     )
//     .then(({ data }) => {
//       // if (data.doc.error) throw data.doc.error

//       const socLinks = data.doc?.imglinks?.elem?.reduce((acc, el) => {
//         acc[el.$img] = el.$href
//         return acc
//       }, {})
//       setSocialLinks(socLinks)
//       // const sessionId = data.doc.auth.$id

//       // return axiosInstance
//       //   .post(
//       //     '/',
//       //     qs.stringify({
//       //       func: 'whoami',
//       //       out: 'json',
//       //       auth: sessionId,
//       //     }),
//       //   )
//       //   .then(({ data }) => {
//       //     if (data.doc.error) throw new Error(`usrparam - ${data.doc.error.msg.$}`)

//       //     if (data.doc?.ok?.$ === 'func=totp.confirm') {
//       //       dispatch(authActions.setTemporaryId(sessionId))

//       //       dispatch(authActions.openTotpForm())
//       //       return
//       //     }

//       //     dispatch(authActions.loginSuccess(sessionId))
//       //     dispatch(userOperations.getUserInfo(sessionId))
//       //   })
//       dispatch(actions.hideLoader())
//     })
//     .catch(error => {
//       dispatch(actions.hideLoader())
//       checkIfTokenAlive('getLoginSocLinks - ' + error, dispatch)
//     })
// }

const getLocation = () => dispatch => {
  axios.get(`${process.env.REACT_APP_API_URL}/api/service/geo/`).then(({ data }) => {
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
  // getLoginSocLinks,
  addLoginWithSocial,
  // getRedirectLink,
  getLocation,
  geoConfirm,
}
