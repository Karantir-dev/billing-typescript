import React from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, useParams } from 'react-router-dom'
import { PageTabBar, Portal, SuccessPayment, ErrorPayment } from '../../Components/'
import Payments from './Payments/Payments'
import Expenses from './Expenses/Expenses'
import AutoPayment from './AutoPayment/AutoPayment'
import s from './BillingPgae.module.scss'

import * as route from '../../routes'
import { usePageRender } from '../../utils'

export default function Component() {
  const { t } = useTranslation(['billing', 'other'])
  const params = useParams()

  const isExpensesComponentAllowedToRender = usePageRender('finance', 'expense')
  const isPaymentsComponentAllowedToRender = usePageRender('finance', 'payment')
  const isAutoPaymentComponentAllowedToRender = usePageRender(
    'finance',
    'payment.recurring.settings',
  )

  const tavBarSections = [
    {
      route: `${route.BILLING}/payments`,
      label: t('Payments'),
      allowToRender: isPaymentsComponentAllowedToRender,
    },
    {
      route: `${route.BILLING}/expenses`,
      label: t('Expenses'),
      allowToRender: isExpensesComponentAllowedToRender,
    },
    {
      route: `${route.BILLING}/auto_payment`,
      label: t('Auto payment'),
      allowToRender: isAutoPaymentComponentAllowedToRender,
    },
  ]

  if (
    !isPaymentsComponentAllowedToRender &&
    !isExpensesComponentAllowedToRender &&
    !isAutoPaymentComponentAllowedToRender
  ) {
    return <Navigate to={route.HOME} />
  }

  const renderPage = path => {
    if (path === 'payments' && isPaymentsComponentAllowedToRender) {
      return <Payments />
    } else if (path === 'expenses' && isExpensesComponentAllowedToRender) {
      return <Expenses />
    } else if (path === 'auto_payment' && isAutoPaymentComponentAllowedToRender) {
      return <AutoPayment />
    } else {
      return <Navigate to={route.HOME} />
    }
  }

  return (
    <>
      <div className={s.body}>
        <h1 className={s.pageTitle}>{t('Finance')}</h1>
        <PageTabBar sections={tavBarSections} />
        <div className={s.content}>{renderPage(params?.path)}</div>
        {params?.result && (
          <Portal>
            {params?.result === 'success' && <SuccessPayment />}{' '}
            {params?.result === 'error' && <ErrorPayment />}
          </Portal>
        )}
      </div>
    </>
  )
}
