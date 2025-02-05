import { useEffect, useRef } from 'react'
import AuthRoutes from './public/AuthRoutes'
import SecureRoutes from './secure/SecureRoutes'
import { useDispatch, useSelector } from 'react-redux'
import { actions, authActions, authSelectors, selectors } from '@redux'
import i18n, { t } from 'i18next'
import { toast } from 'react-toastify'
import { cookies } from '@utils'
import { useLocation, useSearchParams } from 'react-router-dom'
import * as route from '@src/routes'
import { CartPage } from '@pages'

// function getFaviconEl() {
//   return document.getElementById('favicon')
// }

// function getFaviconMobEl() {
//   return document.getElementById('favicon_mob')
// }

let firstRender = true

const Component = () => {
  const dispatch = useDispatch()
  const onlineStatus = useSelector(selectors.onlineStatus)
  const authErrorMsg = useSelector(authSelectors.getAuthErrorMsg)

  const [searchParams] = useSearchParams()

  const searchParam = useRef(searchParams.get('func'))
  const location = useLocation()

  // Network Error / 403 error handling
  useEffect(() => {
    if (authErrorMsg === 'warnings.403_error_code') {
      fetch('https://www.google.com', { mode: 'no-cors' })
        .then(() => {
          !onlineStatus && dispatch(actions.setOnline())

          cookies.eraseCookie('sessionId')
          dispatch(authActions.logoutSuccess())
        })
        .catch(() => {
          onlineStatus && dispatch(actions.setOffline())
          dispatch(authActions.clearAuthErrorMsg())
        })
    }
  }, [authErrorMsg])

  useEffect(() => {
    if (onlineStatus && !firstRender) {
      toast.success(t('online', { ns: 'other' }), {
        id: 'online',
        position: 'bottom-right',
        autoClose: 8000,
      })
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
    const intervalId =
      process.env.NODE_ENV !== 'development' &&
      setInterval(() => {
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

  useEffect(() => {
    const sessionId = cookies.getCookie('sessionId')
    const theme = cookies.getCookie('theme') || 'light'

    dispatch(actions.changeTheme(theme))

    if (sessionId) {
      dispatch(authActions.loginSuccess(sessionId))
    } else {
      dispatch(authActions.logoutSuccess())
    }
  }, [])

  i18n.on('languageChanged', () => {
    // const favicon = getFaviconEl()
    // const favicon_mob = getFaviconMobEl()
    // if (l !== 'ru') {
    //   favicon.href = require('@images/favIcons/favicon_ua.ico')
    //   favicon_mob.href = require('@images/favIcons/logo192_ua.png')
    // } else {
    //   favicon.href = require('@images/favIcons/favicon.ico')
    //   favicon_mob.href = require('@images/favIcons/logo192.png')
    // }

    dispatch(actions.hideLoader())
  })

  const isAuthenticated = useSelector(authSelectors.getSessionId)

  if (location.pathname === route.CART) {
    return <CartPage />
  }

  return (
    <>
      {isAuthenticated ? (
        <SecureRoutes fromPromotionLink={searchParam.current === 'vhost.order.param'} />
      ) : (
        <AuthRoutes />
      )}
    </>
  )
}

export default Component
