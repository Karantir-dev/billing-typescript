import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import DomainFiltertsModal from '../DomainFiltertsModal/DomainFiltertsModal'
import { actions, domainsOperations, domainsSelectors } from '../../../../Redux'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { useDispatch, useSelector } from 'react-redux'
import { Button, IconButton, HintWrapper, Portal } from '../../..'
import * as routes from '../../../../routes'
import s from './DomainFilters.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['domains', 'other', 'vds'])
  const navigate = useNavigate()
  const mobile = useMediaQuery({ query: '(max-width: 767px)' })

  const {
    selctedItem,
    setCurrentPage,
    editDomainHandler,
    // deleteDomainHandler,
    renewDomainHandler,
    historyDomainHandler,
    whoisDomainHandler,
    NSDomainHandler,
    setIsFiltered,
    setSelctedItem,
    isFilterActive,
    isFiltered,
    rights,
  } = props

  const filters = useSelector(domainsSelectors.getDomainsFilters)
  const filtersList = useSelector(domainsSelectors.getDomainsFiltersList)

  const [filterModal, setFilterModal] = useState(false)

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
    setSelctedItem(null)
    setIsFiltered(false)
    dispatch(domainsOperations.getDomainsFilters({ ...clearField, sok: 'ok' }, true))
  }

  const setFilterHandler = values => {
    setCurrentPage(1)
    setIsFiltered(true)
    setSelctedItem(null)
    setFilterModal(false)
    dispatch(domainsOperations.getDomainsFilters({ ...values, sok: 'ok' }, true))
  }

  return (
    <div className={s.filterBlock}>
      <div className={s.formBlock}>
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
            onClick={() => navigate(routes.DOMAINS_TRANSFER_ORDERS)}
            icon="transfer"
          />
        </HintWrapper>

        <HintWrapper wrapperClassName={s.archiveBtn} label={t('edit', { ns: 'other' })}>
          <IconButton
            disabled={!selctedItem || !rights?.edit}
            onClick={editDomainHandler}
            icon="edit"
          />
        </HintWrapper>

        {/* <HintWrapper wrapperClassName={s.archiveBtn} label={t('delete', { ns: 'other' })}>
          <IconButton
            disabled={!selctedItem || selctedItem?.item_status?.$orig === '5_transfer'}
            onClick={deleteDomainHandler}
            icon="delete"
          />
        </HintWrapper> */}

        <HintWrapper wrapperClassName={s.archiveBtn} label={t('prolong', { ns: 'vds' })}>
          <IconButton
            disabled={
              !selctedItem || selctedItem?.item_status?.$orig === '1' || !rights?.prolong
            }
            onClick={renewDomainHandler}
            icon="clock"
          />
        </HintWrapper>

        <HintWrapper wrapperClassName={s.archiveBtn} label={t('history', { ns: 'vds' })}>
          <IconButton
            disabled={!selctedItem || !rights?.history}
            onClick={historyDomainHandler}
            icon="refund"
          />
        </HintWrapper>

        <HintWrapper
          wrapperClassName={s.archiveBtn}
          label={t('Getting information about a domain using the whois protocol')}
        >
          <IconButton
            disabled={!selctedItem || !rights?.whois}
            onClick={whoisDomainHandler}
            icon="whois"
          />
        </HintWrapper>

        <HintWrapper
          wrapperClassName={s.archiveBtn}
          label={t('View/change the list of nameservers')}
        >
          <IconButton
            disabled={!selctedItem || !rights?.ns}
            onClick={NSDomainHandler}
            icon="server-cloud"
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
