import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import { userSelectors } from '../../Redux'
import NotificationList from './NotificationList/NotificationList'
import s from './NotificationsBar.module.scss'
import { instanceOf } from 'prop-types'
import { useOutsideAlerter } from '../../utils'

export default function NotificationsBar({ handler, isBarOpened, removedNotification }) {
  const messages = useSelector(userSelectors.getUserItems)
  const { t } = useTranslation('container')

  let mes = 0

  if (Array.isArray(messages.bitem)) {
    mes = messages.bitem.length
  } else if (messages.bitem === 'undefined') {
    mes = 0
  } else if (instanceOf(messages.bitem) === 'object') {
    mes = 1
  } else {
    mes = 0
  }

  const getNotifBarEl = useRef()

  // const clickOutside = () => {
  //   setIsProfileOpened(!isProfileOpened)
  // }

  useOutsideAlerter(getNotifBarEl, isBarOpened, handler)

  const notifications = messages.bitem

  return (
    <>
      <div
        className={cn({ [s.notification_wrapper]: true, [s.opened]: isBarOpened })}
      ></div>
      <div
        ref={getNotifBarEl}
        className={cn({ [s.notificatonbar_container]: true, [s.opened]: isBarOpened })}
      >
        <div className={s.notification_title_container}>
          <p className={s.notification_title}>{`${t(
            'notification_bar.notifications',
          )} (${mes})`}</p>
          <div className={s.close_btn_wrapper}>
            <button className={s.close_btn} onClick={handler}></button>
          </div>
        </div>
        {isBarOpened && (
          <NotificationList
            notifications={notifications}
            removedNotification={removedNotification}
          />
        )}
      </div>
    </>
  )
}
