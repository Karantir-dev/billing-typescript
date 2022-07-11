import React, { useEffect, useState } from 'react'
// import cn from 'classnames'
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
  RebootModal,
  Portal,
} from '../../../Components'
import { useDispatch, useSelector } from 'react-redux'
import { dedicOperations, dedicSelectors } from '../../../Redux'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'

import * as route from '../../../routes'
import s from './DedicatedServersPage.module.scss'
import { checkServicesRights, usePageRender } from '../../../utils'

export default function DedicatedServersPage() {
  const isAllowedToRender = usePageRender('mainmenuservice', 'dedic')

  const widerThan1550 = useMediaQuery({ query: '(min-width: 1600px)' })
  const dispatch = useDispatch()
  const { t } = useTranslation(['vds', 'container', 'other'])
  const navigate = useNavigate()

  const dedicRenderData = useSelector(dedicSelectors.getServersList)

  const [activeServer, setActiveServer] = useState(null)
  const [elidForEditModal, setElidForEditModal] = useState(0)
  const [elidForProlongModal, setElidForProlongModal] = useState(0)
  const [elidForHistoryModal, setElidForHistoryModal] = useState(0)
  const [elidForInstructionModal, setElidForInstructionModal] = useState(0)
  const [elidForRebootModal, setElidForRebootModal] = useState(0)
  const [filterModal, setFilterModal] = useState(false)
  const [filters, setFilters] = useState([])
  const [emptyFilter, setEmptyFilter] = useState(false)

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
    if (filterModal) dispatch(dedicOperations.getDedicFilters(setFilters))
  }, [filterModal])

  return (
    <>
      <BreadCrumbs pathnames={parseLocations()} />
      <h2 className={s.page_title}>
        {t('burger_menu.services.services_list.dedicated_servers', { ns: 'container' })}
      </h2>
      <div className={s.tools_wrapper}>
        <div className={s.tools_container}>
          <div className={s.filterBtnBlock}>
            <IconButton
              onClick={() => setFilterModal(true)}
              icon="filter"
              className={s.calendarBtn}
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

          {widerThan1550 && (
            <div className={s.desktop_tools_wrapper}>
              <HintWrapper
                wrapperClassName={s.hint_wrapper}
                label={t('edit', { ns: 'other' })}
              >
                <IconButton
                  className={s.tools_icon}
                  onClick={() => setElidForEditModal(activeServer?.id?.$)}
                  disabled={!activeServer || !rights.edit}
                  icon="edit"
                />
              </HintWrapper>
              <HintWrapper wrapperClassName={s.hint_wrapper} label={t('reload')}>
                <IconButton
                  className={s.tools_icon}
                  disabled={activeServer?.show_reboot?.$ !== 'on' || !rights.reload}
                  icon="reload"
                  onClick={() => setElidForRebootModal(activeServer?.id?.$)}
                />
              </HintWrapper>
              <HintWrapper wrapperClassName={s.hint_wrapper} label={t('ip_addresses')}>
                <IconButton
                  onClick={() =>
                    navigate(route.DEDICATED_SERVERS_IP, {
                      state: {
                        plid: activeServer?.id?.$,
                        isIpAllowedRender: rights?.ip,
                      },
                      replace: true,
                    })
                  }
                  className={s.tools_icon}
                  disabled={activeServer?.has_ip_pricelist?.$ !== 'on' || !rights.ip}
                  icon="ip"
                />
              </HintWrapper>
              <HintWrapper wrapperClassName={s.hint_wrapper} label={t('prolong')}>
                <IconButton
                  onClick={() => setElidForProlongModal(activeServer?.id?.$)}
                  className={s.tools_icon}
                  disabled={activeServer?.status?.$ !== '2' || !rights.prolong}
                  icon="clock"
                />
              </HintWrapper>
              <HintWrapper wrapperClassName={s.hint_wrapper} label={t('history')}>
                <IconButton
                  onClick={() => setElidForHistoryModal(activeServer?.id?.$)}
                  className={s.tools_icon}
                  icon="refund"
                  disabled={!activeServer?.id?.$ || !rights.history}
                />
              </HintWrapper>
              <HintWrapper wrapperClassName={s.hint_wrapper} label={t('instruction')}>
                <IconButton
                  className={s.tools_icon}
                  disabled={activeServer?.status?.$ !== '2' || !rights.instruction}
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
                    !rights.gotoserver
                  }
                  icon="exitSign"
                />
              </HintWrapper>
            </div>
          )}
        </div>

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
      </div>
      <DedicList
        emptyFilter={emptyFilter}
        servers={dedicRenderData?.serversList}
        activeServerID={activeServer?.id.$}
        setElidForEditModal={setElidForEditModal}
        setElidForProlongModal={setElidForProlongModal}
        setElidForHistoryModal={setElidForHistoryModal}
        setElidForInstructionModal={setElidForInstructionModal}
        setElidForRebootModal={setElidForRebootModal}
        setActiveServer={setActiveServer}
        rights={rights}
      />
      <Backdrop onClick={() => null} isOpened={Boolean(elidForEditModal)}>
        <EditServerModal elid={elidForEditModal} closeFn={() => setElidForEditModal(0)} />
      </Backdrop>

      <Backdrop
        onClick={() => setElidForProlongModal(0)}
        isOpened={Boolean(elidForProlongModal)}
      >
        <ProlongModal
          elid={elidForProlongModal}
          closeFn={() => setElidForProlongModal(0)}
          pageName="dedics"
        />
      </Backdrop>

      <Backdrop
        onClick={() => setElidForHistoryModal(0)}
        isOpened={Boolean(elidForHistoryModal)}
      >
        <DedicsHistoryModal
          elid={elidForHistoryModal}
          name={activeServer?.name?.$}
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
        onClick={() => setElidForRebootModal(0)}
        isOpened={Boolean(elidForRebootModal)}
      >
        <RebootModal
          server={activeServer}
          elid={elidForRebootModal}
          closeFn={() => setElidForRebootModal(0)}
        />
      </Backdrop>
    </>
  )
}