import React from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, useParams } from 'react-router-dom'
import { Container, PageTabBar } from '../../Components/'
import * as route from '../../routes'
import { AboutAffiliateProgram, AffiliateProgramIncome } from '../'

import s from './AffiliateProgram.module.scss'

export default function AffiliateProgram() {
  const { t } = useTranslation('affiliate_program')
  const params = useParams()

  const renderPage = () => {
    switch (params.chapter) {
      case route.AFFILIATE_PROGRAM_ABOUT:
        return <AboutAffiliateProgram />

      case route.AFFILIATE_PROGRAM_INCOME:
        return <AffiliateProgramIncome />

      case route.AFFILIATE_PROGRAM_STATISTICS:
        return null

      default:
        return <Navigate to={route.AFFILIATE_PROGRAM_ABOUT} />
    }
  }

  const navBarSections = [
    { route: route.AFFILIATE_PROGRAM_ABOUT, label: t('about_section_title') },
    { route: route.AFFILIATE_PROGRAM_INCOME, label: t('income_section_title') },
    { route: route.AFFILIATE_PROGRAM_STATISTICS, label: t('statistics_section_title') },
  ]
  return (
    <Container>
      <h2 className={s.title}> {t('page_title')} </h2>
      <PageTabBar sections={navBarSections} />
      {renderPage()}
    </Container>
  )
}
