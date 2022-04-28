import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Container, PageTabBar } from '../../Components/'
import * as route from '../../routes'
import { AboutAffiliateProgram, AffiliateProgramIncome } from '../'

import s from './AffiliateProgram.module.scss'

export default function AffiliateProgram() {
  const { t } = useTranslation('affiliate_program')
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.pathname === route.AFFILIATE_PROGRAM) {
      navigate(route.AFFILIATE_PROGRAM_ABOUT, { replace: true })
    }
  }, [])

  const navBarSections = [
    { route: route.AFFILIATE_PROGRAM_ABOUT, label: t('about_section_title') },
    { route: route.AFFILIATE_PROGRAM_INCOME, label: t('income_section_title') },
    { route: route.AFFILIATE_PROGRAM_STATISTICS, label: t('statistics_section_title') },
  ]
  return (
    <Container>
      <h2 className={s.title}> {t('page_title')} </h2>
      <PageTabBar sections={navBarSections} />

      <Routes>
        <Route
          path={route.AFFILIATE_PROGRAM_ABOUT}
          element={<AboutAffiliateProgram />}
        ></Route>
        <Route
          path={route.AFFILIATE_PROGRAM_INCOME}
          element={<AffiliateProgramIncome />}
        ></Route>
        <Route
          path={route.AFFILIATE_PROGRAM_STATISTICS}
          element={<AffiliateProgramIncome />}
        ></Route>
      </Routes>
    </Container>
  )
}
