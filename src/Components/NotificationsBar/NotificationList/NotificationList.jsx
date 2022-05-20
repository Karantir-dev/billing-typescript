import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { userOperations, authSelectors } from '../../../Redux'
import NotificationListItem from '../NotificationListItem/NotificationListItem'

import s from './NotificationList.module.scss'
import classNames from 'classnames'

export default function NotificationList({ notifications, removedNotification }) {
  const isAuthenticated = useSelector(authSelectors.getSessionId)
  const { t } = useTranslation('container')
  const dispatch = useDispatch()

  let shortNotificationsList =
    notifications > 0 ? notifications.slice(0, 3) : notifications

  const [click, setClick] = useState(false)
  const [currentNotifList, setCurrentNotifList] = useState(shortNotificationsList)

  const handleShowMoreClick = () => {
    setCurrentNotifList(notifications)
    setClick(true)
  }

  const removeItem = id => {
    dispatch(userOperations.removeItems(isAuthenticated, id))

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
      {shortNotificationsList ? (
        <NotificationListItem
          removedNotification={removedNotification}
          arr={currentNotifList}
          removeItem={removeItem}
        />
      ) : (
        <p className={s.no_messages}>{t('notification_bar.no_messages')}</p>
      )}

      {notifications?.length > 3 && (
        <button
          className={classNames({ [s.btn]: true, [s.hidden]: click })}
          onClick={handleShowMoreClick}
        >
          <p className={s.show_more}>{t('notification_bar.show_more')}</p>
        </button>
      )}
    </>
  )
}
