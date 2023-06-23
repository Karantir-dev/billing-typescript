import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import cn from 'classnames'
import {
  Button,
  IconButton,
  HintWrapper,
  BreadCrumbs,
  FTPFiltersModal,
  FTPList,
  FTPEditModal,
  ProlongModal,
  DedicsHistoryModal,
  FTPInstructionModal,
  Portal,
  Pagination,
  CheckBox,
} from '@components'
import { ftpOperations, ftpSelectors, actions } from '@redux'
import { useDispatch, useSelector } from 'react-redux'

import * as route from '@src/routes'
import s from './FTP.module.scss'
import { checkServicesRights, usePageRender } from '@utils'

export default function FTP() {
  const isAllowedToRender = usePageRender('mainmenuservice', 'storage')

  const widerThan1600 = useMediaQuery({ query: '(min-width: 1600px)' })
  const dispatch = useDispatch()
  const { t } = useTranslation(['vds', 'container', 'other'])
  const navigate = useNavigate()

  const ftpRenderData = useSelector(ftpSelectors.getFTPList)
  const ftpCount = useSelector(ftpSelectors.getFTPCount)

  const [p_cnt, setP_cnt] = useState(10)
  const [p_num, setP_num] = useState(1)

  const [activeServices, setActiveServices] = useState([])
  const [elidForEditModal, setElidForEditModal] = useState(0)
  const [elidForProlongModal, setElidForProlongModal] = useState([])
  const [elidForHistoryModal, setElidForHistoryModal] = useState(0)
  const [elidForInstructionModal, setElidForInstructionModal] = useState(0)
  const [filterModal, setFilterModal] = useState(false)
  const [filters, setFilters] = useState([])
  const [emptyFilter, setEmptyFilter] = useState(false)
  const [isFiltered, setIsFiltered] = useState(false)

  const mobile = useMediaQuery({ query: '(max-width: 767px)' })

  const getTotalPrice = () => {
    const list = activeServices.length >= 1 ? activeServices : []

    return list
      ?.reduce((totalPrice, server) => {
        return totalPrice + +server?.cost?.$?.trim()?.split(' ')?.[0]
      }, 0)
      ?.toFixed(2)
  }

  const location = useLocation()

  useEffect(() => {
    if (filterModal) {
      dispatch(actions.disableScrolling())
    } else {
      dispatch(actions.enableScrolling())
    }
  }, [filterModal])

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
    setP_num(1)
    setFilterModal(false)
    dispatch(
      ftpOperations.getFTPFilters(
        setFilters,
        { ...clearField, sok: 'ok', p_cnt },
        true,
        setEmptyFilter,
      ),
    )
  }

  const setFilterHandler = values => {
    setFilterModal(false)
    setP_num(1)
    setIsFiltered(true)

    dispatch(
      ftpOperations.getFTPFilters(
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
        ftpOperations.getFTPFilters(
          setFilters,
          { ...clearField, sok: 'ok', p_cnt },
          true,
        ),
      )
    }
  }, [])

  let rights = checkServicesRights(ftpRenderData?.ftpPageRights?.toolgrp)

  useEffect(() => {
    const data = { p_num, p_cnt }
    dispatch(ftpOperations.getFTPList(data))
  }, [p_num, p_cnt])

  useEffect(() => {
    if (filterModal) dispatch(ftpOperations.getFTPFilters(setFilters, { p_cnt }))
  }, [filterModal])

  const getServerName = id => {
    if (typeof id === 'string') {
      return ftpRenderData?.ftpList?.reduce((acc, el) => {
        if (el.id.$ === id) {
          acc = el.name.$
        }
        return acc
      }, '')
    } else if (Array.isArray(id)) {
      return id?.reduce((acc, idValue) => {
        acc.push(ftpRenderData?.ftpList?.find(server => server.id.$ === idValue).name.$)

        return acc
      }, [])
    }
  }

  const isAllActive = activeServices.length === ftpRenderData?.ftpList?.length
  const toggleIsAllActiveHandler = () => {
    isAllActive ? setActiveServices([]) : setActiveServices(ftpRenderData?.ftpList)
  }

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
        {!widerThan1600 && ftpRenderData?.ftpList?.length > 0 && (
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

          <div className={s.tools_container}>
            <div className={s.filterBtnBlock}>
              <IconButton
                onClick={() => setFilterModal(true)}
                icon="filter"
                className={cn(s.calendarBtn, { [s.filtered]: isFiltered })}
                disabled={
                  (ftpRenderData?.ftpList?.length === 0 && !emptyFilter) ||
                  !rights?.filter
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
          </div>
        </div>
      </div>

      <FTPList
        emptyFilter={emptyFilter}
        storageList={ftpRenderData?.ftpList}
        setElidForEditModal={setElidForEditModal}
        setElidForProlongModal={setElidForProlongModal}
        setElidForHistoryModal={setElidForHistoryModal}
        setElidForInstructionModal={setElidForInstructionModal}
        setActiveServices={setActiveServices}
        activeServices={activeServices}
        rights={rights}
      />

      {ftpCount > 5 && (
        <div className={s.pagination}>
          <Pagination
            totalCount={Number(ftpCount)}
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
          {t('total', { ns: 'other' })}:{' '}
          <span className={s.tools_footer_value}>
            {getTotalPrice()}€/{t('short_month', { ns: 'other' })}
          </span>
        </p>
      </div>

      {!!elidForEditModal && (
        <FTPEditModal
          elid={elidForEditModal}
          closeModal={() => setElidForEditModal(0)}
          isOpen
        />
      )}

      {elidForProlongModal.length > 0 && (
        <ProlongModal
          elidList={elidForProlongModal}
          closeModal={() => setElidForProlongModal([])}
          pageName="ftp"
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
        <FTPInstructionModal
          elid={elidForInstructionModal}
          closeModal={() => setElidForInstructionModal(0)}
          isOpen
        />
      )}
    </>
  )
}
