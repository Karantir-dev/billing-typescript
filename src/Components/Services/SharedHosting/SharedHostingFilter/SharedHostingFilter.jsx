import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { useMediaQuery } from 'react-responsive'

import { Button, IconButton, HintWrapper, Portal } from '../../..'
import SharedHostingFilterModal from '../SharedHostingFilterModal/SharedHostingFilterModal'
import * as routes from '../../../../routes'
import s from './SharedHostingFilter.module.scss'
import { vhostOperations, vhostSelectors } from '../../../../Redux'

export default function Component(props) {
  const { t } = useTranslation(['domains', 'other', 'vds'])
  const navigate = useNavigate()
  const mobile = useMediaQuery({ query: '(max-width: 767px)' })

  const {
    selctedItem,
    setCurrentPage,
    historyVhostHandler,
    instructionVhostHandler,
    platformVhostHandler,
    prolongVhostHandler,
    editVhostHandler,
    changeTariffVhostHandler,
    setIsFiltered,
    setSelctedItem,
    isFilterActive,
  } = props

  const [filterModal, setFilterModal] = useState(false)

  const filters = useSelector(vhostSelectors.getVhostFilters)
  const filtersList = useSelector(vhostSelectors.getVhostFiltersList)

  const dispatch = useDispatch()

  const resetFilterHandler = () => {
    const clearField = {
      id: '',
      ip: '',
      datacenter: '',
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
    setIsFiltered(false)
    setSelctedItem(null)
    dispatch(vhostOperations.getVhostFilters({ ...clearField, sok: 'ok' }, true))
  }

  useEffect(() => {
    resetFilterHandler()
  }, [])

  const setFilterHandler = values => {
    setCurrentPage(1)
    setFilterModal(false)
    setIsFiltered(true)
    setSelctedItem(null)
    dispatch(vhostOperations.getVhostFilters({ ...values, sok: 'ok' }, true))
  }

  return (
    <div className={s.filterBlock}>
      <div className={s.formBlock}>
        <div className={s.filterBtnBlock}>
          <IconButton
            onClick={() => setFilterModal(true)}
            icon="filter"
            className={s.calendarBtn}
            disabled={!isFilterActive}
          />
          {filterModal && (
            <div>
              <Portal>
                <div className={s.bg}>
                  {mobile && (
                    <SharedHostingFilterModal
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
                <SharedHostingFilterModal
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

        <HintWrapper wrapperClassName={s.archiveBtn} label={t('edit', { ns: 'other' })}>
          <IconButton disabled={!selctedItem} onClick={editVhostHandler} icon="edit" />
        </HintWrapper>

        <HintWrapper
          wrapperClassName={s.archiveBtn}
          label={t('trusted_users.Change tariff', { ns: 'trusted_users' })}
        >
          <IconButton
            disabled={!selctedItem || selctedItem?.item_status?.$orig === '1'}
            onClick={changeTariffVhostHandler}
            icon="change-tariff"
          />
        </HintWrapper>

        <HintWrapper wrapperClassName={s.archiveBtn} label={t('prolong', { ns: 'vds' })}>
          <IconButton
            disabled={!selctedItem || selctedItem?.item_status?.$orig === '1'}
            onClick={prolongVhostHandler}
            icon="clock"
          />
        </HintWrapper>

        <HintWrapper wrapperClassName={s.archiveBtn} label={t('history', { ns: 'vds' })}>
          <IconButton
            disabled={!selctedItem}
            onClick={historyVhostHandler}
            icon="refund"
          />
        </HintWrapper>

        <HintWrapper
          wrapperClassName={s.archiveBtn}
          label={t('instruction', { ns: 'vds' })}
        >
          <IconButton
            onClick={instructionVhostHandler}
            className={s.tools_icon}
            disabled={!selctedItem || selctedItem?.item_status?.$orig === '1'}
            icon="info"
          />
        </HintWrapper>

        <HintWrapper
          wrapperClassName={s.archiveBtn}
          label={t('go_to_panel', { ns: 'vds' })}
        >
          <IconButton
            onClick={platformVhostHandler}
            className={s.tools_icon}
            disabled={!selctedItem || selctedItem?.item_status?.$orig === '1'}
            icon="exitSign"
          />
        </HintWrapper>
      </div>
      <Button
        className={s.newTicketBtn}
        isShadow
        size="medium"
        label={t('to_order', { ns: 'other' })}
        type="button"
        onClick={() => navigate(routes.SHARED_HOSTING_ORDER)}
      />
    </div>
  )
}

Component.propTypes = {
  selctedTicket: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.object]),
}

Component.defaultProps = {
  selctedTicket: null,
}
