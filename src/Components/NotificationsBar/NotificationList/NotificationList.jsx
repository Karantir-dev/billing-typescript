import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { userOperations, authSelectors, userActions } from '@redux'
import NotificationListItem from '../NotificationListItem/NotificationListItem'

import s from './NotificationList.module.scss'
import { useState } from 'react'
import { LoaderDots } from '@src/Components'

export default function NotificationList({ notifications }) {
  const isAuthenticated = useSelector(authSelectors.getSessionId)
  const { t } = useTranslation('container')
  const dispatch = useDispatch()

  const [isLoader, setIsLoader] = useState([])

  const updateNotifyHandler = () => {
    dispatch(userOperations.getNotify(setIsLoader))
  }

  const removeItem = id => {
    setIsLoader(l => [...l, id])
    dispatch(userOperations.removeItems(isAuthenticated, id, updateNotifyHandler))
    dispatch(userActions.removeItems({ id, messages: notifications?.messages_count }))
  }

  const removeAllItems = () => {
    notifications?.messages?.forEach((el, index) => {
      setIsLoader(l => [...l, el?.$id])
      dispatch(
        userOperations.removeItems(
          isAuthenticated,
          el?.$id,
          notifications?.messages?.length - 1 === index
            ? () => updateNotifyHandler()
            : null,
        ),
      )
      dispatch(userActions.removeItems({ id: el?.$id, messages: 1 }))
    })
  }

  return (
    <div className={s.notifList}>
      {notifications?.messages?.length > 0 || notifications?.messages?.$id ? (
        <NotificationListItem arr={notifications?.messages} removeItem={removeItem} />
      ) : (
        isLoader?.length === 0 && (
          <p className={s.no_messages}>{t('notification_bar.no_messages')}</p>
        )
      )}

      {isLoader?.length > 0 && (
        <div className={s.loader}>
          <LoaderDots />
        </div>
      )}
      {notifications?.messages?.length > 0 && (
        <button className={s.clear_btn} onClick={removeAllItems}>
          {t('clear_all', { num: notifications?.messages?.length })}
        </button>
      )}
    </div>
  )
}
