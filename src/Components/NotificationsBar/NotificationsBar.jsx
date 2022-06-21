import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import { userSelectors } from '../../Redux'
import NotificationList from './NotificationList/NotificationList'
import s from './NotificationsBar.module.scss'
import { useOutsideAlerter } from '../../utils'

export default function NotificationsBar({
  handler,
  isBarOpened,
  removedNotification,
  countNotification,
}) {
  const messages = useSelector(userSelectors.getUserItems)
  const { t } = useTranslation('container')

  const getNotifBarEl = useRef()

  useOutsideAlerter(getNotifBarEl, isBarOpened, handler) // check for error

  const notifications = messages.bitem

  return (
    <>
      <div
        className={cn({ [s.notification_wrapper]: true, [s.opened]: isBarOpened })}
      ></div>
      <div
        ref={getNotifBarEl}
        className={cn({
          [s.notificatonbar_container]: true,
          [s.opened]: isBarOpened,
        })}
      >
        <div className={s.notification_title_container}>
          <p className={s.notification_title}>{`${t(
            'notification_bar.notifications',
          )} (${countNotification})`}</p>
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
