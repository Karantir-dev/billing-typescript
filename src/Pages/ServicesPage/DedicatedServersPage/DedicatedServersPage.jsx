import { useEffect, useState } from 'react'
import cn from 'classnames'
import {
  Button,
  IconButton,
  HintWrapper,
  BreadCrumbs,
  DedicFiltersModal,
  DedicList,
  EditServerModal,
  ProlongModal,
  DedicsHistoryModal,
  InstructionModal,
  VdsRebootModal,
  Portal,
  Pagination,
  CheckBox,
} from '@components'
import { useDispatch, useSelector } from 'react-redux'
import { actions, dedicOperations, dedicSelectors } from '@redux'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'

import * as route from '@src/routes'
import s from './DedicatedServersPage.module.scss'
import { checkServicesRights, usePageRender } from '@utils'

export default function DedicatedServersPage() {
  const isAllowedToRender = usePageRender('mainmenuservice', 'dedic')

  const widerThan1600 = useMediaQuery({ query: '(min-width: 1600px)' })
  const dispatch = useDispatch()
  const { t } = useTranslation(['vds', 'container', 'other'])
  const navigate = useNavigate()

  const dedicRenderData = useSelector(dedicSelectors.getServersList)
  const dedicCount = useSelector(dedicSelectors.getDedicCount)

  const [activeServices, setActiveServices] = useState([])

  const [elidForEditModal, setElidForEditModal] = useState(0)
  const [elidForProlongModal, setElidForProlongModal] = useState([])
  const [elidForHistoryModal, setElidForHistoryModal] = useState(0)
  const [elidForInstructionModal, setElidForInstructionModal] = useState(0)
  const [elidForRebootModal, setElidForRebootModal] = useState([])
  const [filterModal, setFilterModal] = useState(false)
  const [filters, setFilters] = useState([])
  const [emptyFilter, setEmptyFilter] = useState(false)

  const [p_cnt, setP_cnt] = useState(10)
  const [p_num, setP_num] = useState(1)

  useEffect(() => {
    if (filterModal) {
      dispatch(actions.disableScrolling())
    } else {
      dispatch(actions.enableScrolling())
    }
  }, [filterModal])
  const [isFiltered, setIsFiltered] = useState(false)

  const mobile = useMediaQuery({ query: '(max-width: 767px)' })

  const location = useLocation()

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

  const resetFilterHandler = setValues => {
    const clearField = {
      id: '',
      domain: '',
      ip: '',
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
      datacenter: '',
      ostemplate: '',
    }
    setValues && setValues({ ...clearField })
    setFilterModal(false)
    setP_num(1)

    setIsFiltered(false)

    dispatch(
      dedicOperations.getDedicFilters(
        setFilters,
        { ...clearField, sok: 'ok', p_cnt },
        true,
        setEmptyFilter,
      ),
    )
    // setEmptyFilter(false)
  }

  const setFilterHandler = values => {
    setFilterModal(false)
    setP_num(1)

    setIsFiltered(true)

    dispatch(
      dedicOperations.getDedicFilters(
        setFilters,
        { ...values, sok: 'ok', p_cnt },
        true,
        setEmptyFilter,
      ),
    )
  }

  useEffect(() => {
    if (!isAllowedToRender) {
      navigate(route.SERVICES, { replace: true })
    } else {
      const clearField = {
        id: '',
        domain: '',
        ip: '',
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
        datacenter: '',
        ostemplate: '',
      }

      dispatch(
        dedicOperations.getDedicFilters(
          setFilters,
          { ...clearField, sok: 'ok', p_cnt },
          true,
        ),
      )
    }
  }, [])

  let rights = checkServicesRights(dedicRenderData?.dedicPageRights?.toolgrp)

  useEffect(() => {
    const data = { p_num, p_cnt }
    dispatch(dedicOperations.getServersList(data))
  }, [p_num, p_cnt])

  useEffect(() => {
    if (filterModal) dispatch(dedicOperations.getDedicFilters(setFilters, { p_cnt }))
  }, [filterModal])

  const getTotalPrice = () => {
    const list = activeServices.length >= 1 ? activeServices : []

    return list
      ?.reduce((totalPrice, server) => {
        return totalPrice + +server?.cost?.$?.trim()?.split(' ')?.[0]
      }, 0)
      ?.toFixed(2)
  }

  const getServerName = id => {
    if (typeof id === 'string') {
      return dedicRenderData?.serversList?.reduce((acc, el) => {
        if (el.id.$ === id) {
          acc = el.name.$
        }
        return acc
      }, '')
    } else if (Array.isArray(id)) {
      return id?.reduce((acc, idValue) => {
        acc.push(
          dedicRenderData?.serversList?.find(server => server.id.$ === idValue).name.$,
        )

        return acc
      }, [])
    }
  }

  useEffect(() => {
    const cartFromSite = localStorage.getItem('site_cart')
    const cartData = JSON.parse(cartFromSite)
    if (cartData?.func === 'dedic.order.param' && rights?.new) {
      navigate(route.DEDICATED_SERVERS_ORDER, {
        state: { isDedicOrderAllowed: rights?.new },
        replace: true,
      })
    }
  }, [rights])

  const isAllActive = activeServices.length === dedicRenderData?.serversList?.length
  const toggleIsAllActiveHandler = () => {
    isAllActive ? setActiveServices([]) : setActiveServices(dedicRenderData?.serversList)
  }

  return (
    <>
      <BreadCrumbs pathnames={parseLocations()} />
      <h2 className={s.page_title}>
        {t('burger_menu.services.services_list.dedicated_servers', { ns: 'container' })}
        {dedicRenderData?.serversList?.length !== 0 && (
          <span className={s.title_count_services}>{` (${dedicCount})`}</span>
        )}
      </h2>

      <div className={s.tools_wrapper}>
        {!widerThan1600 && dedicRenderData?.serversList?.length > 0 && (
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
            disabled={!rights.new}
            className={s.order_btn}
            isShadow
            type="button"
            label={t('to_order', { ns: 'other' }).toLocaleUpperCase()}
            onClick={() => {
              navigate(route.DEDICATED_SERVERS_ORDER, {
                state: { isDedicOrderAllowed: rights?.new },
                replace: true,
              })
            }}
          />

          <div className={s.tools_container}>
            <div className={s.filterBtnBlock}>
              <IconButton
                onClick={() => setFilterModal(true)}
                icon="filter"
                className={cn(s.calendarBtn, { [s.filtered]: isFiltered })}
                disabled={
                  (!emptyFilter && dedicRenderData?.serversList?.length === 0) ||
                  !rights.filter
                }
              />
              {filterModal && (
                <>
                  <Portal>
                    <div className={s.bg}>
                      {mobile && (
                        <DedicFiltersModal
                          filterModal={filterModal}
                          setFilterModal={setFilterModal}
                          filters={filters?.currentFilters}
                          filtersList={filters?.filters}
                          resetFilterHandler={resetFilterHandler}
                          setFilterHandler={setFilterHandler}
                        />
                      )}
                    </div>
                  </Portal>
                  {!mobile && (
                    <DedicFiltersModal
                      filterModal={filterModal}
                      setFilterModal={setFilterModal}
                      filters={filters?.currentFilters}
                      filtersList={filters?.filters}
                      resetFilterHandler={resetFilterHandler}
                      setFilterHandler={setFilterHandler}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <DedicList
        emptyFilter={emptyFilter}
        servers={dedicRenderData?.serversList}
        setElidForEditModal={setElidForEditModal}
        setElidForProlongModal={setElidForProlongModal}
        setElidForHistoryModal={setElidForHistoryModal}
        setElidForInstructionModal={setElidForInstructionModal}
        setElidForRebootModal={setElidForRebootModal}
        rights={rights}
        setActiveServices={setActiveServices}
        activeServices={activeServices}
      />

      {dedicCount > 5 && (
        <div className={s.pagination}>
          <Pagination
            totalCount={Number(dedicCount)}
            currentPage={p_num}
            pageSize={p_cnt}
            onPageChange={page => {
              setP_num(page)
              setActiveServices([])
            }}
            onPageItemChange={items => {
              setP_cnt(items)
              setActiveServices([])
            }}
          />
        </div>
      )}

      <div
        className={cn({
          [s.tools_footer]: true,
          [s.active_footer]: activeServices.length >= 1,
        })}
      >
        <div className={s.buttons_wrapper}>
          <HintWrapper label={t('reload')}>
            <IconButton
              className={s.tools_icon}
              disabled={
                activeServices.some(server => server?.show_reboot?.$ !== 'on') ||
                !rights?.reboot
              }
              onClick={() =>
                setElidForRebootModal(activeServices?.map(item => item.id.$))
              }
              icon="reload"
            />
          </HintWrapper>

          <HintWrapper label={t('prolong')}>
            <IconButton
              className={s.tools_icon}
              disabled={
                activeServices.some(
                  server =>
                    (server?.status?.$ !== '3' && server?.status?.$ !== '2') ||
                    server?.item_status?.$.trim() === 'Suspended by Administrator',
                ) || !rights?.prolong
              }
              onClick={() =>
                setElidForProlongModal(activeServices?.map(item => item.id.$))
              }
              icon="clock"
            />
          </HintWrapper>
        </div>

        <p className={s.services_selected}>
          {t('services_selected', { ns: 'other' })}{' '}
          <span className={s.tools_footer_value}>{activeServices.length}</span>
        </p>
        <p className={s.total_price}>
          {t('total', { ns: 'other' })}:
          <span className={s.tools_footer_value}>
            {getTotalPrice()}€/{t('short_month', { ns: 'other' })}
          </span>
        </p>
      </div>

      {!!elidForEditModal && (
        <EditServerModal
          elid={elidForEditModal}
          closeModal={() => setElidForEditModal(0)}
          isOpen
        />
      )}

      {elidForProlongModal.length > 0 && (
        <ProlongModal
          elidList={elidForProlongModal}
          closeModal={() => setElidForProlongModal([])}
          names={getServerName(elidForProlongModal)}
          pageName="dedics"
          isOpen
        />
      )}

      {!!elidForHistoryModal && (
        <DedicsHistoryModal
          elid={elidForHistoryModal}
          name={getServerName(elidForHistoryModal)}
          closeModal={() => setElidForHistoryModal(0)}
          isOpen
        />
      )}

      {!!elidForInstructionModal && (
        <InstructionModal
          title={t('Activation of Dedicated server', { ns: 'dedicated_servers' })}
          closeModal={() => setElidForInstructionModal(0)}
          dispatchInstruction={setInstruction =>
            dispatch(
              dedicOperations.getServiceInstruction(
                elidForInstructionModal,
                setInstruction,
              ),
            )
          }
          isOpen
        />
      )}

      {elidForRebootModal.length > 0 && (
        <VdsRebootModal
          id={elidForRebootModal}
          names={getServerName(elidForRebootModal)}
          closeModal={() => setElidForRebootModal([])}
          isOpen
        />
      )}
    </>
  )
}
