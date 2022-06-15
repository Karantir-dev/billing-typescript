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
} from '../../../Components'
import dedicOperations from '../../../Redux/dedicatedServers/dedicOperations'
import { useDispatch, useSelector } from 'react-redux'
import ftpSelectors from '../../../Redux/ftp/ftpSelectors'
import EditServerModal from '../../../Components/Services/DedicatedServers/EditServerModal/EditServerModal'
import ProlongModal from '../../../Components/Services/DedicatedServers/ProlongModal/ProlongModal'
import DedicsHistoryModal from '../../../Components/Services/DedicatedServers/DedicsHistoryModal/DedicsHistoryModal'
import InstructionModal from '../../../Components/Services/DedicatedServers/InstructionModal/InstructionModal'
import RebootModal from '../../../Components/Services/DedicatedServers/RebootModal/RebootModal'
import DedicFiltersModal from '../../../Components/Services/DedicatedServers/DedicFiltersModal/DedicFiltersModal'

import s from './FTP.module.scss'
import { ftpOperations } from '../../../Redux'
import FTPList from '../../../Components/Services/ftp/FTPList/FTPList'

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
  const [elidForRebootModal, setElidForRebootModal] = useState(0)
  const [filterModal, setFilterModal] = useState(false)
  const [filters, setFilters] = useState([])

  const location = useLocation()

  console.log(ftpList)

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
    // setCurrentPage(1)
    setFilterModal(false)
    // dispatch(
    //   dedicOperations.getDedicFilters(setFilters, { ...clearField, sok: 'ok' }, true),
    // )
    console.log('submit for edition')
  }

  const setFilterHandler = values => {
    // setCurrentPage(1)
    setFilterModal(false)
    dispatch(dedicOperations.getDedicFilters(setFilters, { ...values, sok: 'ok' }, true))
  }

  useEffect(() => {
    dispatch(ftpOperations.getFTPList())
    // dispatch(dedicOperations.getDedicFilters(setFilters))
  }, [])

  return (
    <>
      <BreadCrumbs pathnames={parseLocations()} />
      <h2 className={s.page_title}>
        {t('burger_menu.services.services_list.external_ftp', { ns: 'container' })}
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
