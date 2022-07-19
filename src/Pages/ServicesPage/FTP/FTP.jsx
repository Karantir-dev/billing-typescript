import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import cn from 'classnames'
import {
  Button,
  IconButton,
  HintWrapper,
  Backdrop,
  BreadCrumbs,
  FTPFiltersModal,
  FTPList,
  FTPEditModal,
  ProlongModal,
  DedicsHistoryModal,
  FTPInstructionModal,
  Portal,
  Pagination,
} from '../../../Components'
import { ftpOperations, ftpSelectors, dedicOperations } from '../../../Redux'
import { useDispatch, useSelector } from 'react-redux'

import * as route from '../../../routes'
import s from './FTP.module.scss'
import { checkServicesRights, usePageRender } from '../../../utils'

export default function FTP() {
  const isAllowedToRender = usePageRender('mainmenuservice', 'storage')

  const widerThan1550 = useMediaQuery({ query: '(min-width: 1600px)' })
  const dispatch = useDispatch()
  const { t } = useTranslation(['vds', 'container', 'other'])
  const navigate = useNavigate()

  let ftpRenderData = useSelector(ftpSelectors.getFTPList)
  const ftpCount = useSelector(ftpSelectors.getFTPCount)
  const [currentPage, setCurrentPage] = useState(1)

  // const [ftpList, setFtpList] = useState(null)
  const [activeServer, setActiveServer] = useState(null)
  const [elidForEditModal, setElidForEditModal] = useState(0)
  const [elidForProlongModal, setElidForProlongModal] = useState(0)
  const [elidForHistoryModal, setElidForHistoryModal] = useState(0)
  const [elidForInstructionModal, setElidForInstructionModal] = useState(0)
  const [filterModal, setFilterModal] = useState(false)
  const [filters, setFilters] = useState([])
  const [emptyFilter, setEmptyFilter] = useState(false)
  const [isFiltered, setIsFiltered] = useState(false)

  const mobile = useMediaQuery({ query: '(max-width: 767px)' })

  const ftpTotalPrice = ftpRenderData?.ftpList?.reduce((curServer, nextServer) => {
    return curServer + +nextServer?.item_cost?.$
  }, 0)

  const location = useLocation()

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

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
      datacenter: '',
    }

    setIsFiltered(false)
    setCurrentPage(1)
    setFilterModal(false)
    dispatch(
      ftpOperations.getFTPFilters(
        setFilters,
        { ...clearField, sok: 'ok' },
        true,
        setEmptyFilter,
      ),
    )
  }

  const setFilterHandler = values => {
    setFilterModal(false)
    setCurrentPage(1)
    setIsFiltered(true)

    dispatch(
      ftpOperations.getFTPFilters(
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
        datacenter: '',
      }
      dispatch(
        ftpOperations.getFTPFilters(setFilters, { ...clearField, sok: 'ok' }, true),
      )
    }
  }, [])

  let rights = checkServicesRights(ftpRenderData?.ftpPageRights?.toolgrp)

  useEffect(() => {
    const data = { p_num: currentPage }
    dispatch(ftpOperations.getFTPList(data))
  }, [currentPage])

  useEffect(() => {
    if (filterModal) dispatch(ftpOperations.getFTPFilters(setFilters))
  }, [filterModal])

  return (
    <>
      <BreadCrumbs pathnames={parseLocations()} />
      <h2 className={s.page_title}>
        {t('burger_menu.services.services_list.external_ftp', { ns: 'container' })}
        {ftpRenderData?.ftpList?.length !== 0 && (
          <span className={s.title_count_services}>{` (${ftpCount})`}</span>
        )}
      </h2>
      <div className={s.tools_wrapper}>
        <div className={s.tools_container}>
          <div className={s.filterBtnBlock}>
            <IconButton
              onClick={() => setFilterModal(true)}
              icon="filter"
              className={cn(s.calendarBtn, { [s.filtered]: isFiltered })}
              disabled={
                (ftpRenderData?.ftpList?.length === 0 && !emptyFilter) || !rights?.filter
              }
            />
            {filterModal && (
              <>
                <Portal>
                  <div className={s.bg}>
                    {mobile && (
                      <FTPFiltersModal
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
                  <FTPFiltersModal
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
              <HintWrapper label={t('go_to_panel')}>
                <IconButton
                  onClick={() => {
                    dispatch(dedicOperations.goToPanel(activeServer?.id?.$))
                  }}
                  className={s.tools_icon}
                  disabled={
                    activeServer?.transition?.$ !== 'on' ||
                    !rights?.gotoserver ||
                    activeServer?.status?.$ !== '2' ||
                    !activeServer
                  }
                  icon="exitSign"
                />
              </HintWrapper>
            </div>
          )}
        </div>

        <Button
          disabled={!rights?.new}
          className={s.order_btn}
          isShadow
          type="button"
          label={t('to_order', { ns: 'other' }).toLocaleUpperCase()}
          onClick={() => {
            navigate(route.FTP_ORDER, {
              state: { isFtpOrderAllowed: rights?.new },
              replace: true,
            })
          }}
        />
      </div>
      <FTPList
        emptyFilter={emptyFilter}
        storageList={ftpRenderData?.ftpList}
        activeServerID={activeServer?.id.$}
        setElidForEditModal={setElidForEditModal}
        setElidForProlongModal={setElidForProlongModal}
        setElidForHistoryModal={setElidForHistoryModal}
        setElidForInstructionModal={setElidForInstructionModal}
        setActiveServer={setActiveServer}
        rights={rights}
      />

      {Number(ftpCount) <= 30 && widerThan1550 && ftpRenderData?.ftpList?.length !== 0 && (
        <div className={s.total_pagination_price}>
          {t('Sum', { ns: 'other' })}: {`${+ftpTotalPrice?.toFixed(4)} EUR`}
        </div>
      )}

      {ftpRenderData?.ftpList?.length !== 0 && (
        <div className={s.pagination}>
          <Pagination
            currentPage={currentPage}
            totalCount={Number(ftpCount)}
            totalPrice={widerThan1550 && +ftpTotalPrice?.toFixed(4)}
            pageSize={30}
            onPageChange={page => setCurrentPage(page)}
          />
        </div>
      )}

      <Backdrop onClick={() => null} isOpened={Boolean(elidForEditModal)}>
        <FTPEditModal elid={elidForEditModal} closeFn={() => setElidForEditModal(0)} />
      </Backdrop>

      <Backdrop
        onClick={() => setElidForProlongModal(0)}
        isOpened={Boolean(elidForProlongModal)}
      >
        <ProlongModal
          elid={elidForProlongModal}
          closeFn={() => setElidForProlongModal(0)}
          pageName="ftp"
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
        <FTPInstructionModal
          elid={elidForInstructionModal}
          closeFn={() => setElidForInstructionModal(0)}
        />
      </Backdrop>
    </>
  )
}
