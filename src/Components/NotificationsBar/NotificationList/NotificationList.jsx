import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { userOperations } from '../../../Redux/userInfo/userOperations'
import { authSelectors } from '../../../Redux/auth/authSelectors'
import NotificationListItem from '../NotificationListItem/NotificationListItem'

import s from './NotificationList.module.scss'

export default function NotificationList({ notifications, removedNotification }) {
  const isAuthenticated = useSelector(authSelectors.getSessionId)

  let shortNotificationsList = notifications

  const [showMore, setShowMore] = useState({
    isClicked: false,
    messages: shortNotificationsList,
  })

  const [currentNotifList, setCurrentNotifList] = useState(showMore.messages)

  console.log(shortNotificationsList)

  const handleShowMoreClick = () => {
    setShowMore({
      isClicked: true,
      messages: notifications,
    })
  }

  const removeItem = id => {
    userOperations.removeItems(isAuthenticated, id)
    console.log(`it was removed notification on ${id} id`)
    console.log(showMore.messages)
    setCurrentNotifList(() => {
      if (Array.isArray(currentNotifList)) {
        return currentNotifList.filter(item => item.$id !== id)
      } else if (currentNotifList.id !== id) {
        return currentNotifList
      }
    })
  }

  return (
    <>
      {notifications ? (
        <NotificationListItem
          removedNotification={removedNotification}
          arr={currentNotifList}
          removeItem={removeItem}
        />
      ) : (
        <p className={s.no_messages}>There are no messages</p>
      )}
      {notifications?.length > 3 && !showMore.isClicked && (
        <button onClick={handleShowMoreClick}>
          <p className={s.show_more}>Смотреть все уведомления</p>
        </button>
      )}
    </>
  )
}
