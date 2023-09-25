import qs from 'qs'
import {
  actions,
  authOperations,
  userOperations,
  usersOperations,
  settingsActions,
} from '@redux'
import { toast } from 'react-toastify'
import { axiosInstance } from '@config/axiosInstance'
import { checkIfTokenAlive } from '@utils'
import i18n from '@src/i18n'

const getUserEdit =
  (
    elid,
    checkEmail = false,
    isComponentAllowedToRender,
    setAvailableEditRights,
    signal,
    setIsLoading,
  ) =>
  (dispatch, getState) => {
    setIsLoading ? setIsLoading(true) : dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'user.edit',
          out: 'json',
          auth: sessionId,
          lang: 'en',
          elid,
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        const elem = {
          email: { email: data?.doc?.email?.$, readonly: false },
          phone: { phone: data?.doc?.phone?.$, readonly: false },
          phone_country: data?.doc?.phone_country?.$,
          realname: { realname: data?.doc?.realname?.$, readonly: false },
        }

        data?.doc?.metadata?.form?.page?.forEach(p => {
          if (p.$name === 'user') {
            p.field?.forEach(f => {
              if (f?.$name === 'email') {
                f?.input?.forEach(i => {
                  if (i?.$name === 'email') {
                    elem['email']['readonly'] = i?.$readonly === 'yes'
                  }
                })
              }
              if (f?.$name === 'realname') {
                f?.input?.forEach(i => {
                  if (i?.$name === 'realname') {
                    elem['realname']['readonly'] = i?.$readonly === 'yes'
                  }
                })
              }
              if (f?.$name === 'phone') {
                f?.input?.forEach(i => {
                  if (i?.$name === 'phone') {
                    elem['phone']['readonly'] = i?.$readonly === 'yes'
                  }
                })
              }
            })
          }
        })

        data?.doc?.slist?.forEach(el => {
          if (el.$name === 'phone_country') {
            elem['phone_countries'] = el?.val
          }
        })

        dispatch(settingsActions.setUsersEdit(elem))
        dispatch(
          getUserParams(
            checkEmail,
            isComponentAllowedToRender,
            setAvailableEditRights,
            signal,
            setIsLoading,
          ),
        )
      })
      .catch(error => {
        if (setIsLoading) {
          checkIfTokenAlive(error.message, dispatch, true) && setIsLoading(false)
        } else {
          checkIfTokenAlive(error.message, dispatch)
          dispatch(actions.hideLoader())
        }
      })
  }

