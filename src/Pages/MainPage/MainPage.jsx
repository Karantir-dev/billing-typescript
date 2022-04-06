import React from 'react'

import { AsideServicesMenu, Header } from '../../Components'

import s from './MainPage.module.scss'

export default function MainPage() {
  return (
    <>
      <div className={s.aside_menu_container}>
        <AsideServicesMenu />
      </div>
      <Header />
    </>
  )
}
