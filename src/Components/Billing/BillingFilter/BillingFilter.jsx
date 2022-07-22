import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import FilterPaymentsModal from './FilterPaymentsModal'
import FilterExpensesModal from './FilterExpensesModal'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Button, IconButton, Portal, ModalCreatePayment } from '../..'
import { useMediaQuery } from 'react-responsive'
import {
  actions,
  billingActions,
  billingOperations,
  billingSelectors,
} from '../../../Redux'
import s from './BillingFilter.module.scss'

export default function Component(props) {
  const { setCurrentPage, setIsFiltered, isFilterActive, isFiltered } = props

  const { t } = useTranslation(['billing', 'other'])
  const dispatch = useDispatch()

  const mobile = useMediaQuery({ query: '(max-width: 767px)' })

  const paymentsCount = useSelector(billingSelectors.getPaymentsCount)
  const expensesCount = useSelector(billingSelectors.getExpensesCount)
  const params = useParams()

  useEffect(() => {
    params?.path === 'payments'
      ? resetFilterPaymentsHandler()
      : resetFilterExpensesHandler()
  }, [])

  const [filterModal, setFilterModal] = useState(false)
  const [createPaymentModal, setCreatePaymentModal] = useState(false)

  useEffect(() => {
    if (filterModal) {
      dispatch(actions.disableScrolling())
    } else {
      dispatch(actions.enableScrolling())
    }
  }, [filterModal])

  const downloadPaymentsCsvHandler = count => {
    dispatch(billingOperations.getPaymentCsv(count))
  }

  const downloadExpensesCsvHandler = count => {
    dispatch(billingOperations.getExpensesCsv(count))
  }

  const filterPaymentsHandler = values => {
    setCurrentPage(1)
    setFilterModal(false)
    setIsFiltered && setIsFiltered(true)

    values.saamount_from = values.sum
    values.saamount_to = values.sum
    dispatch(billingOperations.setPaymentsFilters(values))
  }

  const resetFilterPaymentsHandler = () => {
    const clearField = {
      id: '',
      number: '',
      sender: '',
      sender_id: '',
      recipient: '',
      paymethod: '',
      status: '',
      createdate: 'nodate',
      createdatestart: '',
      createdateend: '',
      saamount_from: '',
      saamount_to: '',
    }
    setCurrentPage(1)
    setFilterModal(false)
    dispatch(billingActions.setPaymentsList(null))
    setIsFiltered && setIsFiltered(false)

    dispatch(billingOperations.setPaymentsFilters(clearField))
  }

  const filterExpensesHandler = values => {
    setCurrentPage(1)
    setFilterModal(false)
    setIsFiltered && setIsFiltered(true)
    dispatch(billingOperations.setExpensesFilters(values))
  }

  const resetFilterExpensesHandler = () => {
    const clearField = {
      id: '',
      locale_name: '',
      item: '',
      compare_type: 'null',
      amount: '',
      fromdate: '',
      todate: '',
    }
    setCurrentPage(1)
    setFilterModal(false)
    dispatch(billingActions.setExpensesList(null))
    setIsFiltered && setIsFiltered(false)

    dispatch(billingOperations.setExpensesFilters(clearField))
  }

  return (
    <div className={s.filterBlock}>
      <div className={s.formBlock}>
        <div className={s.filterBtnBlock}>
          <IconButton
            onClick={() => setFilterModal(true)}
            icon="filter"
            className={cn(s.calendarBtn, { [s.filtered]: isFiltered })}
            disabled={!isFilterActive}
          />
          {filterModal && (
            <div>
              <Portal>
                <div className={s.bg}>
                  {mobile &&
                    (params?.path === 'payments' ? (
                      <FilterPaymentsModal
                        resetFilterHandler={resetFilterPaymentsHandler}
                        filterHandler={filterPaymentsHandler}
                        filterModal={filterModal}
                        setFilterModal={setFilterModal}
                      />
                    ) : (
                      <FilterExpensesModal
                        resetFilterHandler={resetFilterExpensesHandler}
                        filterHandler={filterExpensesHandler}
                        filterModal={filterModal}
                        setFilterModal={setFilterModal}
                      />
                    ))}
                </div>
              </Portal>
              {!mobile &&
                (params?.path === 'payments' ? (
                  <FilterPaymentsModal
                    resetFilterHandler={resetFilterPaymentsHandler}
                    filterHandler={filterPaymentsHandler}
                    filterModal={filterModal}
                    setFilterModal={setFilterModal}
                  />
                ) : (
                  <FilterExpensesModal
                    resetFilterHandler={resetFilterExpensesHandler}
                    filterHandler={filterExpensesHandler}
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
        <>
          <Button
            className={s.newTicketBtn}
            isShadow
            size="medium"
            label={t('Create')}
            type="button"
            onClick={() => setCreatePaymentModal(!createPaymentModal)}
          />
          <Portal>
            {createPaymentModal && (
              <ModalCreatePayment setCreatePaymentModal={setCreatePaymentModal} />
            )}
          </Portal>
        </>
      )}
    </div>
  )
}

Component.propTypes = {
  selctedPayment: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.object]),
}

Component.defaultProps = {}
