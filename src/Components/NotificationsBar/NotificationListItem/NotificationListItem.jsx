import React from 'react'
import s from './NotificationListItem.module.scss'

export default function NotificationListItem({ arr, removeItem, removedNotification }) {
  return (
    <>
      {Array.isArray(arr) ? (
        arr.map(notif => {
          return (
            <div key={notif?.$id} className={s.notification_message_container}>
              <p className={s.notification_message}>{notif?.msg?.$}</p>
              <div className={s.close_btn_wrapper}>
                <button
                  className={s.close_btn}
                  onClick={() => {
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
