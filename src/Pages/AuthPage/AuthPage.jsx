import React from 'react'

import { useSelector } from 'react-redux'

import { LangBtn } from '../../Components'

import logo_dt from '../../images/logo-dt.svg'
import logo_lt from '../../images/logo-lt.svg'
import s from './AuthPage.module.scss'
import { ThemeBtn } from '../../Components/'
import { selectors } from '../../Redux/selectors'
import cn from 'classnames'

export default function AuthPage({ children }) {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'

  return (
    <div className={cn({ [s.wrapper]: true, [s.dt]: darkTheme })}>
      <div className={s.header}>
        <div className={`container ${s.flex}`}>
          <img className={s.logo} src={darkTheme ? logo_dt : logo_lt} alt="logo" />

          <div className={s.btns_wrapper}>
            <ThemeBtn />
            <LangBtn />
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}
