import React, { useEffect, useState } from 'react'
import AsideServicesMenu from './AsideServicesMenu/AsideServicesMenu'
import Header from './Header/Header'
import dayjs from 'dayjs'

import s from './Container.module.scss'
import { authSelectors, userOperations } from '../../Redux'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Div100vh from 'react-div-100vh'

export default function Component({ children }) {
  const { i18n } = useTranslation()

  const language =
    i18n.language === 'ua'
      ? 'uk'
      : i18n.language === 'kz'
      ? 'kk'
      : i18n.language === 'ge'
      ? 'ka'
      : i18n.language

  dayjs.locale(language)

  const [loading, setLoading] = useState(true)

  const dispatch = useDispatch()
  const sessionId = useSelector(authSelectors.getSessionId)

  useEffect(() => {
    dispatch(userOperations.getUserInfo(sessionId, setLoading))
    getNotifyHandler()
  }, [])

  const getNotifyHandler = () => {
    if (sessionId) {
      setInterval(() => dispatch(userOperations.getNotify()), 60000)
    }
  }

  if (loading) {
    return <></>
  }

  return (
    <>
      <div className={s.aside_menu_container}>
        <AsideServicesMenu />
      </div>
      <Header />
      <Div100vh className={s.container}>{children}</Div100vh>
    </>
  )
}
