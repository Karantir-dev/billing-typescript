import React from 'react'
import AsideServicesMenu from './AsideServicesMenu/AsideServicesMenu'
import Header from './Header/Header'
import dayjs from 'dayjs'

import s from './Container.module.scss'
import { useTranslation } from 'react-i18next'

export default function Component({ children }) {
  const { i18n } = useTranslation()

  dayjs.locale(i18n.language)

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
