import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import {
  Button,
  IconButton,
  HintWrapper,
  Backdrop,
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
} from '../../../Components'
import { useDispatch, useSelector } from 'react-redux'
import { actions, dedicOperations, dedicSelectors } from '../../../Redux'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'

import * as route from '../../../routes'
import s from './DedicatedServersPage.module.scss'
import { checkServicesRights, usePageRender } from '../../../utils'

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
  const [currentPage, setCurrentPage] = useState(1)

  const dedicsTotalPrice = dedicRenderData?.serversList?.reduce(
    (curServer, nextServer) => {
      return curServer + +nextServer?.item_cost?.$
    },
    0,
  )

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
    setCurrentPage(1)

    setIsFiltered(false)

    dispatch(
      dedicOperations.getDedicFilters(
        setFilters,
        { ...clearField, sok: 'ok' },
        true,
        setEmptyFilter,
      ),
    )
    // setEmptyFilter(false)
  }

  const setFilterHandler = values => {
    setFilterModal(false)
    setCurrentPage(1)

    setIsFiltered(true)

    dispatch(
      dedicOperations.getDedicFilters(
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
        dedicOperations.getDedicFilters(setFilters, { ...clearField, sok: 'ok' }, true),
      )
    }
  }, [])

  let rights = checkServicesRights(dedicRenderData?.dedicPageRights?.toolgrp)

  useEffect(() => {
    const data = { p_num: currentPage }
    dispatch(dedicOperations.getServersList(data))
  }, [currentPage])

  useEffect(() => {
    if (filterModal) dispatch(dedicOperations.getDedicFilters(setFilters))
  }, [filterModal])

  const getTotalPrice = () => {
    const list = activeServices.length > 1 ? activeServices : dedicRenderData?.serversList

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
                initialState={
                  activeServices.length === dedicRenderData?.serversList?.length
                }
                func={isChecked => {
                  isChecked
                    ? setActiveServices([])
                    : setActiveServices(dedicRenderData?.serversList)
                }}
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

      {dedicRenderData?.serversList?.length !== 0 && (
        <div className={s.pagination}>
          <Pagination
            currentPage={currentPage}
            totalCount={Number(dedicCount)}
            pageSize={30}
            totalPrice={widerThan1600 && +dedicsTotalPrice?.toFixed(4)}
            onPageChange={page => setCurrentPage(page)}
          />
        </div>
      )}

      {dedicRenderData?.serversList?.length > 0 && (
        <div className={s.tools_footer}>
          {activeServices.length >= 1 && (
            <>
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
            </>
          )}
          <p className={s.total_price}>
            {t('total', { ns: 'other' })}:{' '}
            <span className={s.tools_footer_value}>
              {getTotalPrice()}€/{t('short_month', { ns: 'other' })}
            </span>
          </p>
        </div>
      )}

      <Backdrop onClick={() => null} isOpened={Boolean(elidForEditModal)}>
        <EditServerModal elid={elidForEditModal} closeFn={() => setElidForEditModal(0)} />
      </Backdrop>

      <Backdrop
        onClick={() => setElidForProlongModal([])}
        isOpened={elidForProlongModal.length > 0}
      >
        <ProlongModal
          elidList={elidForProlongModal}
          closeFn={() => setElidForProlongModal([])}
          names={getServerName(elidForProlongModal)}
          pageName="dedics"
        />
      </Backdrop>

      <Backdrop
        onClick={() => setElidForHistoryModal(0)}
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
        <InstructionModal
          elid={elidForInstructionModal}
          closeFn={() => setElidForInstructionModal(0)}
        />
      </Backdrop>

      <Backdrop
        onClick={() => setElidForRebootModal([])}
        isOpened={elidForRebootModal.length > 0}
      >
        <VdsRebootModal
          id={elidForRebootModal}
          names={getServerName(elidForRebootModal)}
          closeFn={() => setElidForRebootModal([])}
        />
      </Backdrop>
    </>
  )
}
