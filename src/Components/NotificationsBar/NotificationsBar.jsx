import React from 'react'
import { useSelector } from 'react-redux'
import { userSelectors } from '../../Redux/userInfo/userSelectors'
import cn from 'classnames'

import NotificationList from './NotificationList/NotificationList'
import s from './NotificationsBar.module.scss'

export default function NotificationsBar({ handler, isBarOpened }) {
  const messages = useSelector(userSelectors.getUserItems)

  const mes = messages.bitem ? messages.bitem.length : 0
  const notifications = messages.bitem

  console.log(notifications)

  return (
    <aside className={s.notification_wrapper}>
      <div
        className={cn({ [s.notificatonbar_container]: true, [s.opened]: isBarOpened })}
      >
        <div className={s.notification_title_container}>
          <p className={s.notification_title}>{`Оповещения (${mes})`}</p>
          <div className={s.close_btn_wrapper}>
            <button className={s.close_btn} onClick={handler}></button>
          </div>
        </div>
        <NotificationList notifications={notifications} />
      </div>
    </aside>
  )
}
