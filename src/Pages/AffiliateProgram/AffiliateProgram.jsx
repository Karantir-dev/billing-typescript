import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, Route, Routes } from 'react-router-dom'
import { usersOperations } from '@redux'
import { useDispatch } from 'react-redux'
import { PageTabBar, PageTitleRender } from '@components'
import * as route from '@src/routes'
import {
  AboutAffiliateProgram,
  AffiliateProgramIncome,
  AffiliateProgramStatistics,
} from '@pages'
import { usePageRender } from '@utils'

import s from './AffiliateProgram.module.scss'

export default function AffiliateProgram() {
  const isComponentAllowedToRender = usePageRender('customer', 'affiliate.client')

  if (!isComponentAllowedToRender) {
    return <Navigate replace to={route.SERVICES} />
  }

  const { t } = useTranslation('affiliate_program')
  const dispatch = useDispatch()

  const [availableRights, setAvailabelRights] = useState({})

  useEffect(() => {
    if (isComponentAllowedToRender) {
      dispatch(usersOperations.getAvailableRights('affiliate.client', setAvailabelRights))
    }
  }, [])

  const rightsArr = availableRights?.toolbar?.toolgrp

  const isStatisticsAllowedToRender = Array.isArray(rightsArr)
    ? rightsArr[0]?.toolbtn?.some(el => el?.$name === 'click')
    : false

  const isIncomesAllowedToRender = Array.isArray(rightsArr)
    ? rightsArr[0]?.toolbtn?.some(el => el?.$name === 'reward')
    : false

  const navBarSections = [
    {
      route: route.AFFILIATE_PROGRAM_ABOUT,
      label: t('about_section_title'),
      allowToRender: true,
    },
    {
      route: route.AFFILIATE_PROGRAM_INCOME,
      label: t('income_section_title'),
      allowToRender: isIncomesAllowedToRender,
    },
    {
      route: route.AFFILIATE_PROGRAM_STATISTICS,
      label: t('statistics_section_title'),
      allowToRender: isStatisticsAllowedToRender,
    },
  ]

  return (
    <>
      <h2 className={s.title}>{t('page_title')}</h2>
      <PageTabBar sections={navBarSections} />

      <Routes>
        <Route
          path={route.AFFILIATE_PROGRAM_ABOUT}
          element={
            <PageTitleRender title={t('page_title') + '/' + t('about_section_title')}>
              <AboutAffiliateProgram />
            </PageTitleRender>
          }
        />
        <Route
          path={'/'}
          element={<Navigate replace to={route.AFFILIATE_PROGRAM_ABOUT} />}
        />
        {isIncomesAllowedToRender && (
          <Route
            path={route.AFFILIATE_PROGRAM_INCOME}
            element={
              <PageTitleRender title={t('page_title') + '/' + t('income_section_title')}>
                <AffiliateProgramIncome />
              </PageTitleRender>
            }
          />
        )}
        {isStatisticsAllowedToRender && (
          <Route
            path={route.AFFILIATE_PROGRAM_STATISTICS}
            element={
              <PageTitleRender
                title={t('page_title') + '/' + t('statistics_section_title')}
              >
                <AffiliateProgramStatistics />
              </PageTitleRender>
            }
          />
        )}
      </Routes>
    </>
  )
}
