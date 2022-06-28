import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import * as route from '../../../routes'
import { authOperations } from '../../../Redux'
import { useDispatch } from 'react-redux'
import { Loader } from '../../'

export default function Google() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const redirectToRegistration = (errMsg, name, email) => {
    navigate(route.REGISTRATION, {
      state: { errMsg: errMsg, name: name, email: email },
      replace: true,
    })
  }

  useEffect(() => {
    const state = location.search.match(/state=(.+?)(?=&)/)?.[1]
    if (!state) {
      navigate(route.LOGIN, { replace: true })
      console.log('error ')
    } else {
      dispatch(authOperations.checkGoogleState(state, redirectToRegistration))
    }
  }, [])

  return <Loader shown />
}
