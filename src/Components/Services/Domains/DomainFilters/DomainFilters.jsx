import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { actions, domainsOperations, domainsSelectors } from '@redux'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { useDispatch, useSelector } from 'react-redux'
import {
  Button,
  IconButton,
  HintWrapper,
  Portal,
  CheckBox,
  DomainFiltertsModal,
} from '@components'
import * as routes from '@src/routes'
import s from './DomainFilters.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['domains', 'other', 'vds'])
  const navigate = useNavigate()
  const mobile = useMediaQuery({ query: '(max-width: 767px)' })

  const {
    selctedItem,
    list,
    setCurrentPage,
    setIsFiltered,
    setSelctedItem,
    isFilterActive,
    isFiltered,
    rights,
    p_cnt,
    signal,
    setIsLoading
  } = props

  const filters = useSelector(domainsSelectors.getDomainsFilters)
  const filtersList = useSelector(domainsSelectors.getDomainsFiltersList)

  const [filterModal, setFilterModal] = useState(false)

  const setSelectedAll = val => {
    if (val) {
      setSelctedItem(list)
      return
    }
    setSelctedItem([])
  }

  useEffect(() => {
    if (filterModal) {
      dispatch(actions.disableScrolling())
    } else {
      dispatch(actions.enableScrolling())
    }
  }, [filterModal])

  const dispatch = useDispatch()

  useEffect(() => {
    resetFilterHandler()
  }, [])

  const resetFilterHandler = () => {
    const clearField = {
      id: '',
      domain: '',
      pricelist: '',
      period: '',
      status: '',
      service_status: '',
      opendate: '',
      expiredate: '',
      orderdatefrom: '',
      orderdateto: '',
      cost_from: '',
      cost_to: '',
      autoprolong: '',
    }
    setCurrentPage(1)
    setFilterModal(false)
    setSelctedItem([])
    setIsFiltered(false)
    dispatch(
      domainsOperations.getDomainsFilters({ ...clearField, sok: 'ok', p_cnt }, true, signal, setIsLoading),
    )
  }

  const setFilterHandler = values => {
    setCurrentPage(1)
    setIsFiltered(true)
    setSelctedItem([])
    setFilterModal(false)
    dispatch(domainsOperations.getDomainsFilters({ ...values, sok: 'ok', p_cnt }, true, signal, setIsLoading))
  }

  const isAllActive = list?.length === selctedItem?.length
  const toggleIsActiveHandler = () => setSelectedAll(!isAllActive)

  return (
    <div className={s.filterBlock}>
      <div className={s.formBlock}>
        <div className={s.checkBoxColumn}>
          <CheckBox
            className={s.check_box}
            value={isAllActive}
            onClick={toggleIsActiveHandler}
          />
          <span>{t('Choose all', { ns: 'other' })}</span>
        </div>
        <div className={s.filterBtnBlock}>
          <IconButton
            onClick={() => setFilterModal(true)}
            icon="filter"
            className={cn(s.calendarBtn, { [s.filtered]: isFiltered })}
            disabled={!isFilterActive || !rights?.filter}
          />
          {filterModal && (
            <div>
              <Portal>
                <div className={s.bg}>
                  {mobile && (
                    <DomainFiltertsModal
                      filterModal={filterModal}
                      setFilterModal={setFilterModal}
                      filters={filters}
                      filtersList={filtersList}
                      resetFilterHandler={resetFilterHandler}
                      setFilterHandler={setFilterHandler}
                    />
                  )}
                </div>
              </Portal>
              {!mobile && (
                <DomainFiltertsModal
                  filterModal={filterModal}
                  setFilterModal={setFilterModal}
                  filters={filters}
                  filtersList={filtersList}
                  resetFilterHandler={resetFilterHandler}
                  setFilterHandler={setFilterHandler}
                />
              )}
            </div>
          )}
        </div>
        <HintWrapper wrapperClassName={s.transferBtn} label={t('Transfer')}>
          <IconButton
            disabled={!rights?.transfer}
            onClick={() =>
              navigate(routes.DOMAINS_TRANSFER_ORDERS, {
                state: { isDomainsOrderAllowed: rights?.transfer },
                replace: true,
              })
            }
            icon="transfer"
          />
        </HintWrapper>
      </div>
      <Button
        disabled={!rights?.register}
        dataTestid={'new_ticket_btn'}
        className={s.newTicketBtn}
        isShadow
        size="medium"
        label={t('New domain')}
        type="button"
        onClick={() => {
          navigate(routes.DOMAINS_ORDERS, {
            state: { isDomainsOrderAllowed: rights?.register },
            replace: true,
          })
        }}
      />
    </div>
  )
}

Component.propTypes = {
  selctedTicket: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.object]),
  rights: PropTypes.object,
}

Component.defaultProps = {
  selctedTicket: null,
}
