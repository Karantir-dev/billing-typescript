import React from 'react'

import { useSelector } from 'react-redux'
import { authSelectors } from '../../Redux/auth/authSelectors'
import { LangBtn } from '../../Components/LangBtn/LangBtn'

import logo_dt from '../../images/logo-dt.svg'
import logo_wt from '../../images/logo-wt.svg'
import s from './AuthPage.module.scss'

export function AuthPage({ children }) {
  const isLoading = useSelector(authSelectors.getIsLoadding)

  return (
    <>
      {isLoading ? <div>Загружаем...</div> : ''}

      <div className={s.wrapper}>
        <div className={s.header}>
          <div className={`container ${s.flex}`}>
            {/* <img className={s.logo} src={logo_dt} alt="logo" /> */}
            <img className={s.logo} src={logo_wt} alt="logo" />

            <LangBtn />
          </div>
        </div>
        {children}
      </div>
    </>
  )
}