const setUserAvatar =
  (elid, avatar, fileName, successfullLoading) => (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    var d = new FormData()
    d.append('func', 'user.edit')
    d.append('out', 'json')
    d.append('sok', 'ok')
    d.append('auth', sessionId)
    d.append('elid', elid)
    d.append('avatar_file_upload', avatar, fileName)

    axiosInstance
      .post('/', d)
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)
        successfullLoading()
      })
      .then(() => dispatch(actions.hideLoader()))
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const getUserParams =
  (
    checkEmail = false,
    isComponentAllowedToRender,
    setAvailableEditRights,
    signal,
    setIsLoading,
  ) =>
  (dispatch, getState) => {
    const {
      auth: { sessionId },
    } = getState()

    setIsLoading ? setIsLoading(true) : dispatch(actions.showLoader())

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'usrparam',
          out: 'json',
          lang: 'en',
          auth: sessionId,
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        const telegram =
          data?.doc?.messages?.msg?.instruction?.match(/(https?:\/\/[^ ]*)/)

        let telegramLink = ''

        if (telegram?.length > 0) {
          telegramLink = telegram[0].slice(0, -1)
        }

        const elem = {
          timezone: data?.doc?.timezone?.$ || '',
          atype: data?.doc?.atype?.$ || '',
          secureip: data?.doc?.secureip?.$ || '',
          setgeoip: data?.doc?.setgeoip?.$ || '',
          addr: data?.doc?.addr?.$ || '',
          sendemail: data?.doc?.sendemail?.$ || '',
          time: data?.doc?.time?.$ || '',
          telegram_id: data?.doc?.telegram_id?.$ || '',
          status_totp: data?.doc?.status_totp?.$ || '',
          email: data?.doc?.email?.$ || '',
          avatar_view: data?.doc?.avatar_view?.$ || '',
          email_confirmed_status: data?.doc?.email_confirmed_status?.$ || '',
          telegramLink: telegramLink || '',
          vkontakte_status: data?.doc?.vkontakte_status?.$,
          facebook_status: data?.doc?.facebook_status?.$,
          google_status: data?.doc?.google_status?.$,

          listCheckBox: [
            {
              name: 'Financial notices',
              fieldName: 'finance',
              emailValue: data?.doc?.finance_notice_ntemail?.$ || '',
              messengerValue: data?.doc?.finance_notice_ntmessenger?.$ || '',
              smsValue: data?.doc?.finance_notice_ntsms?.$ || '',
            },
            {
              name: 'News notifications',
              fieldName: 'news',
              emailValue: data?.doc?.news_notice_ntemail?.$ || '',
              messengerValue: data?.doc?.news_notice_ntmessenger?.$ || '',
              smsValue: data?.doc?.news_notice_ntsms?.$ || '',
            },
            {
              name: 'Service notices',
              fieldName: 'service',
              emailValue: data?.doc?.service_notice_ntemail?.$ || '',
              messengerValue: data?.doc?.service_notice_ntmessenger?.$ || '',
              smsValue: data?.doc?.service_notice_ntsms?.$ || '',
            },
            {
              name: 'Support service',
              fieldName: 'support',
              emailValue: data?.doc?.support_notice_ntemail?.$ || '',
              messengerValue: data?.doc?.support_notice_ntmessenger?.$ || '',
              smsValue: data?.doc?.support_notice_ntsms?.$ || '',
            },
          ],
        }

        data?.doc?.slist?.forEach(el => {
          if (el.$name === 'timezone') {
            elem['timezoneList'] = el?.val
          }
          if (el.$name === 'atype') {
            elem['ipTypeList'] = el?.val
          }
        })

        dispatch(settingsActions.setUsersParams(elem))

        if (isComponentAllowedToRender) {
          return dispatch(
            usersOperations.getAvailableRights(
              'usrparam',
              setAvailableEditRights,
              signal,
              setIsLoading,
            ),
          )
        }
        setIsLoading ? setIsLoading(false) : dispatch(actions.hideLoader())
      })
      .then(() => {
        if (checkEmail) {
          dispatch(sendEmailConfirm(signal, setIsLoading))
        }
      })
      .catch(error => {
        if (setIsLoading) {
          checkIfTokenAlive(error.message, dispatch, true) && setIsLoading(false)
        } else {
          checkIfTokenAlive(error.message, dispatch)
          dispatch(actions.hideLoader())
        }
      })
  }

const getTimeByTimeZone =
  (timezone = null) =>
  (dispatch, getState) => {
    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'usrparam',
          out: 'json',
          auth: sessionId,
          lang: 'en',
          timezone: timezone,
          sv_field: 'time',
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)

        dispatch(settingsActions.setUpdateTime(data.doc?.time?.$ || ''))
        dispatch(actions.hideLoader())
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const setPersonalSettings =
  (elid, data, signal, setIsLoading) => (dispatch, getState) => {
    setIsLoading(true)

    const userEditData = {
      email: data?.email || null,
      realname: data?.realname || null,
      phone: data?.phone || null,
    }

    const userParamsData = {
      email: data?.email_notif || null,
      telegram_id: data?.telegram_id || null,
      timezone: data?.timezone || null,

      service_notice_ntemail: data?.service_notice_ntemail ? 'on' : 'off',
      service_notice_ntmessenger: data?.service_notice_ntmessenger ? 'on' : 'off',
      service_notice_ntsms: data?.service_notice_ntsms ? 'on' : 'off',

      support_notice_ntemail: data?.support_notice_ntemail ? 'on' : 'off',
      support_notice_ntmessenger: data?.support_notice_ntmessenger ? 'on' : 'off',
      support_notice_ntsms: data?.support_notice_ntsms ? 'on' : 'off',

      news_notice_ntemail: data?.news_notice_ntemail ? 'on' : 'off',
      news_notice_ntmessenger: data?.news_notice_ntmessenger ? 'on' : 'off',
      news_notice_ntsms: data?.news_notice_ntsms ? 'on' : 'off',

      finance_notice_ntemail: data?.finance_notice_ntemail ? 'on' : 'off',
      finance_notice_ntmessenger: data?.finance_notice_ntmessenger ? 'on' : 'off',
      finance_notice_ntsms: data?.finance_notice_ntsms ? 'on' : 'off',

      sendemail: data?.sendemail ? 'on' : 'off',
      setgeoip: data?.setgeoip ? 'on' : 'off',
    }

    if (data?.email_notif?.length === 0) {
      userParamsData.sendemail = 'off'
      userParamsData.setgeoip = 'off'
    }

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'user.edit',
          sok: 'ok',
          lang:
            i18n.language === 'uk'
              ? 'ua'
              : i18n?.language === 'kz'
              ? 'kk'
              : i18n.language,
          out: 'json',
          auth: sessionId,
          elid,
          ...userEditData,
        }),
        { signal },
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)
        axiosInstance
          .post(
            '/',
            qs.stringify({
              func: 'usrparam',
              out: 'json',
              sok: 'ok',
              lang:
                i18n.language === 'uk'
                  ? 'ua'
                  : i18n?.language === 'kz'
                  ? 'kk'
                  : i18n.language,
              elid,
              auth: sessionId,
              ...userParamsData,
            }),
            { signal },
          )
          .then(({ data }) => {
            if (data.doc.error) throw new Error(data.doc.error.msg.$)
            toast.success(i18n.t('Changes saved successfully', { ns: 'other' }), {
              position: 'bottom-right',
            })
            dispatch(getUserEdit(elid, false, false, false, signal, setIsLoading))
          })
          .catch(error => {
            checkIfTokenAlive(error.message, dispatch, true) && setIsLoading(false)
          })
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch, true) && setIsLoading(false)
      })
  }

