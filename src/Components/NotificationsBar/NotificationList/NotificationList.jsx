import React, { useState } from 'react'
import { nanoid } from 'nanoid'

import s from './NotificationList.module.scss'

export default function NotificationList({ notifications }) {
  let shortNotificationsList =
    notifications?.length > 3 ? notifications.slice(0, 3) : notifications
  const [showMore, setShowMore] = useState({
    isClicked: false,
    messages: shortNotificationsList,
  })

  console.log(shortNotificationsList)

  const handleShowMoreClick = () => {
    setShowMore({
      isClicked: true,
      messages: notifications,
    })
  }

  return (
    <>
      {notifications ? (
        showMore.messages.map(notif => {
          return (
            <div className={s.notification_message_container} key={nanoid()}>
              <p className={s.notification_message}>{notif.msg.$}</p>
              <div className={s.close_btn_wrapper}>
                <button className={s.close_btn}></button>
              </div>
            </div>
          )
        })
      ) : (
        <p>there are no messages</p>
      )}
      {notifications?.length > 3 && !showMore.isClicked && (
        <button onClick={handleShowMoreClick}>
          <p className={s.show_more}>Смотреть все уведомления</p>
        </button>
      )}
    </>
  )
}
