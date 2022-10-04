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
  ConfirmGeo,
  Portal,
  Loader,
  CartFromSite,
} from '../../Components'
import { useTranslation } from 'react-i18next'
import { authOperations, authSelectors } from '../../Redux'
import { useDispatch, useSelector } from 'react-redux'
import * as route from '../../routes'

const Component = () => {
  const { i18n } = useTranslation()
  const dispatch = useDispatch()
  const isLoginedBefore = useSelector(authSelectors.getIsLogined)
  const geoData = useSelector(authSelectors.getGeoData)

  const [isLangLoading, setIsLangLoading] = useState(true)

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
    if (geoData && geoData?.clients_country_code && !isLoginedBefore) {
      changeLang(geoData?.clients_country_code)
    } else {
      if (geoData?.clients_country_code) {
        setIsLangLoading(false)
      }
    }
  }, [geoData])

  useEffect(() => {
    dispatch(authOperations.getLocation())
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
              children={
                <AuthPage
                  children={
                    <SignupForm
                      geoCountryId={geoData?.clients_country_id}
                      geoStateId={geoData?.state_id}
                    />
                  }
                />
              }
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
        <Route
          path={route.GEO_CONFIRM}
          element={
            <PublicRoute
              children={<AuthPage children={<ConfirmGeo />} />}
              restricted
              redirectTo={route.LOGIN}
            />
          }
        />
        <Route
          path={route.SITE_CART}
          element={
            <PublicRoute
              children={<AuthPage children={<CartFromSite />} />}
              restricted
              redirectTo={route.LOGIN}
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
