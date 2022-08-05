import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import { useDispatch } from 'react-redux'
import * as route from '../../../../routes'
import cn from 'classnames'
import {
  Button,
  IconButton,
  VDSList,
  HintWrapper,
  EditModal,
  Backdrop,
  BreadCrumbs,
  DeleteModal,
  VDSPasswordChange,
  VdsRebootModal,
  ProlongModal,
  FiltersModal,
  VdsInstructionModal,
  DedicsHistoryModal,
  Pagination,
  Portal,
} from '../../../../Components'
import { actions, dedicOperations, selectors, vdsOperations } from '../../../../Redux'
import no_vds from '../../../../images/services/no_vds.png'
import { usePageRender } from '../../../../utils'

import s from './VDS.module.scss'
import { useSelector } from 'react-redux'

export default function VDS() {
  const widerThan1600 = useMediaQuery({ query: '(min-width: 1600px)' })
  const dispatch = useDispatch()
  const { t } = useTranslation(['vds', 'other', 'access_log'])
  const navigate = useNavigate()
  const isLoading = useSelector(selectors.getIsLoadding)

  const isAllowedToRender = usePageRender('mainmenuservice', 'vds')

  const [rights, setRights] = useState({})
  const [servers, setServers] = useState([])
  const [activeServer, setActiveServer] = useState(null)
  // const [activeServices, setActiveServices] = useState([])
  const [elidForEditModal, setElidForEditModal] = useState(0)
  const [idForDeleteModal, setIdForDeleteModal] = useState('')
  const [idForProlong, setIdForProlong] = useState('')
  const [idForPassChange, setIdForPassChange] = useState('')
  const [idForReboot, setIdForReboot] = useState('')
  const [idForInstruction, setIdForInstruction] = useState('')
  const [idForHistory, setIdForHistory] = useState('')
  const [isFiltersOpened, setIsFiltersOpened] = useState(false)
  const [filtersState, setFiltersState] = useState()
  const [filtersListState, setfiltersListState] = useState()
  const [isSearchMade, setIsSearchMade] = useState(false)

  // const [serversCost, setServersCost] = useState(0)

  const serversTotalPrice = servers?.reduce((curServer, nextServer) => {
    return curServer + +nextServer?.item_cost?.$
  }, 0)

  const [currentPage, setCurrentPage] = useState(1)
  const [elemsTotal, setElemsTotal] = useState(0)

  const [firstRender, setFirstRender] = useState(true)

  const [isFiltered, setIsFiltered] = useState(false)

  useEffect(() => {
    if (isFiltersOpened) {
      dispatch(actions.disableScrolling())
    } else {
      dispatch(actions.enableScrolling())
    }
  }, [isFiltersOpened])

  useEffect(() => {
    if (!firstRender) {
      dispatch(vdsOperations.getVDS({ setServers, setRights, currentPage }))
    }
  }, [currentPage])

  useEffect(() => {
    if (!isAllowedToRender) {
      navigate(route.SERVICES, { replace: true })
    } else {
      dispatch(
        vdsOperations.setVdsFilters(
          null,
          setFiltersState,
          setfiltersListState,
          setServers,
          setRights,
          setElemsTotal,
        ),
      )

      setFirstRender(false)
    }
  }, [])

  const deleteServer = () => {
    dispatch(
      vdsOperations.deleteVDS(idForDeleteModal, setServers, () =>
        setIdForDeleteModal(''),
      ),
    )
    setActiveServer(null)
  }

  const resetFilterHandler = () => {
    setIsFiltered(false)
    setCurrentPage(1)
    dispatch(
      vdsOperations.setVdsFilters(
        null,
        setFiltersState,
        setfiltersListState,
        setServers,
        setRights,
        setElemsTotal,
      ),
    )
    setIsFiltersOpened(false)
  }

  const getSarverName = id => {
    return servers?.reduce((acc, el) => {
      if (el.id.$ === id) {
        acc = el.name.$
      }
      return acc
    }, '')
  }

  const handleSetFilters = values => {
    setCurrentPage(1)
    dispatch(
      vdsOperations.setVdsFilters(
        values,
        setFiltersState,
        setfiltersListState,
        setServers,
        setRights,
        setElemsTotal,
      ),
    )
    setIsSearchMade(true)
    setIsFiltered(true)
    setIsFiltersOpened(false)
  }

  const goToPanel = id => {
    dispatch(dedicOperations.goToPanel(id))
  }

  return (
    <>
      <BreadCrumbs pathnames={location?.pathname.split('/')} />

      <h2 className={s.title}>
        {t('servers_title')}
        {servers?.length !== 0 && (
          <span className={s.title_count_services}>{` (${elemsTotal})`}</span>
        )}
      </h2>
      <div className={s.tools_wrapper}>
        <div className={s.filter_wrapper}>
          <IconButton
            className={cn(s.tools_icon, { [s.filtered]: isFiltered })}
            onClick={() => setIsFiltersOpened(true)}
            icon="filter"
            disabled={(servers?.length < 1 && !isSearchMade) || !rights?.filter}
          />
          <Portal className={cn()}>
            <div className={cn(s.filter_backdrop, { [s.opened]: isFiltersOpened })}></div>
          </Portal>

          <FiltersModal
            isOpened={isFiltersOpened}
            closeFn={() => setIsFiltersOpened(false)}
            handleSubmit={handleSetFilters}
            resetFilterHandler={resetFilterHandler}
            filters={filtersState}
            filtersList={filtersListState}
          />
        </div>

        {widerThan1600 && (
          <>
            <div className={s.edit_wrapper}>
              <HintWrapper label={t('edit', { ns: 'other' })}>
                <IconButton
                  className={s.tools_icon}
                  onClick={() => setElidForEditModal(activeServer?.id?.$)}
                  disabled={
                    (activeServer?.status?.$ !== '3' &&
                      activeServer?.status?.$ !== '2') ||
                    !rights?.edit
                    // ||
                    // activeServices?.length >= 2
                  }
                  icon="edit"
                />
              </HintWrapper>

              <HintWrapper label={t('delete', { ns: 'other' })}>
                <IconButton
                  className={s.tools_icon}
                  onClick={() => setIdForDeleteModal(activeServer?.id?.$)}
                  disabled={
                    !activeServer ||
                    activeServer?.status?.$ === '5' ||
                    // activeServer?.item_status.$ === '5_open' ||
                    activeServer?.scheduledclose?.$ === 'on' ||
                    !rights?.delete
                  }
                  icon="delete"
                />
              </HintWrapper>
            </div>

            <HintWrapper label={t('password_change')}>
              <IconButton
                className={s.tools_icon}
                disabled={
                  activeServer?.allow_changepassword?.$ !== 'on' ||
                  !rights?.changepassword
                }
                onClick={() => setIdForPassChange(activeServer?.id?.$)}
                icon="passChange"
              />
            </HintWrapper>

            <HintWrapper label={t('reload')}>
              <IconButton
                className={s.tools_icon}
                disabled={activeServer?.show_reboot?.$ !== 'on' || !rights?.reboot}
                onClick={() => setIdForReboot(activeServer?.id?.$)}
                icon="reload"
              />
            </HintWrapper>

            <HintWrapper label={t('ip_addresses')}>
              <IconButton
                className={s.tools_icon}
                disabled={
                  activeServer?.status?.$ === '5' ||
                  activeServer?.has_ip_pricelist?.$ !== 'on' ||
                  !rights?.ip
                  // ||
                  // activeServices?.length >= 2
                }
                onClick={() =>
                  navigate(route.VDS_IP, { state: { id: activeServer?.id?.$ } })
                }
                icon="ip"
              />
            </HintWrapper>

            <HintWrapper label={t('prolong')}>
              <IconButton
                className={s.tools_icon}
                disabled={
                  (activeServer?.status?.$ !== '3' && activeServer?.status?.$ !== '2') ||
                  activeServer?.item_status?.$.trim() === 'Suspended by Administrator' ||
                  !rights?.prolong
                }
                onClick={() => setIdForProlong(activeServer?.id?.$)}
                icon="clock"
              />
            </HintWrapper>

            <HintWrapper label={t('history')}>
              <IconButton
                className={s.tools_icon}
                onClick={() => setIdForHistory(activeServer?.id?.$)}
                disabled={
                  (activeServer?.status?.$ !== '3' && activeServer?.status?.$ !== '2') ||
                  !rights?.history
                  //  ||
                  // activeServices?.length >= 2
                }
                icon="refund"
              />
            </HintWrapper>

            <HintWrapper label={t('instruction')}>
              <IconButton
                className={s.tools_icon}
                disabled={
                  (activeServer?.status?.$ !== '3' && activeServer?.status?.$ !== '2') ||
                  !rights?.instruction
                  // ||
                  // activeServices?.length >= 2
                }
                onClick={() => setIdForInstruction(activeServer?.id?.$)}
                icon="info"
              />
            </HintWrapper>

            <HintWrapper label={t('go_to_panel')}>
              <IconButton
                className={s.tools_icon}
                onClick={() => goToPanel(activeServer?.id?.$)}
                disabled={
                  activeServer?.transition?.$ !== 'on' ||
                  activeServer?.status?.$ !== '2' ||
                  !rights?.gotoserver
                  //  ||
                  // activeServices?.length >= 2
                }
                icon="exitSign"
              />
            </HintWrapper>
          </>
        )}

        <Button
          disabled={!rights?.new}
          className={s.btn_order}
          isShadow
          type="button"
          label={t('to_order', { ns: 'other' })}
          onClick={() => navigate(route.VDS_ORDER)}
        />
      </div>

      {servers?.length < 1 && !isSearchMade && filtersListState && !isLoading && (
        <div className={s.no_vds_wrapper}>
          <img className={s.no_vds} src={no_vds} alt="no_vds" />
          <p className={s.no_vds_title}>{t('no_servers_yet')}</p>

          <div className={s.discount_wrapper}>
            <p className={s.discount_percent}>
              {t('DISCOUNT -20% ON VDS/VPS', { ns: 'other' })}
            </p>
            <p className={s.discount_desc}>
              {t('You can get a discount using a promo code', { ns: 'other' })}:
              <span className={s.promocode}>0-ZM-VS8</span>
            </p>
          </div>

          <p>{t('no_servers_yet_desc')}</p>
        </div>
      )}

      {servers?.length < 1 && isSearchMade && (
        <div className={s.no_vds_wrapper}>
          <p className={s.not_found}>{t('nothing_found', { ns: 'access_log' })}</p>
        </div>
      )}

      <VDSList
        servers={servers}
        rights={rights}
        activeServerID={activeServer?.id?.$}
        setElidForEditModal={setElidForEditModal}
        setActiveServer={setActiveServer}
        setIdForDeleteModal={setIdForDeleteModal}
        setIdForPassChange={setIdForPassChange}
        setIdForReboot={setIdForReboot}
        setIdForProlong={setIdForProlong}
        setIdForHistory={setIdForHistory}
        setIdForInstruction={setIdForInstruction}
        goToPanel={goToPanel}
        activeServer={activeServer}
        // activeServices={activeServices}
        // setActiveServices={setActiveServices}
      />

      {Number(elemsTotal) <= 30 && widerThan1600 && servers?.length !== 0 && (
        <div className={s.total_pagination_price}>
          {t('Sum', { ns: 'other' })}: {`${+serversTotalPrice.toFixed(4)} EUR`}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalCount={Number(elemsTotal)}
        pageSize={30}
        totalPrice={widerThan1600 && serversTotalPrice}
        onPageChange={page => setCurrentPage(page)}
      />

      <Backdrop
        className={s.backdrop}
        isOpened={Boolean(elidForEditModal)}
        onClick={() => setElidForEditModal(0)}
      >
        <EditModal elid={elidForEditModal} closeFn={() => setElidForEditModal(0)} />
      </Backdrop>

      <Backdrop
        isOpened={Boolean(idForDeleteModal)}
        onClick={() => setIdForDeleteModal('')}
      >
        <DeleteModal
          name={getSarverName(idForDeleteModal)}
          deleteFn={deleteServer}
          closeFn={() => setIdForDeleteModal('')}
        />
      </Backdrop>

      <Backdrop
        isOpened={Boolean(idForPassChange)}
        onClick={() => setIdForPassChange('')}
      >
        <VDSPasswordChange
          id={idForPassChange}
          name={getSarverName(idForPassChange)}
          closeFn={() => setIdForPassChange('')}
        />
      </Backdrop>

      <Backdrop isOpened={Boolean(idForReboot)} onClick={() => setIdForReboot('')}>
        <VdsRebootModal
          id={idForReboot}
          name={getSarverName(idForReboot)}
          closeFn={() => setIdForReboot('')}
        />
      </Backdrop>

      <Backdrop isOpened={Boolean(idForProlong)} onClick={() => setIdForProlong('')}>
        <ProlongModal
          elid={idForProlong}
          closeFn={() => setIdForProlong('')}
          pageName="vds"
        />
      </Backdrop>

      <Backdrop
        isOpened={Boolean(idForInstruction)}
        onClick={() => setIdForInstruction('')}
      >
        <VdsInstructionModal
          elid={idForInstruction}
          closeFn={() => setIdForInstruction('')}
        />
      </Backdrop>

      <Backdrop isOpened={Boolean(idForHistory)} onClick={() => setIdForHistory('')}>
        <DedicsHistoryModal
          elid={idForHistory}
          name={getSarverName(idForHistory)}
          closeFn={() => setIdForHistory('')}
        />
      </Backdrop>
    </>
  )
}
