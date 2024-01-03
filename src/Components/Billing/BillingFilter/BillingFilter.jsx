import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import FilterPaymentsModal from './FilterPaymentsModal'
import FilterExpensesModal from './FilterExpensesModal'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Button, IconButton, Portal } from '@components'
import { useMediaQuery } from 'react-responsive'
import { actions, billingActions, billingOperations, billingSelectors } from '@redux'
import s from './BillingFilter.module.scss'

export default function Component(props) {
  const {
    setCurrentPage,
    setIsFiltered,
    isFilterActive,
    isFiltered,
    p_cnt,
    signal,
    setIsLoading,
  } = props

  const { t } = useTranslation(['billing', 'other'])
  const dispatch = useDispatch()

  const mobile = useMediaQuery({ query: '(max-width: 767px)' })

  const paymentsCount = useSelector(billingSelectors.getPaymentsCount)
  const expensesCount = useSelector(billingSelectors.getExpensesCount)
  const params = useParams()

  useEffect(() => {
    params?.path === 'payments'
      ? resetFilterPaymentsHandler(true)
      : resetFilterExpensesHandler(true)
  }, [])

  const [filterModal, setFilterModal] = useState(false)

  useEffect(() => {
    if (filterModal) {
      dispatch(actions.disableScrolling())
    } else {
      dispatch(actions.enableScrolling())
    }
  }, [filterModal])

  const downloadPaymentsCsvHandler = count => {
    dispatch(billingOperations.getPaymentCsv(count, signal, setIsLoading))
  }

  const downloadExpensesCsvHandler = count => {
    dispatch(billingOperations.getExpensesCsv(count, signal, setIsLoading))
  }

  const filterPaymentsHandler = values => {
    setCurrentPage(1)
    setFilterModal(false)
    setIsFiltered && setIsFiltered(true)

    values.saamount_from = values.sum
    values.saamount_to = values.sum
    values.p_cnt = p_cnt
    dispatch(billingOperations.setPaymentsFilters(values, false, signal, setIsLoading))
  }

  const resetFilterPaymentsHandler = (firstOpen = false) => {
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
      p_cnt: p_cnt,
    }
    if (!firstOpen) {
      setCurrentPage(1)
      setFilterModal(false)
    }
    dispatch(billingActions.setPaymentsList(null))
    setIsFiltered && setIsFiltered(false)

    dispatch(
      billingOperations.setPaymentsFilters(clearField, false, signal, setIsLoading),
    )
  }

  const filterExpensesHandler = values => {
    setCurrentPage(1)
    setFilterModal(false)
    values.p_cnt = p_cnt
    setIsFiltered && setIsFiltered(true)
    dispatch(billingOperations.setExpensesFilters(values, signal, setIsLoading))
  }

  const resetFilterExpensesHandler = (firstOpen = false) => {
    const clearField = {
      id: '',
      locale_name: '',
      item: '',
      compare_type: 'null',
      amount: '',
      fromdate: '',
      todate: '',
      p_cnt: p_cnt,
    }

    if (!firstOpen) {
      setCurrentPage(1)
      setFilterModal(false)
    }
    dispatch(billingActions.setExpensesList(null))
    setIsFiltered && setIsFiltered(false)

    dispatch(billingOperations.setExpensesFilters(clearField, signal, setIsLoading))
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
            onClick={() => dispatch(billingActions.setIsModalCreatePaymentOpened(true))}
          />
        </>
      )}
    </div>
  )
}

Component.propTypes = {
  selctedPayment: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.object]),
}

Component.defaultProps = {}
