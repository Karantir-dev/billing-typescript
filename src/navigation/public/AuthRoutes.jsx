import React, { useEffect, useState } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { AuthPage } from '../../Pages'
import {
  LoginForm,
  PasswordChange,
  PasswordReset,
  PublicRoute,
  SignupForm,
  SocialNetAuth,
  Portal,
  Loader,
} from '../../Components'
import { useTranslation } from 'react-i18next'
import { authOperations, authSelectors } from '../../Redux'
import { useDispatch, useSelector } from 'react-redux'
import * as route from '../../routes'

const Component = () => {
  const { i18n } = useTranslation()
  const dispatch = useDispatch()
  const isLoginedBefore = useSelector(authSelectors.getIsLogined)

  const [isLangLoading, setIsLangLoading] = useState(true)
  const [geoLang, setGeoLang] = useState('')

  const changeLang = country => {
    let language = 'en'
    if (country === 'UA') {
      language = 'uk'
    } else if (
      country === 'AZ' ||
      country === 'AM' ||
      country === 'BY' ||
      country === 'KG' ||
      country === 'LV' ||
      country === 'LT' ||
      country === 'MD' ||
      country === 'RU' ||
      country === 'TJ' ||
      country === 'TM' ||
      country === 'UZ' ||
      country === 'EE'
    ) {
      language = 'ru'
    } else if (country === 'KK' || country === 'KZ') {
      language = 'kk'
    } else if (country === 'GE' || country === 'KA') {
      language = 'ka'
    }

    i18n.changeLanguage(language || 'en').then(() => {
      setIsLangLoading(false)
    })
  }

  useEffect(() => {
    if (geoLang && !isLoginedBefore) {
      changeLang(geoLang)
    } else {
      if (geoLang) {
        setIsLangLoading(false)
      }
    }
  }, [geoLang])

  useEffect(() => {
    dispatch(authOperations.getLocation(setGeoLang))
  }, [])
  return (
    <>
      <Routes>
        <Route
          path={route.LOGIN}
          element={
            <PublicRoute
              children={<AuthPage children={<LoginForm />} />}
              restricted
              redirectTo={route.SERVICES}
            />
          }
        />
        <Route
          path={route.REGISTRATION}
          element={
            <PublicRoute
              children={<AuthPage children={<SignupForm geoLang={geoLang} />} />}
              restricted
              redirectTo={route.SERVICES}
            />
          }
        />

        <Route
          path={route.RESET_PASSWORD}
          element={
            <PublicRoute
              children={<AuthPage children={<PasswordReset />} />}
              restricted
              redirectTo={route.SERVICES}
            />
          }
        />
        <Route
          path={route.CHANGE_PASSWORD}
          element={
            <PublicRoute
              children={<AuthPage children={<PasswordChange />} />}
              restricted
              redirectTo={route.SERVICES}
            />
          }
        />
        <Route
          path={route.SOC_NET_AUTH}
          element={
            <PublicRoute
              children={<AuthPage children={<SocialNetAuth />} />}
              restricted
              redirectTo={route.SERVICES}
            />
          }
        />

        <Route path="*" element={<Navigate replace to={route.LOGIN} />} />
      </Routes>
      <Portal>
        <Loader logo shown={isLangLoading} />
      </Portal>
    </>
  )
}

export default Component
