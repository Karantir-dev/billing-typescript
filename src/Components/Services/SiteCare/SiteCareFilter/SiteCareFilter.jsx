import { useEffect, useState } from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { useMediaQuery } from 'react-responsive'

import { Button, IconButton, Portal, CheckBox } from '../../..'
import SiteCareFiltertsModal from '../SiteCareFiltertsModal/SiteCareFiltertsModal'
import * as routes from '../../../../routes'
import s from './SiteCareFilter.module.scss'
import { actions, siteCareOperations, siteCareSelectors } from '../../../../Redux'

export default function Component(props) {
  const { t } = useTranslation(['domains', 'other', 'vds'])
  const navigate = useNavigate()
  const mobile = useMediaQuery({ query: '(max-width: 767px)' })

  const {
    setCurrentPage,
    setIsFiltered,
    setSelctedItem,
    isFilterActive,
    isFiltered,
    rights,
    p_cnt,

    list,
    selctedItem,
  } = props

  const [filterModal, setFilterModal] = useState(false)

  useEffect(() => {
    if (filterModal) {
      dispatch(actions.disableScrolling())
    } else {
      dispatch(actions.enableScrolling())
    }
  }, [filterModal])

  const filters = useSelector(siteCareSelectors.getSiteCareFilters)
  const filtersList = useSelector(siteCareSelectors.getSiteCareFiltersList)

  const dispatch = useDispatch()

  const setSelectedAll = val => {
    if (val) {
      setSelctedItem(list)
      return
    }
    setSelctedItem([])
  }

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
    setIsFiltered(false)
    setSelctedItem([])
    setCurrentPage(1)
    setFilterModal(false)
    dispatch(
      siteCareOperations.getSiteCareFilters({ ...clearField, sok: 'ok', p_cnt }, true),
    )
  }

  useEffect(() => {
    resetFilterHandler()
  }, [])

  const setFilterHandler = values => {
    setCurrentPage(1)
    setFilterModal(false)
    setIsFiltered(true)
    setSelctedItem([])
    dispatch(siteCareOperations.getSiteCareFilters({ ...values, sok: 'ok', p_cnt }, true))
  }

  const isAllActive = list?.length === selctedItem?.length
  const toggleIsAllActiveHandler = () => setSelectedAll(!isAllActive)

  return (
    <div className={s.filterBlock}>
      <div className={s.formBlock}>
        <div className={s.checkBoxColumn}>
          <CheckBox
            className={s.check_box}
            value={isAllActive}
            onClick={toggleIsAllActiveHandler}
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
                    <SiteCareFiltertsModal
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
                <SiteCareFiltertsModal
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

        {/* <HintWrapper wrapperClassName={s.archiveBtn} label={t('edit', { ns: 'other' })}>
          <IconButton
            disabled={!selctedItem || !rights?.edit}
            onClick={editSiteCareHandler}
            icon="edit"
          />
        </HintWrapper>

        <HintWrapper wrapperClassName={s.archiveBtn} label={t('prolong', { ns: 'vds' })}>
          <IconButton
            disabled={
              !selctedItem || selctedItem?.item_status?.$orig === '1' || !rights?.prolong
            }
            onClick={prolongSiteCareHandler}
            icon="clock"
          />
        </HintWrapper>

        <HintWrapper wrapperClassName={s.archiveBtn} label={t('history', { ns: 'vds' })}>
          <IconButton
            disabled={!selctedItem || !rights?.history}
            onClick={historySiteCareHandler}
            icon="refund"
          />
        </HintWrapper>

        <HintWrapper wrapperClassName={s.archiveBtn} label={t('delete', { ns: 'other' })}>
          <IconButton
            disabled={
              !selctedItem ||
              selctedItem?.item_status?.$orig === '5_open' ||
              !rights?.delete
            }
            onClick={deleteSiteCareHandler}
            icon="delete"
          />
        </HintWrapper> */}
      </div>
      <Button
        disabled={!rights?.new}
        className={s.newTicketBtn}
        isShadow
        size="medium"
        label={t('to_order', { ns: 'other' })}
        type="button"
        onClick={() => {
          navigate(routes.SITE_CARE_ORDER, {
            state: { isSiteCareOrderAllowed: rights?.new },
            replace: true,
          })
        }}
        // onClick={() => navigate(routes.SITE_CARE_ORDER)}
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
