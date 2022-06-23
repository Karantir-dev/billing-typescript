import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'

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
} from '../../../Components'
import { ftpOperations, ftpSelectors, dedicOperations } from '../../../Redux'
import { useDispatch, useSelector } from 'react-redux'

import * as route from '../../../routes'
import s from './FTP.module.scss'

export default function FTP() {
  const widerThan1550 = useMediaQuery({ query: '(min-width: 1550px)' })
  const dispatch = useDispatch()
  const { t } = useTranslation(['vds', 'container', 'other'])
  const navigate = useNavigate()

  const ftpList = useSelector(ftpSelectors.getFTPList)
  const [activeServer, setActiveServer] = useState(null)
  const [elidForEditModal, setElidForEditModal] = useState(0)
  const [elidForProlongModal, setElidForProlongModal] = useState(0)
  const [elidForHistoryModal, setElidForHistoryModal] = useState(0)
  const [elidForInstructionModal, setElidForInstructionModal] = useState(0)
  const [filterModal, setFilterModal] = useState(false)
  const [filters, setFilters] = useState([])
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
    dispatch(ftpOperations.getFTPFilters(setFilters, { ...clearField, sok: 'ok' }, true))
  }

  const setFilterHandler = values => {
    setFilterModal(false)
    dispatch(ftpOperations.getFTPFilters(setFilters, { ...values, sok: 'ok' }, true))
  }

  useEffect(() => {
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
    dispatch(ftpOperations.getFTPFilters(setFilters, { ...clearField, sok: 'ok' }, true))

    // dispatch(ftpOperations.getFTPList())
    // dispatch(ftpOperations.getFTPFilters(setFilters))
  }, [])

  useEffect(() => {
    if (filterModal) dispatch(ftpOperations.getFTPFilters(setFilters))
  }, [filterModal])

  return (
    <>
      <BreadCrumbs pathnames={parseLocations()} />
      <h2 className={s.page_title}>
        {t('burger_menu.services.services_list.external_ftp', { ns: 'container' })}
      </h2>
      <div className={s.tools_wrapper}>
        <div className={s.tools_container}>
          <div className={s.filterBtnBlock}>
            <IconButton
              onClick={() => setFilterModal(true)}
              icon="filter"
              className={s.calendarBtn}
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
              <HintWrapper label={t('edit', { ns: 'other' })}>
                <IconButton
                  className={s.tools_icon}
                  onClick={() => setElidForEditModal(activeServer?.id?.$)}
                  disabled={!activeServer}
                  icon="edit"
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
          onClick={() => navigate(route.FTP_ORDER)}
        />
      </div>
      <FTPList
        storageList={ftpList}
        activeServerID={activeServer?.id.$}
        setElidForEditModal={setElidForEditModal}
        setElidForProlongModal={setElidForProlongModal}
        setElidForHistoryModal={setElidForHistoryModal}
        setElidForInstructionModal={setElidForInstructionModal}
        setActiveServer={setActiveServer}
      />
      <Backdrop
        onClick={() => setElidForEditModal(0)}
        isOpened={Boolean(elidForEditModal)}
      >
        <FTPEditModal elid={elidForEditModal} closeFn={() => setElidForEditModal(0)} />
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
        <FTPInstructionModal
          elid={elidForInstructionModal}
          closeFn={() => setElidForInstructionModal(0)}
        />
      </Backdrop>
    </>
  )
}