const setupEmailConfirm = (elid, data) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const userParamsData = {
    email: data?.email_notif || null,
    telegram_id: data?.telegram_id || null,
    timezone: data?.timezone || null,

    service_notice_ntemail: data?.service_notice_ntemail ? 'on' : 'off',
    service_notice_ntmessenger: data?.service_notice_ntmessenger ? 'on' : 'off',
    service_notice_ntsms: data?.service_notice_ntsms ? 'on' : 'off',

    support_notice_ntemail: 'on',
    support_notice_ntmessenger: data?.support_notice_ntmessenger ? 'on' : 'off',
    support_notice_ntsms: data?.support_notice_ntsms ? 'on' : 'off',

    news_notice_ntemail: data?.news_notice_ntemail ? 'on' : 'off',
    news_notice_ntmessenger: data?.news_notice_ntmessenger ? 'on' : 'off',
    news_notice_ntsms: data?.news_notice_ntsms ? 'on' : 'off',

    finance_notice_ntemail: data?.finance_notice_ntemail ? 'on' : 'off',
    finance_notice_ntmessenger: data?.finance_notice_ntmessenger ? 'on' : 'off',
    finance_notice_ntsms: data?.finance_notice_ntsms ? 'on' : 'off',
  }

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'usrparam',
        out: 'json',
        sok: 'ok',
        lang: 'en',
        elid,
        auth: sessionId,
        ...userParamsData,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)
      dispatch(getUserEdit(elid, true))
    })

    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const sendEmailConfirm = (signal, setIsLoading) => (dispatch, getState) => {
  setIsLoading(true)
  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'usrparam',
        out: 'json',
        lang: 'en',
        sv_field: 'send_confirm',
        auth: sessionId,
      }),
      { signal },
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)
      dispatch(settingsActions.emailStatusUpadate(data.doc?.send_status?.$))
      setIsLoading(false)
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch, true) && setIsLoading(false)
    })
}

