import React, { useEffect, useState } from 'react'
import AsideServicesMenu from './AsideServicesMenu/AsideServicesMenu'
import Header from './Header/Header'
import dayjs from 'dayjs'
import { authSelectors, userOperations, selectors } from '../../Redux'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Div100vh from 'react-div-100vh'
import cn from 'classnames'

import s from './Container.module.scss'

export default function Component({ children }) {
  const { i18n } = useTranslation()

  dayjs.locale(i18n.language)

  const [loading, setLoading] = useState(true)

  const dispatch = useDispatch()
  const sessionId = useSelector(authSelectors.getSessionId)
  const scrollForbidden = useSelector(selectors.isScrollForbidden)

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
      <Div100vh className={cn(s.container, { [s.scroll_forbidden]: scrollForbidden })}>
        {children}
      </Div100vh>
    </>
  )
}
