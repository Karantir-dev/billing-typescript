import React from 'react'
import { Logo } from '../../images'
import { ThemeBtn, LangBtn } from '../../Components'
import Div100vh from 'react-div-100vh'
// import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import s from './AuthPage.module.scss'

export default function AuthPage({ children }) {
  return (
    <Div100vh className={s.wrapper}>
      <header className={s.header}>
        <div className={`container ${s.flex}`}>
          <Logo svgwidth="105" svgheight="48" />
          <div className={s.btns_wrapper}>
            <ThemeBtn authType />
            <LangBtn authType />
          </div>
        </div>
      </header>
      {/* <GoogleReCaptchaProvider reCaptchaKey="6LczA40hAAAAACFSZS6vTOGp0YfBFlmtz6lP7zBx"> */}
      {children}
      {/* </GoogleReCaptchaProvider> */}
    </Div100vh>
  )
}
