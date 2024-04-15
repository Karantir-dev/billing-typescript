import { useEffect, useState } from 'react'
import AsideServicesMenu from './AsideServicesMenu/AsideServicesMenu'
import Header from './Header/Header'
import dayjs from 'dayjs'
import {
  authSelectors,
  userOperations,
  userSelectors,
  selectors,
  userActions,
} from '@redux'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Div100vh from 'react-div-100vh'
import cn from 'classnames'
import { toast } from 'react-toastify'

import s from './Container.module.scss'
import { useLocation } from 'react-router-dom'

function getFaviconEl() {
  return document.getElementById('favicon')
}

function getFaviconMobEl() {
  return document.getElementById('favicon_mob')
}

export default function Component({ children }) {
  const { i18n, t } = useTranslation(['other'])
  const location = useLocation()

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
        dispatch(userOperations.getDashboardInfo())
      }, 60000)
    }

    return () => {
      clearInterval(intervalId)
    }

    // getNotifyHandler()
  }, [sessionId, online])

  useEffect(() => {
    dispatch(userActions.setIsNewMessage(areNewTickets))

    if (areNewTickets) {
      if (location.pathname.match(/\/support\/requests\/(\d+)/)) {
        return
      }

      const ticketId = userTickets.find(ticket => ticket.tstatus.$ === 'New replies')?.id
        .$

      toast.info(t('new_ticket_message', { id: ticketId }), {
        position: 'bottom-right',
        autoClose: 8000,
      })
    }
  }, [areNewTickets])

  // const getNotifyHandler = () => {
  //   if (sessionId) {
  //     setInterval(() => {
  //       dispatch(userOperations.getNotify())
  //     }, 60000)
  //   }
  // }

  const favicon = getFaviconEl()
  const favicon_mob = getFaviconMobEl()
  // if (i18n.language !== 'ru') {
  //   if (areNewTickets) {
  //     favicon.href = require('@images/favIcons/favicon_ua_active.png')
  //     favicon_mob.href = require('@images/favIcons/favicon_192_ua_active.png')
  //   } else {
  //     favicon.href = require('@images/favIcons/favicon_ua.ico')
  //     favicon_mob.href = require('@images/favIcons/logo192_ua.png')
  //   }
  // } else {
  if (areNewTickets) {
    favicon.href = require('@images/favIcons/favicon_active.png')
    favicon_mob.href = require('@images/favIcons/favicon_192_active.png')
  } else {
    favicon.href = require('@images/favIcons/favicon.ico')
    favicon_mob.href = require('@images/favIcons/logo192.png')
  }
  // }

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
