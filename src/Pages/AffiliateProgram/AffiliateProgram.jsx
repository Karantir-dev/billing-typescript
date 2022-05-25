import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, Route, Routes } from 'react-router-dom'
import { usersOperations } from '../../Redux'
import { useDispatch } from 'react-redux'
import { PageTabBar } from '../../Components/'
import * as route from '../../routes'
import {
  AboutAffiliateProgram,
  AffiliateProgramIncome,
  AffiliateProgramStatistics,
} from '../'

import s from './AffiliateProgram.module.scss'
import { usePageRender } from '../../utils'

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
  const checkIfHasArr = availableRights?.toolbar?.toolgrp

  const isStatisticsAllowedToRender = Array.isArray(checkIfHasArr)
    ? availableRights?.toolbar?.toolgrp[0]?.toolbtn?.some(el => el?.$name === 'click')
    : false

  const isIncomesAllowedToRender = Array.isArray(checkIfHasArr)
    ? availableRights?.toolbar?.toolgrp[0]?.toolbtn?.some(el => el?.$name === 'reward')
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
        <Route path={route.AFFILIATE_PROGRAM_ABOUT} element={<AboutAffiliateProgram />} />
        <Route
          path={'/'}
          element={<Navigate replace to={route.AFFILIATE_PROGRAM_ABOUT} />}
        />
        <Route
          path={route.AFFILIATE_PROGRAM_INCOME}
          element={<AffiliateProgramIncome allowToRender={isIncomesAllowedToRender} />}
        />
        <Route
          path={route.AFFILIATE_PROGRAM_STATISTICS}
          element={
            <AffiliateProgramStatistics allowToRender={isStatisticsAllowedToRender} />
          }
        />
      </Routes>
    </>
  )
}
