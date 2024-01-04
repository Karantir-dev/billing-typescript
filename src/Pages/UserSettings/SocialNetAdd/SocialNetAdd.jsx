import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import * as route from '@src/routes'
import { authOperations } from '@redux'
import { useDispatch } from 'react-redux'
import { Loader } from '@components'

export default function SocialNetAdd() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const userSettingsRoute = route.USER_SETTINGS + '/access'

  const redirectToSettings = () => {
    navigate(userSettingsRoute, {
      replace: true,
    })
  }

  // const redirectToServices = () => {
  //   navigate(route.SERVICES, {
  //     replace: true,
  //   })
  // }

  useEffect(() => {
    const state = location.search.match(/state=(.+?)(?=&|$)/)?.[1]

    if (!state) {
      navigate(userSettingsRoute, { replace: true })
    } else {
      // const isRequestFromSettings = localStorage.getItem('connect_social_in_settings')

      dispatch(authOperations.addLoginWithSocial(state, redirectToSettings))
    }
  }, [])

  return <Loader shown />
}
