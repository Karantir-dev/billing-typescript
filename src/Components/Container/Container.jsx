import React, { useEffect, useState } from 'react'
import AsideServicesMenu from './AsideServicesMenu/AsideServicesMenu'
import Header from './Header/Header'
import dayjs from 'dayjs'

import s from './Container.module.scss'
import { authOperations, authSelectors, userOperations } from '../../Redux'
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

  //check if current session is active
  const events = ['click', 'load', 'scroll']
  const [eventChange, setEventChange] = useState(0)

  const handleActive = () => {
    setEventChange(eventChange + 1)
  }

  useEffect(() => {
    events.forEach(event => {
      window.addEventListener(event, handleActive)
    })

    return () => {
      window.removeEventListener('load', handleActive)
      window.removeEventListener('click', handleActive)
      window.removeEventListener('scroll', handleActive)
    }
  })

  useEffect(() => {
    if (sessionId) {
      dispatch(authOperations.getCurrentSessionStatus())
    }
  }, [eventChange])

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
