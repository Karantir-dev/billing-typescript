import React, { useEffect, useState } from 'react'
import AsideServicesMenu from './AsideServicesMenu/AsideServicesMenu'
import Header from './Header/Header'
import dayjs from 'dayjs'

import s from './Container.module.scss'
import { authSelectors, userOperations } from '../../Redux'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

export default function Component({ children }) {
  const { i18n } = useTranslation()

  dayjs.locale(i18n.language)

  const [loading, setLoading] = useState(true)

  const dispatch = useDispatch()
  const sessionId = useSelector(authSelectors.getSessionId)

  useEffect(() => {
    dispatch(userOperations.getUserInfo(sessionId, setLoading))
  }, [])

  if (loading) {
    return <></>
  }

  return (
    <>
      <div className={s.aside_menu_container}>
        <AsideServicesMenu />
      </div>
      <Header />
      <div className={s.container}>{children}</div>
    </>
  )
}
