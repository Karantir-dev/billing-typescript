import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import * as route from '@src/routes'
import cn from 'classnames'
import { useMediaQuery } from 'react-responsive'

import {
  Button,
  IconButton,
  TooltipWrapper,
  BreadCrumbs,
  ProlongModal,
  DedicsHistoryModal,
  DNSList,
  DNSEditModal,
  DNSFiltersModal,
  Portal,
  Pagination,
  CheckBox,
  InstructionModal,
  Loader,
} from '@components'
import { dnsOperations, dnsSelectors, actions } from '@redux'
import { useDispatch, useSelector } from 'react-redux'
import s from './DNS.module.scss'
import { roundToDecimal, useCancelRequest, usePageRender } from '@utils'

export default function DNS() {
  const widerThan1600 = useMediaQuery({ query: '(min-width: 1600px)' })
  const dispatch = useDispatch()
  const { t } = useTranslation(['vds', 'container', 'other'])
  const navigate = useNavigate()

  let dnsRenderData = useSelector(dnsSelectors.getDNSList)
  const dnsCount = useSelector(dnsSelectors.getDNSCount)

  const isAllowedToRender = usePageRender('mainmenuservice', 'dnshost', true, 41)
  const { signal, isLoading, setIsLoading } = useCancelRequest()
  const [activeServices, setActiveServices] = useState([])

  const [elidForEditModal, setElidForEditModal] = useState(0)
  const [elidForProlongModal, setElidForProlongModal] = useState([])
  const [elidForHistoryModal, setElidForHistoryModal] = useState(0)
  const [elidForInstructionModal, setElidForInstructionModal] = useState(0)
  const [tarifs, setTarifs] = useState('No tariff plans available for order')
  const mobile = useMediaQuery({ query: '(max-width: 767px)' })

  const [p_cnt, setP_cnt] = useState(10)
  const [p_num, setP_num] = useState(1)

  const [filterModal, setFilterModal] = useState(false)
  const [filters, setFilters] = useState([])
  const [emptyFilter, setEmptyFilter] = useState(false)

  const [isFiltered, setIsFiltered] = useState(false)

  const getTotalPrice = () => {
    const list = activeServices.length >= 1 ? activeServices : []

    return list
      ?.reduce((totalPrice, server) => {
        return totalPrice + +server?.cost?.$?.trim()?.split(' ')?.[0]
      }, 0)
      ?.toFixed(2)
  }

  useEffect(() => {
    if (filterModal) {
      dispatch(actions.disableScrolling())
    } else {
      dispatch(actions.enableScrolling())
    }
  }, [filterModal])

  const location = useLocation()

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

  const resetFilterHandler = () => {
    const clearField = {
      id: '',
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
    }

    setIsFiltered(false)
    setP_num(1)

    setFilterModal(false)
    dispatch(
      dnsOperations.getDNSFilters(
        setFilters,
        { ...clearField, sok: 'ok', p_cnt },
        true,
        setEmptyFilter,
        signal,
        setIsLoading,
      ),
    )
  }

  const setFilterHandler = values => {
    setFilterModal(false)
    setFilters(null)
    setP_num(1)

    setIsFiltered(true)

    dispatch(
      dnsOperations.getDNSFilters(
        setFilters,
        { ...values, sok: 'ok', p_cnt },
        true,
        setEmptyFilter,
        signal,
        setIsLoading,
      ),
    )
    setActiveServices([])
  }

  useEffect(() => {
    if (!isAllowedToRender) {
      navigate(route.SERVICES, { replace: true })
    } else {
      const clearField = {
        id: '',
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
      }

      dispatch(
        dnsOperations.getDNSFilters(
          setFilters,
          { ...clearField, sok: 'ok', p_cnt },
          true,
          undefined,
          signal,
          setIsLoading,
        ),
      )

      dispatch(dnsOperations.getTarifs(setTarifs, {}, signal, setIsLoading))
    }
  }, [])

  function checkRights(toolgrp) {
    const rights = {}

    toolgrp?.forEach(section => {
      section?.toolbtn?.forEach(rightName => {
        rights[rightName.$name] = true
      })
    })

    return rights
  }

  let rights = checkRights(dnsRenderData?.dnsPageRights?.toolgrp)

  useEffect(() => {
    const data = { p_num, p_cnt }
    dispatch(dnsOperations.getDNSList(data, signal, setIsLoading))
    setActiveServices([])
  }, [p_num, p_cnt])

  useEffect(() => {
    if (filterModal)
      dispatch(
        dnsOperations.getDNSFilters(
          setFilters,
          { p_cnt },
          false,
          undefined,
          signal,
          setIsLoading,
        ),
      )
  }, [filterModal])

  const getServerName = id => {
    if (typeof id === 'string') {
      return dnsRenderData?.dnsList?.reduce((acc, el) => {
        if (el.id.$ === id) {
          acc = el.name.$
        }
        return acc
      }, '')
    } else if (Array.isArray(id)) {
      return id?.reduce((acc, idValue) => {
        acc.push(dnsRenderData?.dnsList?.find(server => server.id.$ === idValue).name.$)

        return acc
      }, [])
    }
  }

  const isAllActive = activeServices.length === dnsRenderData?.dnsList?.length
  const toggleIsAllActiveHandler = () => {
    isAllActive ? setActiveServices([]) : setActiveServices(dnsRenderData?.dnsList)
  }

  const isNoAvailableTariff = tarifs === 'No tariff plans available for order'

  return (
    <div>
      <BreadCrumbs pathnames={parseLocations()} />
      <h2 className={s.page_title}>
        {t('burger_menu.services.services_list.dns_hosting', { ns: 'container' })}
        {dnsRenderData?.dnsList?.length !== 0 && (
          <span className={s.title_count_services}>{` (${dnsCount})`}</span>
        )}
      </h2>

      <div className={s.tools_wrapper}>
        {!widerThan1600 && dnsRenderData?.dnsList?.length > 0 && (
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
          <TooltipWrapper
            content={t('No tariff plans available for order', { ns: 'other' })}
            disabled={!isNoAvailableTariff}
            id="order_dns_btn"
          >
            <Button
              className={s.order_btn}
              isShadow
              type="button"
              label={t('to_order', { ns: 'other' }).toLocaleUpperCase()}
              onClick={() => {
                navigate(route.DNS_ORDER, {
                  state: { isDnsOrderAllowed: rights?.new },
                  replace: true,
                })
              }}
              disabled={isNoAvailableTariff || !rights?.new}
            />
          </TooltipWrapper>
          <div className={s.tools_container}>
            <div className={s.filterBtnBlock}>
              <IconButton
                onClick={() => setFilterModal(true)}
                icon="filter"
                className={cn(s.calendarBtn, { [s.filtered]: isFiltered })}
                disabled={
                  (dnsRenderData?.dnsList?.length === 0 && !emptyFilter) ||
                  !rights?.filter
                }
              />
              {filterModal && (
                <>
                  <Portal>
                    <div className={s.bg}>
                      {mobile && (
                        <DNSFiltersModal
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
                    <DNSFiltersModal
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

      <DNSList
        emptyFilter={emptyFilter}
        dnsList={dnsRenderData?.dnsList}
        setElidForEditModal={setElidForEditModal}
        setElidForProlongModal={setElidForProlongModal}
        setElidForHistoryModal={setElidForHistoryModal}
        setElidForInstructionModal={setElidForInstructionModal}
        pageRights={rights}
        activeServices={activeServices}
        setActiveServices={setActiveServices}
        signal={signal}
      />

      {dnsCount > 5 && (
        <div className={s.pagination}>
          <Pagination
            totalCount={Number(dnsCount)}
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
          <TooltipWrapper content={t('prolong')} id="prolong_btn">
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
          </TooltipWrapper>
        </div>

        <p className={s.services_selected}>
          {t('services_selected', { ns: 'other' })}{' '}
          <span className={s.tools_footer_value}>{activeServices.length}</span>
        </p>
        <p className={s.total_price}>
          {t('total', { ns: 'other' })}:{' '}
          <span className={s.tools_footer_value}>
            {roundToDecimal(getTotalPrice())}€/{t('short_month', { ns: 'other' })}
          </span>
        </p>
      </div>

      {!!elidForEditModal && (
        <DNSEditModal
          elid={elidForEditModal}
          closeModal={() => setElidForEditModal(0)}
          isOpen
        />
      )}

      {!!elidForProlongModal.length > 0 && (
        <ProlongModal
          elidList={elidForProlongModal}
          closeModal={() => setElidForProlongModal([])}
          pageName="dns"
          names={getServerName(elidForProlongModal)}
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
          title={t('DNS-hosting activation', { ns: 'other' })}
          closeModal={() => setElidForInstructionModal(0)}
          dispatchInstruction={setInstruction =>
            dispatch(
              dnsOperations.getServiceInstruction(
                elidForInstructionModal,
                setInstruction,
              ),
            )
          }
          isOpen
        />
      )}

      {isLoading && <Loader local shown={isLoading} />}
    </div>
  )
}
