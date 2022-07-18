import React from 'react' // useEffect
import AuthRoutes from './public/AuthRoutes'
import SecureRoutes from './secure/SecureRoutes'
import { useDispatch, useSelector } from 'react-redux'
import {
  actions,
  authSelectors,
  //  supportSelectors
} from '../Redux'
import i18n from 'i18next'

function getFaviconEl() {
  return document.getElementById('favicon')
}

function getFaviconMobEl() {
  return document.getElementById('favicon_mob')
}

const Component = () => {
  const dispatch = useDispatch()

  // const notifications = useSelector(userSelectors.getUserItems)
  // let areNewTickets = useSelector(supportSelectors.getTicket)
  // areNewTickets = true

  i18n.on('languageChanged', l => {
    const favicon = getFaviconEl()
    const favicon_mob = getFaviconMobEl()
    if (l !== 'ru') {
      favicon.href = require('../images/favIcons/favicon_ua.ico')
      favicon_mob.href = require('../images/favIcons/logo192_ua.png')
    } else {
      favicon.href = require('../images/favIcons/favicon.ico')
      favicon_mob.href = require('../images/favIcons/logo192.png')
    }

    dispatch(actions.hideLoader())
  })

  const isAuthenticated = useSelector(authSelectors.getSessionId)

  // useEffect(() => {
  //   const favicon = getFaviconEl()
  //   const favicon_mob = getFaviconMobEl()
  //   if (i18n.language !== 'ru') {
  //     if (areNewTickets) {
  //       favicon.href = require('../images/favIcons/favicon_ua.ico')
  //       favicon_mob.href = require('../images/favIcons/logo192_ua.png')
  //     } else {
  //       favicon.href = require('../images/favIcons/favicon_ua.ico')
  //       favicon_mob.href = require('../images/favIcons/logo192_ua.png')
  //     }
  //   } else {
  //     if (areNewTickets) {
  //       favicon.href = require('../images/favIcons/favicon_active.png')
  //       favicon_mob.href = require('../images/favIcons/logo192.png')
  //     } else {
  //       favicon.href = require('../images/favIcons/favicon.ico')
  //       favicon_mob.href = require('../images/favIcons/logo192.png')
  //     }
  //   }
  // })

  return <>{isAuthenticated ? <SecureRoutes /> : <AuthRoutes />}</>
}

export default Component
