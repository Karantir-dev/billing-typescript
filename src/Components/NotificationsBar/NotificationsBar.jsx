import React from 'react'
import { useSelector } from 'react-redux'
import cn from 'classnames'

import { userSelectors } from '../../Redux/userInfo/userSelectors'
import NotificationList from './NotificationList/NotificationList'
import s from './NotificationsBar.module.scss'
import { instanceOf } from 'prop-types'

export default function NotificationsBar({ handler, isBarOpened, removedNotification }) {
  const messages = useSelector(userSelectors.getUserItems)

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

  const notifications = messages.bitem

  console.log(notifications)

  return (
    <div
      className={s.notification_wrapper}
      role="button"
      tabIndex={0}
      onKeyDown={() => null}
      onClick={handler}
    >
      <div
        className={cn({ [s.notificatonbar_container]: true, [s.opened]: isBarOpened })}
        role="button"
        tabIndex={0}
        onKeyDown={() => null}
        onClick={e => e.stopPropagation()}
      >
        <div className={s.notification_title_container}>
          <p className={s.notification_title}>{`Оповещения (${mes})`}</p>
          <div className={s.close_btn_wrapper}>
            <button className={s.close_btn} onClick={handler}></button>
          </div>
        </div>
        <NotificationList
          notifications={notifications}
          removedNotification={removedNotification}
        />
      </div>
    </div>
  )
}
