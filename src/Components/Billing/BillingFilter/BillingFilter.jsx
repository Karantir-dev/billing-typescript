import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Button, IconButton } from '../..'
import { billingOperations, billingSelectors } from '../../../Redux'
import s from './BillingFilter.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['billing', 'other'])
  const dispatch = useDispatch()
  const paymentsCount = useSelector(billingSelectors.getPaymentsCount)
  const params = useParams()

  const { selctedPayment, downloadPdfHandler } = props

  const downloadCsvHandler = count => {
    dispatch(billingOperations.getPaymentCsv(count))
  }

  return (
    <div className={s.filterBlock}>
      <div className={s.formBlock}>
        <div className={s.filterBtnBlock}>
          <IconButton onClick={() => null} icon="filter" className={s.calendarBtn} />
        </div>
        <IconButton
          onClick={() => downloadCsvHandler(paymentsCount)}
          icon="csv"
          className={s.archiveBtn}
        />
        {params?.path === 'payments' && (
          <IconButton
            disabled={!selctedPayment}
            onClick={() =>
              downloadPdfHandler(selctedPayment?.id?.$, selctedPayment?.number?.$)
            }
            icon="pdf"
            className={s.archiveBtn}
          />
        )}
      </div>
      {params?.path === 'payments' && (
        <Button
          className={s.newTicketBtn}
          isShadow
          size="medium"
          label={t('Create')}
          type="button"
          onClick={() => null}
        />
      )}
    </div>
  )
}

Component.propTypes = {
  selctedPayment: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.object]),
}

Component.defaultProps = {}