const setPasswordAccess = (elid, d, setFieldValue) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  let addr = d?.allowIpList?.join(' ')

  const userParamsData = {
    old_passwd: d.old_passwd,
    passwd: d.passwd,
    confirm: d.confirm,
    atype: d.atype,
    secureip: d?.secureip ? 'on' : 'off',
    addr: addr,
    disable_totp: d.disable_totp,
  }

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'usrparam',
        out: 'json',
        sok: 'ok',
        elid,
        auth: sessionId,
        ...userParamsData,
      }),
    )
    .then(({ data }) => {
      if (data?.doc?.error) {
        if (data?.doc?.error?.$object === 'old_passwd') {
          toast.error(i18n.t('Wrong old password', { ns: 'other' }), {
            position: 'bottom-right',
          })
        }
        if (data?.doc?.error?.$object === 'disable_totp') {
          toast.error(i18n.t(data.doc.error.msg.$.trim(), { ns: 'user_settings' }), {
            position: 'bottom-right',
          })
        }
        throw new Error(data.doc.error.msg.$)
      }

      toast.success(i18n.t('Changes saved successfully', { ns: 'other' }), {
        position: 'bottom-right',
      })

      setFieldValue('old_passwd', '')
      setFieldValue('passwd', '')
      setFieldValue('confirm', '')

      if (d?.secureip) {
        return dispatch(authOperations.logout())
      }

      dispatch(getUserEdit(elid))
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const changeSocialLinkStatus = (elid, data) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'usrparam',
        out: 'json',
        sok: 'ok',
        elid,
        auth: sessionId,
        clicked_button: 'ok',
        ...data,
      }),
    )
    .then(() => {
      toast.success(i18n.t('Changes saved successfully', { ns: 'other' }), {
        position: 'bottom-right',
      })

      dispatch(getUserEdit(elid))
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const setTotp = () => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'totp.new',
        out: 'json',
        lang: 'en',
        auth: sessionId,
      }),
    )
    .then(({ data }) => {
      if (data?.doc?.error) throw new Error(data.doc.error.msg.$)

      const elem = {
        actualtime: data?.doc?.actualtime?.$,
        servertime: data?.doc?.actualtime?.$,
        qrimage: data?.doc?.qrimage?.$,
        qrimage_download_link: data?.doc?.qrimage_download_link?.$,
        secret: data?.doc?.secret?.$,
        secret_download_link: data?.doc?.secret_download_link?.$,
      }

      dispatch(settingsActions.setTwoStepVerif(elem))
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getQR = link => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .get(`${link}&auth=${sessionId}`, { responseType: 'blob' })
    .then(({ data }) => {
      if (data?.doc?.error) throw new Error(data.doc.error.msg.$)

      const qrimage = window.URL.createObjectURL(new Blob([data]))

      dispatch(settingsActions.updateTwoStepVerif(qrimage))

      dispatch(actions.hideLoader())
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const getSecretKeyFile = () => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .get(`/?auth=${sessionId}&func=totp.new.file`, { responseType: 'blob' })
    .then(({ data }) => {
      if (data?.doc?.error) throw new Error(data.doc.error.msg.$)

      const secretKey = window.URL.createObjectURL(new Blob([data]))

      const link = document.createElement('a')
      link.href = secretKey
      link.setAttribute('download', 'secretKey.txt')
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)

      dispatch(actions.hideLoader())
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const setTotpPassword = (elid, d, setModal) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'totp.new',
        qrcode: d?.qrcode,
        sok: 'ok',
        out: 'json',
        show_actualtime: 'show',
        login: `api.zomro.com(${d?.email})`,
        secret: d?.secret,
        lang: 'en',
        auth: sessionId,
      }),
    )
    .then(({ data }) => {
      if (data?.doc?.error) {
        toast.error(i18n.t('Wrong password', { ns: 'other' }), {
          position: 'bottom-right',
        })
        throw new Error(data.doc.error.msg.$)
      }

      toast.success(i18n.t('Changes saved successfully', { ns: 'other' }), {
        position: 'bottom-right',
      })

      setModal(false)

      dispatch(getUserEdit(elid))
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const confirmEmail = key => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'notice.confirm',
        sok: 'ok',
        out: 'json',
        lang: 'en',
        auth: sessionId,
        key,
      }),
    )
    .then(({ data }) => {
      if (data?.doc?.error) {
        throw new Error(data.doc.error.msg.$)
      }

      data?.doc?.metadata?.form?.field?.forEach(field => {
        if (field?.$name === 'confirmation') {
          field?.textdata?.forEach(textdata => {
            if (textdata?.$name === 'confirmation_key_error') {
              toast.error(i18n.t('Confirmation key error', { ns: 'other' }), {
                position: 'bottom-right',
              })
            } else if (textdata?.$name === 'confirmation_info') {
              toast.success(i18n.t('Email confirmation successfully', { ns: 'other' }), {
                position: 'bottom-right',
              })
            }
          })
        }
      })
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
    })
}

