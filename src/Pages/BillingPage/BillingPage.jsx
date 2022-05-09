import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { PageTabBar } from '../../Components/'
import Payments from './Payments/Payments'
import Expenses from './Expenses/Expenses'
import AutoPayment from './AutoPayment/AutoPayment'
import s from './BillingPgae.module.scss'

import * as route from '../../routes'

export default function Component() {
  const { t } = useTranslation(['billing', 'other'])
  const params = useParams()

  const tavBarSections = [
    { route: `${route.BILLING}/payments`, label: t('Payments') },
    { route: `${route.BILLING}/expenses`, label: t('Expenses') },
    { route: `${route.BILLING}/auto_payment`, label: t('Auto payment') },
  ]

  const renderPage = path => {
    if (path === 'payments') {
      return <Payments />
    } else if (path === 'expenses') {
      return <Expenses />
    } else if (path === 'auto_payment') {
      return <AutoPayment />
    }
  }

  return (
    <>
      <div className={s.body}>
        <h1 className={s.pageTitle}>{t('Finance')}</h1>
        <PageTabBar sections={tavBarSections} />
        <div className={s.content}>{renderPage(params?.path)}</div>
      </div>
    </>
  )
}
