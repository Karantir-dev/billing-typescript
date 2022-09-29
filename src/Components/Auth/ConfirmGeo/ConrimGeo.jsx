import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import * as route from '../../../routes'
import { authOperations } from '../../../Redux'
import { useDispatch } from 'react-redux'
import { Loader } from '../../../Components'

export default function ConfrimGeo() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const redirectToLogin = () => {
    navigate(route.LOGIN, {
      replace: true,
    })
  }

  useEffect(() => {
    const redirect = location.search.match(/redirect=(.+?)(?=&|$)/)?.[1]

    if (redirect) {
      dispatch(authOperations.geoConfirm(redirect, redirectToLogin))
    }
  }, [])

  return <Loader shown />
}
