import React from 'react'
import { useSelector } from 'react-redux'
import { Logo } from '../../images'
import s from './AuthPage.module.scss'
import { ThemeBtn, LangBtn } from '../../Components'
import { selectors } from '../../Redux/selectors'
import cn from 'classnames'

export default function AuthPage({ children }) {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'

  return (
    <div className={cn({ [s.wrapper]: true, [s.dt]: darkTheme })}>
      <header className={s.header}>
        <div className={`container ${s.flex}`}>
          <Logo />
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
