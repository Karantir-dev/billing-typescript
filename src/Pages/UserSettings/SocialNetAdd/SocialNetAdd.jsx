import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import * as route from '../../../routes'
import { authOperations } from '../../../Redux'
import { useDispatch } from 'react-redux'
import { Loader } from '../../../Components'

export default function SocialNetAdd() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const userAccess = route.USER_SETTINGS + '/access'

  const redirectToSettings = isExist => {
    navigate(userAccess, {
      state: { isCurrentSocialExist: isExist },
      replace: true,
    })
  }

  const redirectToServices = () => {
    navigate(route.SERVICES, {
      replace: true,
    })
  }

  useEffect(() => {
    const state = location.search.match(/state=(.+?)(?=&|$)/)?.[1]

    if (!state) {
      navigate(userAccess, { replace: true })
    } else {
      const isRequestFromSettings = localStorage.getItem('connect_social_in_settings')

      const redirectLink = isRequestFromSettings ? redirectToSettings : redirectToServices
      localStorage.removeItem('connect_social_in_settings')

      dispatch(
        authOperations.addLoginWithSocial(state, redirectLink, isRequestFromSettings),
      )
    }
  }, [])

  return <Loader shown />
}
