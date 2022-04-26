import React from 'react'
import AsideServicesMenu from './AsideServicesMenu/AsideServicesMenu'
import Header from './Header/Header'

import s from './Container.module.scss'

export default function Component({ children }) {
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
