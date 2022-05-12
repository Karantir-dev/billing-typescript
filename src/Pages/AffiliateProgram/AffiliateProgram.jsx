import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { userSelectors, usersOperations } from '../../Redux'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { PageTabBar } from '../../Components/'
import * as route from '../../routes'
import {
  AboutAffiliateProgram,
  AffiliateProgramIncome,
  AffiliateProgramStatistics,
} from '../'

import checkIfComponentShouldRender from '../../checkIfComponentShouldRender'

import s from './AffiliateProgram.module.scss'

export default function AffiliateProgram() {
  const { t } = useTranslation(['affiliate_program', 'trusted_users'])
  const location = useLocation()
  const navigate = useNavigate()

  const [availableRights, setAvailabelRights] = useState({})

  const checkIfHasArr = availableRights?.toolbar?.toolgrp
  console.log(checkIfHasArr)

  const isStatisticsAllowedToRender = Array.isArray(checkIfHasArr)
    ? availableRights?.toolbar?.toolgrp[0]?.toolbtn?.some(el => el?.$name === 'click')
    : false

  const isIncomesAllowedToRender = Array.isArray(checkIfHasArr)
    ? availableRights?.toolbar?.toolgrp[0]?.toolbtn?.some(el => el?.$name === 'reward')
    : false

  const currentSessionRights = useSelector(userSelectors.getCurrentSessionRights)
  const isComponentAllowedToRender = checkIfComponentShouldRender(
    currentSessionRights,
    'customer',
    'affiliate.client',
  )

  const dispatch = useDispatch()

  useEffect(() => {
    if (location.pathname === route.AFFILIATE_PROGRAM) {
      navigate(route.AFFILIATE_PROGRAM_ABOUT, { replace: true })
    }
  }, [])

  useEffect(() => {
    if (!isComponentAllowedToRender) {
      toast.error(t('insufficient_rights', { ns: 'trusted_users' }), {
        position: 'bottom-right',
      })
    }
  }, [])

  useEffect(() => {
    dispatch(usersOperations.getAvailableRights('affiliate.client', setAvailabelRights))
  }, [])

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

  if (!isComponentAllowedToRender) {
    return <Navigate to={route.HOME} />
  }

  return (
    <>
      <h2 className={s.title}>{t('page_title')}</h2>
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
          element={<AffiliateProgramStatistics />}
        ></Route>
      </Routes>
    </>
  )
}
