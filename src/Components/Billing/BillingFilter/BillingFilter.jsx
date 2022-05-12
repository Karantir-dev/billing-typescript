import React, { useState } from 'react'
import PropTypes from 'prop-types'
import FilterPaymentsModal from './FilterPaymentsModal'
import FilterExpensesModal from './FilterExpensesModal'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Button, IconButton, Portal } from '../..'
import { useMediaQuery } from 'react-responsive'
import { billingOperations, billingSelectors } from '../../../Redux'
import s from './BillingFilter.module.scss'

export default function Component(props) {
  const { setCurrentPage } = props

  const { t } = useTranslation(['billing', 'other'])
  const dispatch = useDispatch()

  const mobile = useMediaQuery({ query: '(max-width: 767px)' })

  const paymentsCount = useSelector(billingSelectors.getPaymentsCount)
  const expensesCount = useSelector(billingSelectors.getExpensesCount)
  const params = useParams()

  const [filterModal, setFilterModal] = useState(false)

  const downloadPaymentsCsvHandler = count => {
    dispatch(billingOperations.getPaymentCsv(count))
  }

  const downloadExpensesCsvHandler = count => {
    dispatch(billingOperations.getExpensesCsv(count))
  }

  return (
    <div className={s.filterBlock}>
      <div className={s.formBlock}>
        <div className={s.filterBtnBlock}>
          <IconButton
            onClick={() => setFilterModal(true)}
            icon="filter"
            className={s.calendarBtn}
          />
          {filterModal && (
            <div>
              <Portal>
                <div className={s.bg}>
                  {mobile &&
                    (params?.path === 'payments' ? (
                      <FilterPaymentsModal
                        setCurrentPage={setCurrentPage}
                        filterModal={filterModal}
                        setFilterModal={setFilterModal}
                      />
                    ) : (
                      <FilterExpensesModal
                        setCurrentPage={setCurrentPage}
                        filterModal={filterModal}
                        setFilterModal={setFilterModal}
                      />
                    ))}
                </div>
              </Portal>
              {!mobile &&
                (params?.path === 'payments' ? (
                  <FilterPaymentsModal
                    setCurrentPage={setCurrentPage}
                    filterModal={filterModal}
                    setFilterModal={setFilterModal}
                  />
                ) : (
                  <FilterExpensesModal
                    setCurrentPage={setCurrentPage}
                    filterModal={filterModal}
                    setFilterModal={setFilterModal}
                  />
                ))}
            </div>
          )}
        </div>
        <IconButton
          onClick={() =>
            params?.path === 'payments'
              ? downloadPaymentsCsvHandler(paymentsCount)
              : downloadExpensesCsvHandler(expensesCount)
          }
          icon="csv"
          className={s.archiveBtn}
        />
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
