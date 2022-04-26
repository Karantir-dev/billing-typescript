import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { userOperations, authSelectors } from '../../../Redux'
import NotificationListItem from '../NotificationListItem/NotificationListItem'

import s from './NotificationList.module.scss'

export default function NotificationList({ notifications, removedNotification }) {
  const isAuthenticated = useSelector(authSelectors.getSessionId)
  const { t } = useTranslation('main')

  let shortNotificationsList = notifications

  const [showMore, setShowMore] = useState({
    isClicked: false,
    messages: shortNotificationsList,
  })

  const [currentNotifList, setCurrentNotifList] = useState(showMore.messages)

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
        <p className={s.no_messages}>{t('notification_bar.no_messages')}</p>
      )}
      {notifications?.length > 3 && !showMore.isClicked && (
        <button onClick={handleShowMoreClick}>
          <p className={s.show_more}>{t('notification_bar.show_more')}</p>
        </button>
      )}
    </>
  )
}
