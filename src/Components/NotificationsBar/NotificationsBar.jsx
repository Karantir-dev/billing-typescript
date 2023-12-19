import { useRef } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import { userSelectors } from '@redux'
import NotificationList from './NotificationList/NotificationList'
import s from './NotificationsBar.module.scss'

export default function NotificationsBar({ handler, isBarOpened }) {
  const userItems = useSelector(userSelectors.getUserItems)

  const { t } = useTranslation('container')

  const getNotifBarEl = useRef()

  console.log('userItems: ', userItems)
  return (
    <>
      <div
        className={cn({ [s.notification_wrapper]: true, [s.opened]: isBarOpened })}
        role="button"
        tabIndex={0}
        onKeyDown={() => null}
        onClick={() => handler()}
      ></div>
      <div
        ref={getNotifBarEl}
        className={cn({
          [s.notificatonbar_container]: true,
          [s.opened]: isBarOpened,
        })}
      >
        <div className={s.notification_title_container}>
          <p className={s.notification_title}>{`${t('notification_bar.notifications')} (${
            userItems.messages_count ? userItems?.messages_count : 0
          })`}</p>
          <div className={s.close_btn_wrapper}>
            <button className={s.close_btn} onClick={handler}></button>
          </div>
        </div>

        {isBarOpened && <NotificationList notifications={userItems} />}
      </div>
    </>
  )
}
