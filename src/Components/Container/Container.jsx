import React from 'react'
import AsideServicesMenu from './AsideServicesMenu/AsideServicesMenu'
import Header from './Header/Header'
import i18next from 'i18next'
import dayjs from 'dayjs'

import s from './Container.module.scss'

export default function Component({ children }) {
  dayjs.locale(i18next.language)

  return (
    <>
      <div className={s.aside_menu_container}>
        <AsideServicesMenu />
      </div>
      <Header />
      <div className={s.container}>{children}</div>
    </>
  )
}
