import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import {
  Button,
  CheckBox,
  IconButton,
  Portal,
  SharedHostingFilterModal,
} from '@components'
import * as routes from '@src/routes'
import s from './SharedHostingFilter.module.scss'
import { actions, vhostOperations, vhostSelectors } from '@redux'

export default function Component(props) {
  const { t } = useTranslation(['domains', 'other', 'vds'])
  const navigate = useNavigate()
  const mobile = useMediaQuery({ query: '(max-width: 767px)' })
  const widerThan1600 = useMediaQuery({ query: '(min-width: 1600px)' })

  const {
    setCurrentPage,
    hostingList,
    activeServices,
    setActiveServices,
    setIsFiltered,
    setSelctedItem,
    isFilterActive,
    isFiltered,
    rights,
  } = props

  const [filterModal, setFilterModal] = useState(false)

  useEffect(() => {
    if (filterModal) {
      dispatch(actions.disableScrolling())
    } else {
      dispatch(actions.enableScrolling())
    }
  }, [filterModal])

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
    setActiveServices([])
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
    setActiveServices([])
    dispatch(vhostOperations.getVhostFilters({ ...values, sok: 'ok' }, true))
  }

  const isAllActive = activeServices?.length === hostingList?.length
  const toggleIsAllActiveHandler = () => {
    isAllActive ? setActiveServices([]) : setActiveServices(hostingList)
  }

  return (
    <div className={s.filterBlock}>
      <div className={s.formBlock}>
        {!widerThan1600 && hostingList?.length > 0 && (
          <div className={s.check_box_wrapper}>
            <div className={s.main_checkbox}>
              <CheckBox
                className={s.check_box}
                value={isAllActive}
                onClick={toggleIsAllActiveHandler}
              />
              <span>{t('Choose all', { ns: 'other' })}</span>
            </div>
          </div>
        )}
        <div className={s.btns_wrapper}>
          <Button
            disabled={!rights?.new}
            className={s.newTicketBtn}
            isShadow
            size="medium"
            label={t('to_order', { ns: 'other' })}
            type="button"
            onClick={() => {
              navigate(routes.SHARED_HOSTING_ORDER, {
                state: { isVhostOrderAllowed: rights?.new },
                replace: true,
              })
            }}
          />

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
        </div>
      </div>
    </div>
  )
}

Component.propTypes = {
  selctedTicket: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.object]),
  rights: PropTypes.object,
  hostingList: PropTypes.array,
  activeServices: PropTypes.array,
  setActiveServices: PropTypes.func,
  setIsFiltered: PropTypes.func,
  setSelctedItem: PropTypes.func,
  isFilterActive: PropTypes.bool,
  isFiltered: PropTypes.bool,
}

Component.defaultProps = {
  selctedTicket: null,
}
