import React from 'react'
import cn from 'classnames'
import { useSelector } from 'react-redux'
import { Logo } from '../../images'
import { ThemeBtn, LangBtn } from '../../Components'
import { selectors } from '../../Redux'

import s from './AuthPage.module.scss'

export default function AuthPage({ children }) {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'

  return (
    <div className={cn({ [s.wrapper]: true, [s.dt]: darkTheme })}>
      <header className={s.header}>
        <div className={`container ${s.flex}`}>
          <Logo svgwidth="105" svgheight="48" />
          <div className={s.btns_wrapper}>
            <ThemeBtn authType />
            <LangBtn authType />
          </div>
        </div>
      </header>
      {children}
    </div>
  )
}
