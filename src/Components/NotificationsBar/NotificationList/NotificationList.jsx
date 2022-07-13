import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { userOperations, authSelectors, userActions } from '../../../Redux'
import NotificationListItem from '../NotificationListItem/NotificationListItem'

import s from './NotificationList.module.scss'
// import classNames from 'classnames'

export default function NotificationList({ notifications }) {
  const isAuthenticated = useSelector(authSelectors.getSessionId)
  const { t } = useTranslation('container')
  const dispatch = useDispatch()

  // let shortNotificationsList =
  //   notifications > 0 ? notifications.slice(0, 3) : notifications

  // const [click, setClick] = useState(false)
  // const [currentNotifList, setCurrentNotifList] = useState(notifications)

  // const handleShowMoreClick = () => {
  //   setCurrentNotifList(notifications)
  //   setClick(true)
  // }

  const removeItem = id => {
    dispatch(userOperations.removeItems(isAuthenticated, id))
    dispatch(userActions.removeItems({ id, messages: notifications?.messages_count }))
  }

  const removeAllItems = () => {
    notifications?.messages?.forEach(el => {
      dispatch(userOperations.removeItems(isAuthenticated, el?.$id))
      dispatch(userActions.removeItems({ id: el?.$id, messages: 1 }))
    })
  }

  return (
    <>
      {notifications?.messages?.length > 0 || notifications?.messages?.$id ? (
        <NotificationListItem arr={notifications?.messages} removeItem={removeItem} />
      ) : (
        <p className={s.no_messages}>{t('notification_bar.no_messages')}</p>
      )}
      {/* {notifications?.length > 3 && (
        <button
          className={classNames({ [s.btn]: true, [s.hidden]: click })}
          onClick={handleShowMoreClick}
        >
          <p className={s.show_more}>{t('notification_bar.show_more')}</p>
        </button>
      )} */}
      {notifications?.messages?.length > 0 && (
        <button className={s.clear_btn} onClick={removeAllItems}>
          {t('clear_all')}
        </button>
      )}
    </>
  )
}
