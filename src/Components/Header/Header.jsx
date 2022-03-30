import React from 'react'
import { LangBtn } from '../LangBtn/LangBtn'
import { ThemeBtn } from '../ThemeBtn/ThemeBtn'
// import BurgerMenu from './BurgerMenu/BurgerMenu'

export default function Header() {
  return (
    <header>
      <ThemeBtn />
      <LangBtn />
      {/* <BurgerMenu /> */}
    </header>
  )
}
