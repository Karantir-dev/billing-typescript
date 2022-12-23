import React, { useEffect, useState } from 'react'
import AsideServicesMenu from './AsideServicesMenu/AsideServicesMenu'
import Header from './Header/Header'
import dayjs from 'dayjs'
import { authSelectors, userOperations, userSelectors, selectors } from '../../Redux'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Div100vh from 'react-div-100vh'
import cn from 'classnames'

import s from './Container.module.scss'

function getFaviconEl() {
  return document.getElementById('favicon')
}

function getFaviconMobEl() {
  return document.getElementById('favicon_mob')
}

export default function Component({ children }) {
  const { i18n } = useTranslation()

  dayjs.locale(i18n.language)

  const [loading, setLoading] = useState(true)

  const dispatch = useDispatch()
  const sessionId = useSelector(authSelectors.getSessionId)
  const scrollForbidden = useSelector(selectors.isScrollForbidden)
  const online = useSelector(selectors.onlineStatus)

  const userTickets = useSelector(userSelectors.getUserTickets)
  const areNewTickets = userTickets.some(ticket => ticket.tstatus.$ === 'New replies')

  useEffect(() => {
    dispatch(userOperations.getUserInfo(sessionId, setLoading))

    let intervalId

    if (sessionId && online) {
      intervalId = setInterval(() => {
        dispatch(userOperations.getNotify())
        dispatch(userOperations.getTickets())
        // dispatch(userOperations.getUserInfo(sessionId))
      }, 60000)
    }

    return () => {
      clearInterval(intervalId)
    }

    // getNotifyHandler()
  }, [sessionId, online])

  // const getNotifyHandler = () => {
  //   if (sessionId) {
  //     setInterval(() => {
  //       dispatch(userOperations.getNotify())
  //     }, 60000)
  //   }
  // }

  const favicon = getFaviconEl()
  const favicon_mob = getFaviconMobEl()
  if (i18n.language !== 'ru') {
    if (areNewTickets) {
      favicon.href = require('../../images/favIcons/favicon_ua_active.png')
      favicon_mob.href = require('../../images/favIcons/favicon_192_ua_active.png')
    } else {
      favicon.href = require('../../images/favIcons/favicon_ua.ico')
      favicon_mob.href = require('../../images/favIcons/logo192_ua.png')
    }
  } else {
    if (areNewTickets) {
      favicon.href = require('../../images/favIcons/favicon_active.png')
      favicon_mob.href = require('../../images/favIcons/favicon_192_active.png')
    } else {
      favicon.href = require('../../images/favIcons/favicon.ico')
      favicon_mob.href = require('../../images/favIcons/logo192.png')
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
