import { useEffect, useState } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { AuthPage } from '@pages'
import {
  LoginForm,
  PasswordChange,
  PasswordReset,
  SignupForm,
  SocialNetAuth,
  ConfirmGeo,
  Portal,
  Loader,
  CartFromSite,
  MainEmailConfirmation,
} from '@components'
import { useTranslation } from 'react-i18next'
import { authOperations, authSelectors } from '@redux'
import { useDispatch, useSelector } from 'react-redux'
import * as route from '@src/routes'
import { RUS_LANG_COUNTRIES } from '@src/utils/constants'

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
    } else if (RUS_LANG_COUNTRIES.includes(country)) {
      language = 'ru'
    }

    i18n.changeLanguage(language).then(() => {
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

    const clearRegisterCountries = () => localStorage.removeItem('countriesForRegister')

    window.addEventListener('beforeunload', clearRegisterCountries)

    return () => {
      clearRegisterCountries()
      window.removeEventListener('beforeunload', clearRegisterCountries)
    }
  }, [])

  return (
    <>
      <Routes>
        <Route
          path={route.LOGIN}
          element={
            <AuthPage
              children={<LoginForm geoCountryId={geoData?.clients_country_id} />}
            />
          }
        />
        <Route
          path={route.REGISTRATION}
          element={
            <AuthPage
              children={
                <SignupForm
                  geoCountryId={geoData?.clients_country_id}
                  geoStateId={geoData?.state_id}
                />
              }
            />
          }
        />
        <Route
          path={route.RESET_PASSWORD}
          element={<AuthPage children={<PasswordReset />} />}
        />
        <Route
          path={route.CHANGE_PASSWORD}
          element={<AuthPage children={<PasswordChange />} />}
        />
        <Route path={route.SOC_NET_AUTH} element={<SocialNetAuth />} />
        <Route
          path={route.GEO_CONFIRM}
          element={<AuthPage children={<ConfirmGeo />} />}
        />
        <Route path={route.SITE_CART} element={<CartFromSite />} />

        <Route path={route.CONFIRM_MAIN_EMAIL} element={<MainEmailConfirmation />} />

        <Route path="*" element={<Navigate replace to={route.LOGIN} />} />
      </Routes>
      <Portal>
        <Loader logo shown={isLangLoading} />
      </Portal>
    </>
  )
}

export default Component
