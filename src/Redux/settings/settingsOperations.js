import qs from 'qs'
import { actions, authOperations } from '../'
import { toast } from 'react-toastify'
import { axiosInstance } from '../../config/axiosInstance'
import settingsActions from './settingsActions'
import i18n from './../../i18n'

const getUserEdit =
  (elid, checkEmail = false) =>
  (dispatch, getState) => {
    dispatch(actions.showLoader())

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
          elid,
        }),
      )
      .then(({ data }) => {
        if (data.doc.error) throw new Error(data.doc.error.msg.$)
        // const data = data.doc

        const elem = {
          email: { email: data?.doc?.email?.$, readonly: false },
          phone: { phone: data?.doc?.phone?.$, readonly: false },
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

        dispatch(settingsActions.setUsersEdit(elem))
        dispatch(getUserParams(checkEmail))
      })
      .catch(error => {
        console.log('error', error)
        dispatch(actions.hideLoader())
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
        console.log('error', error)
        dispatch(actions.hideLoader())
      })
  }

const getUserParams =
  (checkEmail = false) =>
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
        }),
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
        dispatch(actions.hideLoader())
      })
      .then(() => {
        if (checkEmail) {
          dispatch(sendEmailConfirm())
        }
      })
      .catch(error => {
        console.log('error', error)
        dispatch(actions.hideLoader())
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
        console.log('error', error)
        dispatch(actions.hideLoader())
      })
  }

const setPersonalSettings = (elid, data) => (dispatch, getState) => {
  dispatch(actions.showLoader())

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
        out: 'json',
        auth: sessionId,
        elid,
        ...userEditData,
      }),
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
            elid,
            auth: sessionId,
            ...userParamsData,
          }),
        )
        .then(({ data }) => {
          if (data.doc.error) throw new Error(data.doc.error.msg.$)
          toast.success(i18n.t('Changes saved successfully', { ns: 'other' }), {
            position: 'bottom-right',
          })
          dispatch(getUserEdit(elid))
        })
        .catch(error => {
          console.log('error', error)
          dispatch(actions.hideLoader())
        })
    })
    .catch(error => {
      console.log('error', error)
      dispatch(actions.hideLoader())
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
      console.log('error', error)
      dispatch(actions.hideLoader())
    })
}

const sendEmailConfirm = () => (dispatch, getState) => {
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
        sv_field: 'send_confirm',
        auth: sessionId,
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) throw new Error(data.doc.error.msg.$)
      dispatch(settingsActions.emailStatusUpadate(data.doc?.send_status?.$))
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      dispatch(actions.hideLoader())
    })
}

const setPasswordAccess = (elid, d) => (dispatch, getState) => {
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
    sendemail: d?.sendemail ? 'on' : 'off',
    setgeoip: d?.setgeoip ? 'on' : 'off',
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

      if (d?.secureip) {
        return dispatch(authOperations.logout())
      }

      dispatch(getUserEdit(elid))
    })
    .catch(error => {
      console.log('error', error)
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
      console.log('error', error)
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
      console.log('error', error)
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
      console.log('error', error)
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
        login: 'test.hardsoft.cf(mikhail.tatochenko+1@zomro.org)',
        secret: d?.secret,
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
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
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
        auth: sessionId,
        key,
      }),
    )
    .then(({ data }) => {
      console.log(data?.doc)
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

      // dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      // dispatch(actions.hideLoader())
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
}
