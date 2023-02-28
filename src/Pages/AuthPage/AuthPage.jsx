import React from 'react'
import { Logo } from '../../images'
import { ThemeBtn, LangBtn } from '../../Components'
import Div100vh from 'react-div-100vh'
import cn from 'classnames'
// import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import ValentinesDayBigBaner from './Banners/ValentinesDay/ValentinesDayBigBaner'
import ValentinesDaySmallBaner from './Banners/ValentinesDay/ValentinesDaySmallBaner'

import s from './AuthPage.module.scss'

export default function AuthPage({ children }) {
  const banner = false

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
      <div className={s.authScreens}>
        {banner && (
          <div className={s.bannerBlock}>
            <ValentinesDayBigBaner />
          </div>
        )}
        <div className={cn({ [s.blockWithBaner]: banner })}>
          {banner && (
            <div className={s.bannerSmallBlock}>
              <ValentinesDaySmallBaner />
            </div>
          )}
          {children}
        </div>
      </div>
      {/* </GoogleReCaptchaProvider> */}
    </Div100vh>
  )
}
