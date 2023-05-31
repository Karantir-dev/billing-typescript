import { useTranslation } from 'react-i18next'
import { notificationsTranslateFn } from '../../../utils'

import s from './NotificationListItem.module.scss'

export default function NotificationListItem({ arr, removeItem }) {
  const { t } = useTranslation(['container', 'other'])

  return (
    <>
      {Array.isArray(arr) ? (
        arr.map(notif => {
          return (
            <div key={notif?.$id} className={s.notification_message_container}>
              <p className={s.notification_message}>
                {notificationsTranslateFn(notif?.msg?.$, t)}
              </p>
              <div className={s.close_btn_wrapper}>
                <button
                  className={s.close_btn}
                  onClick={() => {
                    removeItem(notif?.$id)
                  }}
                ></button>
              </div>
            </div>
          )
        })
      ) : (
        <div key={arr?.$id} className={s.notification_message_container}>
          <p className={s.notification_message}>
            {notificationsTranslateFn(arr?.msg?.$, t)}
          </p>
          <div className={s.close_btn_wrapper}>
            <button
              className={s.close_btn}
              onClick={() => {
                removeItem(arr?.$id)
              }}
            ></button>
          </div>
        </div>
      )}
    </>
  )
}
