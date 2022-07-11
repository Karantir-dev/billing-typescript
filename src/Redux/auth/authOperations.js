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
      if (data.doc.error) throw data.doc.error

      const sessionId = data.doc.auth.$id

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
          if (data.doc.error) throw new Error(`usrparam - ${data.doc.error.msg.$}`)

          if (data.doc?.ok?.$ === 'func=totp.confirm') {
            dispatch(authActions.setTemporaryId(sessionId))

            dispatch(actions.hideLoader())

            dispatch(authActions.openTotpForm())
            return
          }

          dispatch(authActions.loginSuccess(sessionId))
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
      console.log('auth -', error?.msg?.$ || error.message)
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
      dispatch(authActions.closeTotpForm())
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

const getCountriesForRegister =
  (setCountries, setStates, setErrMsg, setSocialLinks) => dispatch => {
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
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        const countries = data.doc.slist[0].val
        const states = data.doc.slist[1].val
        const socLinks = data.doc?.imglinks?.elem?.reduce((acc, el) => {
          acc[el.$img] = el.$href
          return acc
        }, {})
        countries.shift()

        setCountries(countries)
        setStates(states)
        setSocialLinks(socLinks)

        dispatch(actions.hideLoader())
      })
      .catch(err => {
        dispatch(actions.hideLoader())
        setErrMsg(SERVER_ERR_MSG)
        console.log('getCountriesForRegister - ', err.message)
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

const checkGoogleState = (state, redirectToRegistration, redirectToLogin) => dispatch => {
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
      // LOGIN
      if (data.doc?.error?.$object === 'nolink') {
        redirectToLogin(
          'soc_net_not_integrated',
          data.doc?.error?.param.find(el => el.$name === 'network')?.$,
        )
      } else if (data.doc?.auth?.$id) {
        dispatch(authActions.loginSuccess(data.doc?.auth?.$id))

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
              redirectToLogin(
                'social_akk_registered',
                data.doc.error.param.find(el => el.$name === 'email')?.$,
              )
            } else if (data.doc?.error?.$type === 'email_exist') {
              // need to handle this error
              const email = data.doc.error.param.find(el => el.$name === 'value')?.$
              redirectToLogin('soc_email_exist', email)
            } else if (data.doc?.error?.$object === 'email') {
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
                  const sessionId = data.doc.auth.$
                  dispatch(authActions.loginSuccess(sessionId))
                })
            }
          })
      }

      dispatch(actions.hideLoader())
    })
    .catch(err => {
      dispatch(actions.hideLoader())

      console.log('checkGoogleState - ', err)
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

      console.log(' redirect link - ', err)
    })
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
      if (data?.doc?.ok?.$?.includes('linkexists')) {
        redirectToSettings('denied')
      } else {
        redirectToSettings('success')
      }

      dispatch(actions.hideLoader())
    })
    .catch(err => {
      dispatch(actions.hideLoader())

      console.log('checkLoginWithSocial - ', err)
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

      //     console.log(data.doc)

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
      console.log('getLoginSocLinks -', error)
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
}