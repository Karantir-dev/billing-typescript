import React from 'react'
import Div100vh from 'react-div-100vh'
import cn from 'classnames'
import s from './AuthPage.module.scss'
import AuthPageHeader from './AuthPageHeader/AuthPageHeader'

export default function AuthPage({ children }) {
  const banner = false

  return (
    <Div100vh className={s.wrapper}>
      <AuthPageHeader />
      <div className={s.authScreens}>
        <div className={cn({ [s.blockWithBaner]: banner })}>{children}</div>
      </div>
    </Div100vh>
  )
}
