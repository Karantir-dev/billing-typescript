import React from 'react'

import { AsideServicesMenu, Container, Header } from '../../Components'

import s from './MainPage.module.scss'

export default function MainPage({ children }) {
  return (
    <>
      <div className={s.aside_menu_container}>
        <AsideServicesMenu />
      </div>
      <Header />
      <Container children={children} />
    </>
  )
}
