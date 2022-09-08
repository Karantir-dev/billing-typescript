import React, { useEffect, useState } from 'react'
import { Logo } from '../../images'
import { useTranslation } from 'react-i18next'
import { ThemeBtn, LangBtn, Portal, Loader } from '../../Components'
import Div100vh from 'react-div-100vh'
// import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import s from './AuthPage.module.scss'
import { authOperations, authSelectors } from '../../Redux'
import { useDispatch, useSelector } from 'react-redux'

export default function AuthPage({ children }) {
  const { i18n } = useTranslation()
  const dispatch = useDispatch()
  const isLoginedBefore = useSelector(authSelectors.getIsLogined)

  const [isLangLoading, setIsLangLoading] = useState(true)

  const changeLang = lang => {
    i18n.changeLanguage(lang || 'en').then(() => {
      setIsLangLoading(false)
    })
  }
  useEffect(() => {
    if (!isLoginedBefore) {
      dispatch(authOperations.getLocation(changeLang))
    } else {
      setIsLangLoading(false)
    }
  }, [])

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
      <Portal>
        <Loader logo shown={isLangLoading} />
      </Portal>
    </Div100vh>
  )
}
