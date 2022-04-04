import React from 'react'
// import { NavLink } from 'react-router-dom'
// import { useSelector } from 'react-redux'
// import cn from 'classnames'

// import * as routes from '../../routes'
import s from './NotificationsBar.module.scss'

export default function NotificationsBar() {
  return (
    <aside>
      <div className={s.notification_title_container}>
        <p className={s.notification_title}>Оповещения (2)</p>
        <button>X</button>
      </div>
    </aside>
  )
}
