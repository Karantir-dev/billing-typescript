import React, { useEffect } from 'react'
import AuthRoutes from './public/AuthRoutes'
import SecureRoutes from './secure/SecureRoutes'
import { useDispatch, useSelector } from 'react-redux'
import { actions, authSelectors, selectors } from '../Redux'
import i18n from 'i18next'
import { toast } from 'react-toastify'

function getFaviconEl() {
  return document.getElementById('favicon')
}

function getFaviconMobEl() {
  return document.getElementById('favicon_mob')
}

let firstRender = true

const Component = () => {
  const dispatch = useDispatch()
  const onlineStatus = useSelector(selectors.onlineStatus)

  useEffect(() => {
    if (onlineStatus && !firstRender) {
      toast.success('You`re back online', { position: 'bottom-right', autoClose: 8000 })
      toast.dismiss('offlineToastId')
    } else if (!onlineStatus) {
      toast.error('You are offline', {
        position: 'bottom-right',
        autoClose: false,
        closeButton: false,
        closeOnClick: false,
        style: { cursor: 'grab' },
        toastId: 'offlineToastId',
      })
    }

    firstRender = false
  }, [onlineStatus])

  useEffect(() => {
    // const checkOnlineStatus = online => {
    //   fetch('https://www.google.com', { mode: 'no-cors' })
    //     .then(() => {
    //       !online && dispatch(actions.setOnline())
    //     })
    //     .catch(() => {
    //       dispatch(actions.setOffline())
    //     })
    //     .finally(() => {
    //       console.log(online)
    //       setTimeout(() => {
    //         checkOnlineStatus(online)
    //       }, 3000)
    //     })
    // }

    // checkOnlineStatus(onlineStatus)

    const intervalId = setInterval(() => {
      fetch('https://www.google.com', { mode: 'no-cors' })
        .then(() => {
          !onlineStatus && dispatch(actions.setOnline())
        })
        .catch(() => {
          onlineStatus && dispatch(actions.setOffline())
        })
    }, 3000)

    return () => {
      clearInterval(intervalId)
    }
  }, [onlineStatus])

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

  return <>{isAuthenticated ? <SecureRoutes /> : <AuthRoutes />}</>
}

export default Component
