import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import * as route from '../../../routes'
// import cn from 'classnames'
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
  // DNSChangeTarif,
} from '../../../Components'
import { dnsOperations, dedicOperations, dnsSelectors } from '../../../Redux'
import { useDispatch, useSelector } from 'react-redux'
import s from './DNS.module.scss'
import { usePageRender } from '../../../utils'

export default function DNS() {
  const widerThan1550 = useMediaQuery({ query: '(min-width: 1600px)' })
  const dispatch = useDispatch()
  const { t } = useTranslation(['vds', 'container', 'other'])
  const navigate = useNavigate()

  const dnsRenderData = useSelector(dnsSelectors.getDNSList)
  const dnsCount = useSelector(dnsSelectors.getDNSCount)

  const isAllowedToRender = usePageRender('mainmenuservice', 'dnshost')

  // const [dnsList, setDnsList] = useState(null)
  const [activeServer, setActiveServer] = useState(null)
  const [elidForEditModal, setElidForEditModal] = useState(0)
  const [elidForProlongModal, setElidForProlongModal] = useState(0)
  const [elidForHistoryModal, setElidForHistoryModal] = useState(0)
  const [elidForInstructionModal, setElidForInstructionModal] = useState(0)
  const [tarifs, setTarifs] = useState('No tariff plans available for order')
  const mobile = useMediaQuery({ query: '(max-width: 767px)' })
  const [currentPage, setCurrentPage] = useState(1)

  const dnsTotalPrice = dnsRenderData?.dnsList?.reduce((curServer, nextServer) => {
    return curServer + +nextServer?.item_cost?.$
  }, 0)

  // const [
  //   elidForChangeTarifModal,
  //   setElidForChangeTarifModal,
  // ] = useState(0)
  const [filterModal, setFilterModal] = useState(false)
  const [filters, setFilters] = useState([])
  const [emptyFilter, setEmptyFilter] = useState(false)

  const location = useLocation()

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

  const resetFilterHandler = setValues => {
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
    setValues && setValues({ ...clearField })

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

    dispatch(
      dnsOperations.getDNSFilters(
        setFilters,
        { ...values, sok: 'ok' },
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
  }, [currentPage])

  useEffect(() => {
    if (filterModal) dispatch(dnsOperations.getDNSFilters(setFilters))
  }, [filterModal])

  return (
    <>
      <BreadCrumbs pathnames={parseLocations()} />
      <h2 className={s.page_title}>
        {t('burger_menu.services.services_list.dns_hosting', { ns: 'container' })}
        {dnsRenderData?.dnsList?.length !== 0 && (
          <span className={s.title_count_services}>
            {` (${dnsRenderData?.dnsList?.length})`}
          </span>
        )}
      </h2>
      <div className={s.tools_wrapper}>
        <div className={s.tools_container}>
          <div className={s.filterBtnBlock}>
            <IconButton
              onClick={() => setFilterModal(true)}
              icon="filter"
              className={s.calendarBtn}
              disabled={
                (dnsRenderData?.dnsList?.length === 0 && !emptyFilter) || !rights?.filter
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

          {widerThan1550 && (
            <div className={s.desktop_tools_wrapper}>
              <HintWrapper
                wrapperClassName={s.hint_wrapper}
                label={t('edit', { ns: 'other' })}
              >
                <IconButton
                  className={s.tools_icon}
                  onClick={() => setElidForEditModal(activeServer?.id?.$)}
                  disabled={
                    activeServer?.status?.$ === '1' || !rights?.edit || !activeServer
                  }
                  icon="edit"
                />
              </HintWrapper>
              {/* <HintWrapper label={t('Change tarif', { ns: 'other' })}>
                <IconButton
                  className={s.tools_icon}
                  onClick={() => setElidForChangeTarifModal(activeServer?.id?.$)}
                  disabled={!activeServer || activeServer?.change_pricelist?.$ === 'off'}
                  icon="exchange"
                />
              </HintWrapper> */}

              <HintWrapper wrapperClassName={s.hint_wrapper} label={t('prolong')}>
                <IconButton
                  onClick={() => setElidForProlongModal(activeServer?.id?.$)}
                  className={s.tools_icon}
                  disabled={
                    activeServer?.status?.$ === '1' || !rights?.prolong || !activeServer
                  }
                  icon="clock"
                />
              </HintWrapper>
              <HintWrapper wrapperClassName={s.hint_wrapper} label={t('history')}>
                <IconButton
                  onClick={() => setElidForHistoryModal(activeServer?.id?.$)}
                  className={s.tools_icon}
                  icon="refund"
                  disabled={
                    activeServer?.status?.$ === '1' || !rights?.history || !activeServer
                  }
                />
              </HintWrapper>
              <HintWrapper wrapperClassName={s.hint_wrapper} label={t('instruction')}>
                <IconButton
                  className={s.tools_icon}
                  disabled={
                    activeServer?.status?.$ === '1' ||
                    !rights?.instruction ||
                    !activeServer
                  }
                  icon="info"
                  onClick={() => setElidForInstructionModal(activeServer?.id?.$)}
                />
              </HintWrapper>
              <HintWrapper wrapperClassName={s.hint_wrapper} label={t('go_to_panel')}>
                <IconButton
                  onClick={() => {
                    dispatch(dedicOperations.goToPanel(activeServer?.id?.$))
                  }}
                  className={s.tools_icon}
                  disabled={
                    activeServer?.transition?.$ !== 'on' ||
                    activeServer?.status?.$ !== '2' ||
                    !rights?.gotoserver ||
                    !activeServer
                  }
                  icon="exitSign"
                />
              </HintWrapper>
            </div>
          )}
        </div>

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
            // navigate(route.DNS_ORDER)
          }}
          disabled={tarifs === 'No tariff plans available for order' || !rights?.new}
        />
      </div>
      <DNSList
        emptyFilter={emptyFilter}
        dnsList={dnsRenderData?.dnsList}
        activeServerID={activeServer?.id.$}
        setElidForEditModal={setElidForEditModal}
        setElidForProlongModal={setElidForProlongModal}
        setElidForHistoryModal={setElidForHistoryModal}
        setElidForInstructionModal={setElidForInstructionModal}
        // setElidForChangeTarifModal={setElidForChangeTarifModal}
        setActiveServer={setActiveServer}
        pageRights={rights}
      />

      {Number(dnsCount) <= 30 && widerThan1550 && dnsRenderData?.dnsList?.length !== 0 && (
        <div className={s.total_pagination_price}>
          {t('Sum', { ns: 'other' })}: {`${+dnsTotalPrice?.toFixed(4)} EUR`}
        </div>
      )}

      {dnsRenderData?.dnsList?.length !== 0 && (
        <div className={s.pagination}>
          <Pagination
            currentPage={currentPage}
            totalCount={Number(dnsCount)}
            totalPrice={widerThan1550 && +dnsTotalPrice?.toFixed(4)}
            pageSize={30}
            onPageChange={page => setCurrentPage(page)}
          />
        </div>
      )}

      <Backdrop onClick={() => null} isOpened={Boolean(elidForEditModal)}>
        <DNSEditModal elid={elidForEditModal} closeFn={() => setElidForEditModal(0)} />
      </Backdrop>

      <Backdrop
        onClick={() => setElidForProlongModal(0)}
        isOpened={Boolean(elidForProlongModal)}
      >
        <ProlongModal
          elid={elidForProlongModal}
          closeFn={() => setElidForProlongModal(0)}
          pageName="dns"
        />
      </Backdrop>

      <Backdrop
        onClick={() => setElidForHistoryModal(0)}
        isOpened={Boolean(elidForHistoryModal)}
      >
        <DedicsHistoryModal
          elid={elidForHistoryModal}
          server={activeServer}
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

      {/* <Backdrop
        onClick={() => setElidForChangeTarifModal(0)}
        isOpened={Boolean(elidForChangeTarifModal)}
      >
        <DNSChangeTarif
          elid={elidForChangeTarifModal}
          closeFn={() => setElidForChangeTarifModal(0)}
        />
      </Backdrop> */}
    </>
  )
}
