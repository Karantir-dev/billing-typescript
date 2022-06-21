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
  RebootModal,
} from '../../../Components'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import { dedicOperations, dedicSelectors } from '../../../Redux'
import { useDispatch, useSelector } from 'react-redux'

import * as route from '../../../routes'
import s from './DedicatedServicesPage.module.scss'

export default function DedicatedServersPage() {
  const widerThan1550 = useMediaQuery({ query: '(min-width: 1550px)' })
  const dispatch = useDispatch()
  const { t } = useTranslation(['vds', 'container', 'other'])
  const navigate = useNavigate()

  const serversList = useSelector(dedicSelectors.getServersList)

  console.log('dedictest2')

  const [activeServer, setActiveServer] = useState(null)
  const [elidForEditModal, setElidForEditModal] = useState(0)
  const [elidForProlongModal, setElidForProlongModal] = useState(0)
  const [elidForHistoryModal, setElidForHistoryModal] = useState(0)
  const [elidForInstructionModal, setElidForInstructionModal] = useState(0)
  const [elidForRebootModal, setElidForRebootModal] = useState(0)
  const [filterModal, setFilterModal] = useState(false)
  const [filters, setFilters] = useState([])

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
      dedicOperations.getDedicFilters(setFilters, { ...clearField, sok: 'ok' }, true),
    )
  }

  const setFilterHandler = values => {
    setFilterModal(false)
    dispatch(dedicOperations.getDedicFilters(setFilters, { ...values, sok: 'ok' }, true))
  }

  useEffect(() => {
    dispatch(dedicOperations.getServersList())
    // dispatch(dedicOperations.getDedicFilters(setFilters))
  }, [])

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
          <IconButton
            className={cn({ [s.tools_icon]: true, [s.filter_icon]: true })}
            icon="filter"
            onClick={() => setFilterModal(!filterModal)}
          />
          {filterModal && (
            <DedicFiltersModal
              filterModal={filterModal}
              setFilterModal={setFilterModal}
              filters={filters?.currentFilters}
              filtersList={filters?.filters}
              resetFilterHandler={resetFilterHandler}
              setFilterHandler={setFilterHandler}
            />
          )}

          {widerThan1550 && (
            <div className={s.desktop_tools_wrapper}>
              <HintWrapper label={t('edit', { ns: 'other' })}>
                <IconButton
                  className={s.tools_icon}
                  onClick={() => setElidForEditModal(activeServer?.id?.$)}
                  disabled={!activeServer}
                  icon="edit"
                />
              </HintWrapper>
              <HintWrapper label={t('reload')}>
                <IconButton
                  className={s.tools_icon}
                  disabled={activeServer?.show_reboot?.$ !== 'on'}
                  icon="reload"
                  onClick={() => setElidForRebootModal(activeServer?.id?.$)}
                />
              </HintWrapper>
              <HintWrapper label={t('ip_addresses')}>
                <IconButton
                  onClick={() =>
                    navigate(route.DEDICATED_SERVERS_IP, {
                      state: { plid: activeServer?.id?.$ },
                    })
                  }
                  className={s.tools_icon}
                  disabled={activeServer?.has_ip_pricelist?.$ !== 'on'}
                  icon="ip"
                />
              </HintWrapper>
              <HintWrapper label={t('prolong')}>
                <IconButton
                  onClick={() => setElidForProlongModal(activeServer?.id?.$)}
                  className={s.tools_icon}
                  disabled={activeServer?.status?.$ !== '2'}
                  icon="clock"
                />
              </HintWrapper>
              <HintWrapper label={t('history')}>
                <IconButton
                  onClick={() => setElidForHistoryModal(activeServer?.id?.$)}
                  className={s.tools_icon}
                  icon="refund"
                  disabled={!activeServer?.id?.$}
                />
              </HintWrapper>
              <HintWrapper label={t('instruction')}>
                <IconButton
                  className={s.tools_icon}
                  disabled={activeServer?.status?.$ !== '2'}
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
                  disabled={activeServer?.transition?.$ !== 'on'}
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
          onClick={() => navigate(route.DEDICATED_SERVERS_ORDER)}
        />
      </div>
      <DedicList
        servers={serversList}
        activeServerID={activeServer?.id.$}
        setElidForEditModal={setElidForEditModal}
        setElidForProlongModal={setElidForProlongModal}
        setElidForHistoryModal={setElidForHistoryModal}
        setElidForInstructionModal={setElidForInstructionModal}
        setElidForRebootModal={setElidForRebootModal}
        setActiveServer={setActiveServer}
      />
      <Backdrop
        onClick={() => setElidForEditModal(0)}
        isOpened={Boolean(elidForEditModal)}
      >
        <EditServerModal elid={elidForEditModal} closeFn={() => setElidForEditModal(0)} />
      </Backdrop>

      <Backdrop
        onClick={() => setElidForProlongModal(0)}
        isOpened={Boolean(elidForProlongModal)}
      >
        <ProlongModal
          elid={elidForProlongModal}
          closeFn={() => setElidForProlongModal(0)}
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
          closeFn={setElidForRebootModal}
        />
      </Backdrop>
    </>
  )
}
