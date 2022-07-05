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

  const redirectToSettings = (errMsg, socNetName) => {
    navigate(route.USER_SETTINGS, {
      state: { errMsg: errMsg, socNetName },
      replace: true,
    })
  }

  useEffect(() => {
    const state = location.search.match(/state=(.+?)(?=&|$)/)?.[1]

    if (!state) {
      navigate(route.USER_SETTINGS, { replace: true })
      console.log('no state ')
    } else {
      dispatch(authOperations.addLoginWithSocial(state, redirectToSettings))
    }
  }, [])

  return <Loader shown />
}
