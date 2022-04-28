import qs from 'qs'
import { actions } from '../'

import { axiosInstance } from '../../config/axiosInstance'
import settingsActions from './settingsActions'

const getUserEdit = elid => (dispatch, getState) => {
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
      dispatch(getUserParams())
    })
    .catch(error => {
      console.log('error', error)
      dispatch(actions.hideLoader())
    })
}

const getUserParams = () => (dispatch, getState) => {
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
      const telegram = data?.doc?.messages?.msg?.instruction?.match(/(https?:\/\/[^ ]*)/)
      let telegramLink = ''
      if (telegram?.length > 0) {
        telegramLink = telegram[0].slice(0, -1)
      }
      const elem = {
        timezone: data?.doc?.timezone?.$ || '',
        time: data?.doc?.time?.$ || '',
        telegram_id: data?.doc?.telegram_id?.$ || '',
        email: data?.doc?.email?.$ || '',
        avatar_view: data?.doc?.avatar_view?.$ || '',
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
      })

      dispatch(settingsActions.setUsersParams(elem))
      dispatch(actions.hideLoader())
    })
    .catch(error => {
      console.log('error', error)
      dispatch(actions.hideLoader())
    })
}

export default {
  getUserEdit,
  getUserParams,
}