const changeLang = (elid, lang) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'usrparam',
        out: 'json',
        lang: 'en',
        auth: sessionId,
      }),
    )
    .then(({ data }) => {
      const updatedData = {
        finance_notice_ntemail: data?.doc?.finance_notice_ntemail?.$ || '',
        finance_notice_ntmessenger: data?.doc?.finance_notice_ntmessenger?.$ || '',
        finance_notice_ntsms: data?.doc?.finance_notice_ntsms?.$ || '',
        news_notice_ntemail: data?.doc?.news_notice_ntemail?.$ || '',
        news_notice_ntmessenger: data?.doc?.news_notice_ntmessenger?.$ || '',
        news_notice_ntsms: data?.doc?.news_notice_ntsms?.$ || '',
        service_notice_ntemail: data?.doc?.service_notice_ntemail?.$ || '',
        service_notice_ntmessenger: data?.doc?.service_notice_ntmessenger?.$ || '',
        service_notice_ntsms: data?.doc?.service_notice_ntsms?.$ || '',
        support_notice_ntemail: data?.doc?.support_notice_ntemail?.$ || '',
        support_notice_ntmessenger: data?.doc?.support_notice_ntmessenger?.$ || '',
        support_notice_ntsms: data?.doc?.support_notice_ntsms?.$ || '',

        timezone: data?.doc?.timezone?.$ || '',
        atype: data?.doc?.atype?.$ || '',
        secureip: data?.doc?.secureip?.$ || '',
        setgeoip: data?.doc?.setgeoip?.$ || '',
        addr: data?.doc?.addr?.$ || '',
        sendemail: data?.doc?.sendemail?.$ || '',
        time: data?.doc?.time?.$ || '',
        telegram_id: data?.doc?.telegram_id?.$ || '',
        status_totp: data?.doc?.status_totp?.$ || '',
        email: data?.doc?.email?.$ || '',
        email_confirmed_status: data?.doc?.email_confirmed_status?.$ || '',
        vkontakte_status: data?.doc?.vkontakte_status?.$,
        facebook_status: data?.doc?.facebook_status?.$,
        google_status: data?.doc?.google_status?.$,
      }

      axiosInstance
        .post(
          '/',
          qs.stringify({
            func: 'usrparam',
            out: 'json',
            sok: 'ok',
            elid,
            auth: sessionId,
            clicked_button: 'ok',
            lang,
            ...updatedData,
          }),
        )
        .then(() => {
          dispatch(actions.hideLoader())
        })
        .catch(error => {
          checkIfTokenAlive(error.message, dispatch)
          dispatch(actions.hideLoader())
        })
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const fetchValidatePhone = setValidatePhoneData => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'validatephone',
        out: 'json',
        lang: 'en',
        auth: sessionId,
      }),
    )
    .then(({ data }) => {
      if (data?.doc?.error) {
        throw new Error(data.doc.error.msg.$)
      }

      const d = {
        phone: data?.doc?.tryphone?.$ || data?.doc?.phone?.$,
        phone_country: data?.doc?.phone_country?.$,
        type: data?.doc?.type?.$,
        action_type: data?.doc?.action_type?.$,
        code_count: data?.doc?.code_count?.$?.replace('You have', '')
          ?.replace('attempts to send the code', '')
          ?.replace('attempt to send the code', '')
          ?.trim(),
      }

      data?.doc?.slist?.forEach(el => {
        if (el.$name === 'phone_country') {
          d['phone_countries'] = el?.val
        }
        if (el.$name === 'type') {
          d['types'] = el?.val
        }

        if (el.$name === 'action_type') {
          d['action_types'] = el?.val
        }
      })

      setValidatePhoneData &&
        setValidatePhoneData(phoneData => {
          return { action_type: phoneData?.action_type, ...d }
        })
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

const fetchValidatePhoneStart =
  (data, setIsCodeStep, setIsTryLimit, setValidatePhoneData, setTimeOut) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'validatephone.start',
          out: 'json',
          lang: 'en',
          auth: sessionId,
          sok: 'ok',
          snext: 'ok',
          clicked_button: 'next',
          ...data,
        }),
      )
      .then(({ data }) => {
        if (data?.doc?.error) {
          if (data?.doc?.error?.$type === 'fraud_phone_try_limit') {
            setIsTryLimit && setIsTryLimit(true)
          }

          if (data?.doc?.error?.$type === 'fraud_phone_try_timeout') {
            setIsTryLimit && setTimeOut(Number(data?.doc?.error?.param?.$))
          }

          if (data?.doc?.error?.$type === 'exists') {
            toast.error(i18n.t('this_phone_exists', { ns: 'other' }), {
              position: 'bottom-right',
            })
          }
          throw new Error(data.doc.error.msg.$)
        }

        const d = {
          phone: data?.doc?.tryphone?.$ || data?.doc?.phone?.$,
          phone_country: data?.doc?.phone_country?.$,
          type: data?.doc?.type?.$,
          action_type: data?.doc?.action_type?.$,
          code_count: data?.doc?.code_count?.$?.replace('You have', '')
            ?.replace('attempts to send the code', '')
            ?.trim(),
        }

        data?.doc?.slist?.forEach(el => {
          if (el.$name === 'phone_country') {
            d['phone_countries'] = el?.val
          }
          if (el.$name === 'type') {
            d['types'] = el?.val
          }

          if (el.$name === 'action_type') {
            d['action_types'] = el?.val
          }
        })

        setValidatePhoneData &&
          setValidatePhoneData(phoneData => {
            return { action_type: phoneData?.action_type, ...d }
          })

        setIsCodeStep && setIsCodeStep(true)
        dispatch(actions.hideLoader())
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const fetchValidatePhoneFirst =
  (body, setValidatePhoneData, setIsCodeStep) => (dispatch, getState) => {
    dispatch(actions.showLoader())

    const {
      auth: { sessionId },
    } = getState()

    axiosInstance
      .post(
        '/',
        qs.stringify({
          func: 'validatephone.first',
          out: 'json',
          lang: 'en',
          auth: sessionId,
          sok: 'ok',
          snext: 'ok',
          clicked_button: 'next',
          ...body,
        }),
      )
      .then(({ data }) => {
        if (data?.doc?.error) {
          throw new Error(data.doc.error.msg.$)
        }

        if (body?.action_type === '2') {
          setIsCodeStep(true)
        }

        const d = {
          phone: data?.doc?.tryphone?.$ || data?.doc?.phone?.$,
          phone_country: data?.doc?.phone_country?.$,
          type: data?.doc?.type?.$,
          action_type: data?.doc?.action_type?.$,
          code_count: data?.doc?.code_count?.$?.replace('You have', '')
            ?.replace('attempts to send the code', '')
            ?.trim(),
        }

        data?.doc?.slist?.forEach(el => {
          if (el.$name === 'phone_country') {
            d['phone_countries'] = el?.val
          }
          if (el.$name === 'type') {
            d['types'] = el?.val
          }

          if (el.$name === 'action_type') {
            d['action_types'] = el?.val
          }
        })

        setValidatePhoneData &&
          setValidatePhoneData(phoneData => {
            return { action_type: phoneData?.action_type, ...d }
          })
        dispatch(actions.hideLoader())
      })
      .catch(error => {
        checkIfTokenAlive(error.message, dispatch)
        dispatch(actions.hideLoader())
      })
  }

const fetchValidatePhoneFinish = (data, navigateAfterSuccess) => (dispatch, getState) => {
  dispatch(actions.showLoader())

  const {
    auth: { sessionId },
  } = getState()

  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'validatephone.finish',
        out: 'json',
        lang: 'en',
        auth: sessionId,
        sok: 'ok',
        snext: 'ok',
        clicked_button: 'next',
        ...data,
      }),
    )
    .then(({ data }) => {
      if (data?.doc?.error) {
        if (data?.doc?.error?.$type === 'fraud_invalid_code') {
          toast.error(i18n.t('fraud_invalid_code', { ns: 'other' }), {
            position: 'bottom-right',
          })
        }
        throw new Error(data.doc.error.msg.$)
      }

      toast.success(i18n.t('The phone has been successfully verified', { ns: 'other' }), {
        position: 'bottom-right',
      })

      navigateAfterSuccess && navigateAfterSuccess()
      dispatch(userOperations.getUserInfo(sessionId, null, true))
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      checkIfTokenAlive(error.message, dispatch)
      dispatch(actions.hideLoader())
    })
}

export default {
  getUserEdit,
  getUserParams,
  setPersonalSettings,
  getTimeByTimeZone,
  setUserAvatar,
  setupEmailConfirm,
  setPasswordAccess,
  setTotp,
  getQR,
  getSecretKeyFile,
  setTotpPassword,
  confirmEmail,
  changeSocialLinkStatus,
  changeLang,
  fetchValidatePhone,
  fetchValidatePhoneStart,
  fetchValidatePhoneFirst,
  fetchValidatePhoneFinish,
}
