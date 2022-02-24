import React from 'react'

import { useSelector } from 'react-redux'
import { authSelectors } from '../../Redux/auth/authSelectors'
import { LangBtn } from '../../Components/LangBtn/LangBtn'

import logo_dt from '../../images/logo-dt.svg'
import logo_lt from '../../images/logo-lt.svg'
import s from './AuthPage.module.scss'
import { ThemeBtn } from '../../Components/ThemeBtn/ThemeBtn'
import selectors from '../../Redux/selectors'

export function AuthPage({ children }) {
  const isLoading = useSelector(authSelectors.getIsLoadding)
  const darkTheme = useSelector(selectors.getTheme) === 'dark'

  return (
    <>
      {isLoading ? <div>Загружаем...</div> : ''}

      <div className={s.wrapper}>
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
    </>
  )
}
