import React from 'react'
import { useTranslation } from 'react-i18next'

import s from './NotificationListItem.module.scss'

export default function NotificationListItem({ arr, removeItem, removedNotification }) {
  const { t } = useTranslation(['container', 'other'])

  return (
    <>
      {Array.isArray(arr) ? (
        arr.map(notif => {
          const ticketCode = notif?.msg?.$.trim().split(' ').slice(1, 3).join(' ')
          const notifText = notif?.msg?.$.trim().split(' ').slice(3).join(' ')
          const message = `${t('service', {
            ns: 'other',
          })} ${ticketCode} ${t(`notification_bar.${notifText}`)}`

          return (
            <div key={notif?.$id} className={s.notification_message_container}>
              <p className={s.notification_message}>{message}</p>
              <div className={s.close_btn_wrapper}>
                <button
                  className={s.close_btn}
                  onClick={function () {
                    removeItem(notif?.$id)
                    removedNotification()
                  }}
                ></button>
              </div>
            </div>
          )
        })
      ) : (
        <div key={arr?.$id} className={s.notification_message_container}>
          <p className={s.notification_message}>{arr?.msg?.$}</p>
          <div className={s.close_btn_wrapper}>
            <button
              className={s.close_btn}
              onClick={() => {
                removeItem(arr?.$id)
                removedNotification()
              }}
            ></button>
          </div>
        </div>
      )}
    </>
  )
}
