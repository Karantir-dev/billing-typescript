import React from 'react'

import { useSelector } from 'react-redux'

import { authSelectors } from '../Redux/auth/authSelectors'
import { LoginForm } from '../Components/LoginForm/LoginForm'

export function LoginPage() {
  const isLoading = useSelector(authSelectors.getIsLoadding)

  return (
    <>
      {isLoading ? <div className="loader">Загружаем...</div> : ''}
      <LoginForm />
    </>
  )
}
