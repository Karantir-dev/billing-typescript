import React, { useState } from 'react'

import s from './NotificationList.module.scss'
import { userOperations } from '../../../Redux/userInfo/userOperations'
import { useSelector } from 'react-redux'
import { authSelectors } from '../../../Redux/auth/authSelectors'
import NotificationListItem from '../NotificationListItem'

export default function NotificationList({ notifications }) {
  const isAuthenticated = useSelector(authSelectors.getSessionId)

  let shortNotificationsList =
    notifications?.length > 3 ? notifications.slice(0, 3) : notifications

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
        currentNotifList
      }
      // return Array.isArray(currentNotifList)
      //   ? currentNotifList.filter(item => item.$id !== id)
      //   : currentNotifList.id !== id
      //   ? currentNotifList
      //   : null
    })
  }

  return (
    <>
      {notifications ? (
        <NotificationListItem arr={currentNotifList} removeItem={removeItem} />
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
