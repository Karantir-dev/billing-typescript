import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import * as route from '../../../routes'
import cn from 'classnames'
import { useMediaQuery } from 'react-responsive'

import {
  Button,
  IconButton,
  HintWrapper,
  Backdrop,
  BreadCrumbs,
  ProlongModal,
  DedicsHistoryModal,
  DNSList,
  DNSEditModal,
  DNSInstructionModal,
  DNSFiltersModal,
  Portal,
  Pagination,
  CheckBox,
} from '../../../Components'
import { dnsOperations, dnsSelectors, actions } from '../../../Redux'
import { useDispatch, useSelector } from 'react-redux'
import s from './DNS.module.scss'
import { usePageRender } from '../../../utils'

export default function DNS() {
  const widerThan1600 = useMediaQuery({ query: '(min-width: 1600px)' })
  const dispatch = useDispatch()
  const { t } = useTranslation(['vds', 'container', 'other'])
  const navigate = useNavigate()

  let dnsRenderData = useSelector(dnsSelectors.getDNSList)
  const dnsCount = useSelector(dnsSelectors.getDNSCount)

  const isAllowedToRender = usePageRender('mainmenuservice', 'dnshost')

  const [activeServices, setActiveServices] = useState([])

  const [elidForEditModal, setElidForEditModal] = useState(0)
  const [elidForProlongModal, setElidForProlongModal] = useState([])
  const [elidForHistoryModal, setElidForHistoryModal] = useState(0)
  const [elidForInstructionModal, setElidForInstructionModal] = useState(0)
  const [tarifs, setTarifs] = useState('No tariff plans available for order')
  const mobile = useMediaQuery({ query: '(max-width: 767px)' })
  const [currentPage, setCurrentPage] = useState(1)

  const dnsTotalPrice = dnsRenderData?.dnsList?.reduce((curServer, nextServer) => {
    return curServer + +nextServer?.item_cost?.$
  }, 0)

  const [filterModal, setFilterModal] = useState(false)
  const [filters, setFilters] = useState([])
  const [emptyFilter, setEmptyFilter] = useState(false)

  const [isFiltered, setIsFiltered] = useState(false)

  const getTotalPrice = () => {
    const list = activeServices.length >= 1 ? activeServices : dnsRenderData?.dnsList

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
    setCurrentPage(1)

    setFilterModal(false)
    dispatch(
      dnsOperations.getDNSFilters(
        setFilters,
        { ...clearField, sok: 'ok' },
        true,
        setEmptyFilter,
      ),
    )
  }

  const setFilterHandler = values => {
    setFilterModal(false)
    setFilters(null)
    setCurrentPage(1)

    setIsFiltered(true)

    dispatch(
      dnsOperations.getDNSFilters(
        setFilters,
        { ...values, sok: 'ok' },
        true,
        setEmptyFilter,
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
        dnsOperations.getDNSFilters(setFilters, { ...clearField, sok: 'ok' }, true),
      )

      dispatch(dnsOperations.getTarifs(setTarifs))
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
    const data = { p_num: currentPage }
    dispatch(dnsOperations.getDNSList(data))
    setActiveServices([])
  }, [currentPage])

  useEffect(() => {
    if (filterModal) dispatch(dnsOperations.getDNSFilters(setFilters))
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

  return (
    <>
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
                initialState={activeServices.length === dnsRenderData?.dnsList?.length}
                func={isChecked => {
                  isChecked
                    ? setActiveServices([])
                    : setActiveServices(dnsRenderData?.dnsList)
                }}
              />
              <span>{t('Choose all', { ns: 'other' })}</span>
            </div>
          </div>
        )}

        <div className={s.btns_wrapper}>
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
            disabled={tarifs === 'No tariff plans available for order' || !rights?.new}
          />
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
      />

      {dnsRenderData?.dnsList?.length !== 0 && (
        <div className={s.pagination}>
          <Pagination
            currentPage={currentPage}
            totalCount={Number(dnsCount)}
            totalPrice={widerThan1600 && +dnsTotalPrice?.toFixed(4)}
            pageSize={10}
            onPageChange={page => setCurrentPage(page)}
          />
        </div>
      )}

      {dnsRenderData?.dnsList?.length > 0 && (
        <div className={s.tools_footer}>
          {activeServices.length >= 1 && (
            <>
              <div className={s.buttons_wrapper}>
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
            </>
          )}
          <p className={s.services_selected}>
            {t('services_selected', { ns: 'other' })}{' '}
            <span className={s.tools_footer_value}>{activeServices.length}</span>
          </p>
          <p className={s.total_price}>
            {t('total', { ns: 'other' })}:{' '}
            <span className={s.tools_footer_value}>
              {getTotalPrice()}€/{t('short_month', { ns: 'other' })}
            </span>
          </p>
        </div>
      )}

      <Backdrop onClick={() => null} isOpened={Boolean(elidForEditModal)}>
        <DNSEditModal elid={elidForEditModal} closeFn={() => setElidForEditModal(0)} />
      </Backdrop>

      <Backdrop
        onClick={() => setElidForProlongModal([])}
        isOpened={elidForProlongModal.length > 0}
      >
        <ProlongModal
          elidList={elidForProlongModal}
          closeFn={() => setElidForProlongModal([])}
          pageName="dns"
          names={getServerName(elidForProlongModal)}
        />
      </Backdrop>

      <Backdrop
        onClick={() => setElidForHistoryModal('')}
        isOpened={Boolean(elidForHistoryModal)}
      >
        <DedicsHistoryModal
          elid={elidForHistoryModal}
          name={getServerName(elidForHistoryModal)}
          closeFn={() => setElidForHistoryModal(0)}
        />
      </Backdrop>

      <Backdrop
        onClick={() => setElidForInstructionModal(0)}
        isOpened={Boolean(elidForInstructionModal)}
      >
        <DNSInstructionModal
          elid={elidForInstructionModal}
          closeFn={() => setElidForInstructionModal(0)}
        />
      </Backdrop>
    </>
  )
}
