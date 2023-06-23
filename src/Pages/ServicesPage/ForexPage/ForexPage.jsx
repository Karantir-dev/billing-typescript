import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import { useLocation, useNavigate } from 'react-router-dom'
import * as route from '@src/routes'
import { useMediaQuery } from 'react-responsive'

import {
  Button,
  IconButton,
  HintWrapper,
  BreadCrumbs,
  ProlongModal,
  DedicsHistoryModal,
  Portal,
  ForexList,
  ForexEditModal,
  ForexFiltersModal,
  DeleteModal,
  Pagination,
  ForexInstructionModal,
  CheckBox,
} from '@components'
import { actions, forexOperations, forexSelectors } from '@redux'
import { useDispatch, useSelector } from 'react-redux'
import s from './ForexPage.module.scss'
import { checkServicesRights, usePageRender } from '@utils'

export default function ForexPage() {
  const widerThan1600 = useMediaQuery({ query: '(min-width: 1600px)' })
  const dispatch = useDispatch()
  const { t } = useTranslation(['vds', 'container', 'other'])
  const navigate = useNavigate()

  const forexRenderData = useSelector(forexSelectors.getForexList)
  const forexCount = useSelector(forexSelectors.getForexCount)

  const isAllowedToRender = usePageRender('mainmenuservice', 'forexbox')

  const [activeServices, setActiveServices] = useState([])

  const [elidForEditModal, setElidForEditModal] = useState(0)
  const [elidForProlongModal, setElidForProlongModal] = useState([])
  const [elidForHistoryModal, setElidForHistoryModal] = useState(0)
  const [elidForDeletionModal, setElidForDeletionModal] = useState([])
  const [elidForInstructionModal, setElidForInstructionModal] = useState(0)
  const [filterModal, setFilterModal] = useState(false)
  const [filters, setFilters] = useState([])
  const [emptyFilter, setEmptyFilter] = useState(false)

  const [p_cnt, setP_cnt] = useState(10)
  const [p_num, setP_num] = useState(1)

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

  const mobile = useMediaQuery({ query: '(max-width: 767px)' })

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
    setFilterModal(false)
    setP_num(1)
    dispatch(
      forexOperations.getForexFilters(
        setFilters,
        { ...clearField, sok: 'ok', p_cnt },
        true,
        setEmptyFilter,
      ),
    )
  }

  const setFilterHandler = values => {
    setFilterModal(false)
    setFilters(null)
    setP_num(1)
    setIsFiltered(true)

    dispatch(
      forexOperations.getForexFilters(
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
        forexOperations.getForexFilters(
          setFilters,
          { ...clearField, sok: 'ok', p_cnt },
          true,
        ),
      )
    }
  }, [])

  let rights = checkServicesRights(forexRenderData?.forexPageRights?.toolgrp)

  useEffect(() => {
    const data = { p_num, p_cnt }
    dispatch(forexOperations.getForexList(data))
  }, [p_num, p_cnt])

  useEffect(() => {
    if (filterModal) dispatch(forexOperations.getForexFilters(setFilters, { p_cnt }))
  }, [filterModal])

  const getServerName = id => {
    if (typeof id === 'string') {
      return forexRenderData?.forexList?.reduce((acc, el) => {
        if (el.id.$ === id) {
          acc = el.name.$
        }
        return acc
      }, '')
    } else if (Array.isArray(id)) {
      return id?.reduce((acc, idValue) => {
        acc.push(
          forexRenderData?.forexList?.find(server => server.id.$ === idValue).name.$,
        )

        return acc
      }, [])
    }
  }

  const handleDeletionModal = closeFn => {
    dispatch(forexOperations.deleteForex(elidForDeletionModal.join(', '), closeFn))
    setActiveServices([])
  }

  const isAllActive = activeServices.length === forexRenderData?.forexList?.length
  const toggleIsAllActiveHandler = () => {
    isAllActive ? setActiveServices([]) : setActiveServices(forexRenderData?.forexList)
  }

  return (
    <>
      <BreadCrumbs pathnames={parseLocations()} />
      <h2 className={s.page_title}>
        {t('forex', { ns: 'crumbs' })}
        {forexRenderData?.forexList?.length !== 0 && (
          <span className={s.title_count_services}>{` (${forexCount})`}</span>
        )}
      </h2>

      <div className={s.tools_wrapper}>
        {!widerThan1600 && forexRenderData?.forexList?.length > 0 && (
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
            className={s.order_btn}
            isShadow
            type="button"
            label={t('to_order', { ns: 'other' }).toLocaleUpperCase()}
            onClick={() => {
              navigate(route.FOREX_ORDER, {
                state: { isForexOrderAllowed: rights?.new },
                replace: true,
              })
            }}
            disabled={!rights?.new}
          />

          <div className={s.tools_container}>
            <div className={s.filterBtnBlock}>
              <IconButton
                onClick={() => setFilterModal(true)}
                icon="filter"
                className={cn(s.calendarBtn, { [s.filtered]: isFiltered })}
                disabled={
                  (!emptyFilter && forexRenderData?.forexList?.length === 0) ||
                  !rights?.filter
                }
              />
              {filterModal && (
                <>
                  <Portal>
                    <div className={s.bg}>
                      {mobile && (
                        <ForexFiltersModal
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
                    <ForexFiltersModal
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

      <ForexList
        emptyFilter={emptyFilter}
        forexList={forexRenderData?.forexList}
        setElidForEditModal={setElidForEditModal}
        setElidForProlongModal={setElidForProlongModal}
        setElidForHistoryModal={setElidForHistoryModal}
        setElidForDeletionModal={setElidForDeletionModal}
        setElidForInstructionModal={setElidForInstructionModal}
        activeServices={activeServices}
        setActiveServices={setActiveServices}
        pageRights={rights}
      />

      {forexCount > 5 && (
        <div className={s.pagination}>
          <Pagination
            totalCount={Number(forexCount)}
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
          <HintWrapper label={t('delete', { ns: 'other' })}>
            <IconButton
              className={s.tools_icon}
              onClick={() =>
                setElidForDeletionModal(activeServices.map(server => server.id.$))
              }
              disabled={
                activeServices.some(
                  server =>
                    server?.status?.$ === '5' || server?.scheduledclose?.$ === 'on',
                ) || !rights?.delete
              }
              icon="delete"
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
          {t('total', { ns: 'other' })}:{' '}
          <span className={s.tools_footer_value}>
            {getTotalPrice()}€/{t('short_month', { ns: 'other' })}
          </span>
        </p>
      </div>

      {!!elidForEditModal && (
        <ForexEditModal
          elid={elidForEditModal}
          closeModal={() => setElidForEditModal(0)}
          isOpen
        />
      )}

      {elidForProlongModal.length > 0 && (
        <ProlongModal
          elidList={elidForProlongModal}
          closeModal={() => setElidForProlongModal([])}
          pageName="forex"
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

      {elidForDeletionModal.length > 0 && (
        <DeleteModal
          names={getServerName(elidForDeletionModal)}
          closeModal={() => setElidForDeletionModal([])}
          deleteFn={() => handleDeletionModal(() => setElidForDeletionModal([]))}
          isOpen
        />
      )}

      {!!elidForInstructionModal && (
        <ForexInstructionModal
          elid={elidForInstructionModal}
          closeModal={() => setElidForInstructionModal(0)}
          isOpen
        />
      )}
    </>
  )
}
