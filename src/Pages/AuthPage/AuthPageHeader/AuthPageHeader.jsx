import React from 'react'
import { Logo } from '../../../images'
import { ThemeBtn, LangBtn } from '../../../Components'
import s from './AuthPageHeader.module.scss'

export default function AuthPageHeader() {
  return (
    <header className={s.header}>
      <div className={`container ${s.flex}`}>
        <Logo svgwidth="105" svgheight="48" />
        <div className={s.btns_wrapper}>
          <ThemeBtn authType />
          <LangBtn authType />
        </div>
      </div>
    </header>
  )
}
