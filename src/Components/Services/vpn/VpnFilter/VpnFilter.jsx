import { useEffect, useState } from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import { IconButton, Portal, CheckBox, VpnFiltertsModal } from '@components'
import { actions, vpnOperations, vpnSelectors } from '@redux'
import s from './VpnFilter.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['domains', 'other', 'vds'])
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
    signal,
    setIsLoading,
  } = props

  const [filterModal, setFilterModal] = useState(false)

  useEffect(() => {
    if (filterModal) {
      dispatch(actions.disableScrolling())
    } else {
      dispatch(actions.enableScrolling())
    }
  }, [filterModal])

  const filters = useSelector(vpnSelectors.getVpnFilters)
  const filtersList = useSelector(vpnSelectors.getVpnFiltersList)

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
      vpnOperations.getSiteCareFilters(
        { ...clearField, sok: 'ok', p_cnt },
        true,
        signal,
        setIsLoading,
      ),
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
    dispatch(
      vpnOperations.getSiteCareFilters(
        { ...values, sok: 'ok', p_cnt },
        true,
        signal,
        setIsLoading,
      ),
    )
  }

  const isAllActive = list?.length && list?.length === selctedItem?.length
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
                    <VpnFiltertsModal
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
                <VpnFiltertsModal
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
      {/* <Button
        disabled={!rights?.new}
        className={s.newTicketBtn}
        isShadow
        size="medium"
        label={t('to_order', { ns: 'other' })}
        type="button"
        onClick={() => {
          navigate(routes.VPN_ORDER, {
            state: { isSiteCareOrderAllowed: rights?.new },
            replace: true,
          })
        }}
      /> */}
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
