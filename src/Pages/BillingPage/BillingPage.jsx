import { useTranslation } from 'react-i18next'
import { Navigate, useParams } from 'react-router-dom'
import {
  PageTabBar,
  Portal,
  SuccessPayment,
  ErrorPayment,
  PageTitleRender,
} from '@components'
import Payments from './Payments/Payments'
import Expenses from './Expenses/Expenses'
import PaymentMethod from './PaymentMethod/PaymentMethod'
import AutoPayment from './AutoPayment/AutoPayment'
import s from './BillingPage.module.scss'
import * as route from '@src/routes'
import { usePageRender } from '@utils'
import ErrorPage from '../ErrorPage/ErrorPage'

export default function Component() {
  const { t } = useTranslation(['billing', 'other'])
  const params = useParams()

  const isExpensesComponentAllowedToRender = usePageRender('finance', 'expense')
  const isPaymentsComponentAllowedToRender = usePageRender('finance', 'payment')
  const isAutoPaymentComponentAllowedToRender = usePageRender(
    'finance',
    'payment.recurring.settings',
  )

  const isPaymentMethodComponentAllowedToRender = usePageRender(
    'finance',
    'payment.recurring.stored_methods',
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
    {
      route: `${route.BILLING}/payment_method`,
      label: t('Payment method'),
      allowToRender: isPaymentMethodComponentAllowedToRender,
    },
  ]

  if (
    !isPaymentsComponentAllowedToRender &&
    !isExpensesComponentAllowedToRender &&
    !isAutoPaymentComponentAllowedToRender
  ) {
    return <Navigate replace to={route.HOME} />
  }

  const renderPage = path => {
    if (path === 'payments' && isPaymentsComponentAllowedToRender) {
      return (
        <PageTitleRender title={t('Finance') + '/' + t('Payments')}>
          <Payments />
        </PageTitleRender>
      )
    } else if (path === 'expenses' && isExpensesComponentAllowedToRender) {
      return (
        <PageTitleRender title={t('Finance') + '/' + t('Expenses')}>
          <Expenses />
        </PageTitleRender>
      )
    } else if (path === 'auto_payment' && isAutoPaymentComponentAllowedToRender) {
      return (
        <PageTitleRender title={t('Finance') + '/' + t('Auto payment')}>
          <AutoPayment />
        </PageTitleRender>
      )
    } else if (path === 'payment_method' && isPaymentMethodComponentAllowedToRender) {
      return (
        <PageTitleRender title={t('Finance') + '/' + t('Payment method')}>
          <PaymentMethod />
        </PageTitleRender>
      )
    } else {
      return <ErrorPage />
    }
  }

  if (params.result && !(params?.result === 'success' || params?.result === 'error')) {
    return <ErrorPage />
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
