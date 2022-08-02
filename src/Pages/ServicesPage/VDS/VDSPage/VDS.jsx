import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import { useDispatch, useSelector } from 'react-redux'
import * as route from '../../../../routes'
import cn from 'classnames'
import {
  Button,
  IconButton,
  VDSList,
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
  HintWrapper,
  CheckBox,
} from '../../../../Components'
import { actions, dedicOperations, selectors, vdsOperations } from '../../../../Redux'
import no_vds from '../../../../images/services/no_vds.png'
import { usePageRender } from '../../../../utils'

import s from './VDS.module.scss'

export default function VDS() {
  const widerThan1600 = useMediaQuery({ query: '(min-width: 1600px)' })
  const dispatch = useDispatch()
  const { t } = useTranslation(['vds', 'other', 'access_log'])
  const navigate = useNavigate()
  const servicesInput = useRef()

  const isAllowedToRender = usePageRender('mainmenuservice', 'vds')

  const [rights, setRights] = useState({})
  const [servers, setServers] = useState([])

  const [activeServices, setActiveServices] = useState([])

  const [filtersState, setFiltersState] = useState()
  const [filtersListState, setfiltersListState] = useState()

  const [elidForEditModal, setIdForEditModal] = useState(0)
  const [idForDeleteModal, setIdForDeleteModal] = useState([])
  const [idForProlong, setIdForProlong] = useState([])
  const [idForPassChange, setIdForPassChange] = useState([])
  const [idForReboot, setIdForReboot] = useState([])
  const [idForInstruction, setIdForInstruction] = useState('')
  const [idForHistory, setIdForHistory] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [elemsTotal, setElemsTotal] = useState(0)
  const [servicesPerPage, _setServicesPerPage] = useState('5')
  const [controledQuantityInput, setControledQuantityInput] = useState('5')
  const setServicesPerPage = value => {
    _setServicesPerPage(value)
    setControledQuantityInput(value)
    setCurrentPage(1)
  }

  const [firstRender, setFirstRender] = useState(true)
  const [isFiltersOpened, setIsFiltersOpened] = useState(false)
  const [isFiltered, setIsFiltered] = useState(false)
  const [isSearchMade, setIsSearchMade] = useState(false)

  const getTotalPrice = () => {
    const list = activeServices.length > 1 ? activeServices : servers

    return list
      ?.reduce((totalPrice, server) => {
        return totalPrice + +server?.cost?.$?.trim()?.split(' ')?.[0]
      }, 0)
      ?.toFixed(2)
  }

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
      setActiveServices([])
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
          setServicesPerPage,
        ),
      )

      setFirstRender(false)
    }
  }, [])

  function onPressEnter(event) {
    if (event.code === 'Enter') {
      dispatch(
        vdsOperations.getVDS({
          setServers,
          setRights,
          setElemsTotal,
          controledQuantityInput,
          setServicesPerPage,
        }),
      )
    }
  }

  useEffect(() => {
    if (document.activeElement === servicesInput.current) {
      window.addEventListener('keydown', onPressEnter)
    }

    return () => {
      window.removeEventListener('keydown', onPressEnter)
    }
  }, [controledQuantityInput])

  const deleteServer = () => {
    dispatch(
      vdsOperations.deleteVDS(
        idForDeleteModal,
        setServers,
        () => setIdForDeleteModal([]),
        setElemsTotal,
      ),
    )
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

  const getServerName = id => {
    if (typeof id === 'string') {
      return servers?.reduce((acc, el) => {
        if (el.id.$ === id) {
          acc = el.name.$
        }
        return acc
      }, '')
    } else if (Array.isArray(id)) {
      return id?.reduce((acc, idValue) => {
        acc.push(servers.find(server => server.id.$ === idValue).name.$)

        return acc
      }, [])
    }
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
    setActiveServices([])
  }

  const goToPanelFn = id => {
    dispatch(dedicOperations.goToPanelFn(id))
  }

  const isLoading = useSelector(selectors.getIsLoadding)

  return (
    <>
      <BreadCrumbs pathnames={location?.pathname.split('/')} />

      <h2 className={s.title}>
        {t('servers_title')}
        {servers?.length !== 0 && (
          <span className={s.title_count_services}>{` (${elemsTotal})`}</span>
        )}
      </h2>
      <div className={s.extra_tools_wrapper}>
        <div className={s.tools_wrapper}>
          <Button
            disabled={!rights?.new}
            className={s.btn_order}
            isShadow
            type="button"
            label={t('to_order', { ns: 'other' })}
            onClick={() => navigate(route.VDS_ORDER)}
          />

          <div className={s.filter_wrapper}>
            <IconButton
              className={cn(s.tools_icon, { [s.filtered]: isFiltered })}
              onClick={() => setIsFiltersOpened(true)}
              icon="filter"
              disabled={(servers?.length < 1 && !isSearchMade) || !rights?.filter}
            />
            <Portal>
              <div
                className={cn(s.filter_backdrop, { [s.opened]: isFiltersOpened })}
              ></div>
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
        </div>

        {!widerThan1600 && (
          <div className={s.main_checkbox}>
            <CheckBox
              className={s.check_box}
              initialState={activeServices.length === servers.length}
              func={isChecked => {
                isChecked ? setActiveServices([]) : setActiveServices(servers)
              }}
            />
            <span>{t('Choose all', { ns: 'other' })}</span>
          </div>
        )}
      </div>

      <VDSList
        servers={servers}
        rights={rights}
        servicesPerPage={servicesPerPage}
        setIdForEditModal={setIdForEditModal}
        setIdForDeleteModal={setIdForDeleteModal}
        setIdForPassChange={setIdForPassChange}
        setIdForReboot={setIdForReboot}
        setIdForProlong={setIdForProlong}
        setIdForHistory={setIdForHistory}
        setIdForInstruction={setIdForInstruction}
        goToPanelFn={goToPanelFn}
        activeServices={activeServices}
        setActiveServices={setActiveServices}
      />

      {servers.length > 0 && (
        <div className={s.pagination_wrapper}>
          <div className={s.services_per_page}>
            <label htmlFor="services_count">
              {t('services_per_page', { ns: 'other' })}
            </label>

            <div className={s.input_wrapper}>
              <input
                ref={servicesInput}
                className={s.services_per_page_input}
                value={controledQuantityInput}
                onChange={event => setControledQuantityInput(event.target.value)}
                onBlur={event => {
                  if (event.target.value < 5) setControledQuantityInput('5')
                }}
                id="services_count"
                type="number"
                placeholder="5"
                min={5}
              />
            </div>
          </div>

          {+servicesPerPage <= +elemsTotal && (
            <Pagination
              className={s.pagination}
              currentPage={currentPage}
              totalCount={Number(elemsTotal)}
              pageSize={+servicesPerPage}
              onPageChange={page => setCurrentPage(page)}
              hideExtraInfo
            />
          )}
        </div>
      )}

      {servers.length > 0 && (
        <div className={s.tools_footer}>
          {activeServices.length > 1 && (
            <>
              <div className={s.buttons_wrapper}>
                <HintWrapper label={t('delete', { ns: 'other' })}>
                  <IconButton
                    className={s.tools_icon}
                    onClick={() =>
                      setIdForDeleteModal(activeServices.map(server => server.id.$))
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
                <HintWrapper label={t('password_change')}>
                  <IconButton
                    className={s.tools_icon}
                    disabled={
                      activeServices.some(
                        server => server?.allow_changepassword?.$ !== 'on',
                      ) || !rights?.changepassword
                    }
                    // onClick={() => setIdForPassChange(activeServices)}
                    icon="passChange"
                  />
                </HintWrapper>

                <HintWrapper label={t('reload')}>
                  <IconButton
                    className={s.tools_icon}
                    disabled={
                      activeServices.some(server => server?.show_reboot?.$ !== 'on') ||
                      !rights?.reboot
                    }
                    // onClick={() => setIdForReboot(activeServices)}
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
                      setIdForProlong(activeServices.map(server => server.id.$))
                    }
                    // onClick={() => setIdForProlong(activeServices)}
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

      {servers?.length < 1 && !isSearchMade && !isLoading && (
        <div className={s.no_vds_wrapper}>
          <img className={s.no_vds} src={no_vds} alt="no_vds" />
          <p className={s.no_vds_title}>{t('no_servers_yet')}</p>
          <p>{t('no_servers_yet_desc')}</p>
        </div>
      )}

      {servers?.length < 1 && isSearchMade && (
        <div className={s.no_vds_wrapper}>
          <p className={s.not_found}>{t('nothing_found', { ns: 'access_log' })}</p>
        </div>
      )}

      <Backdrop
        className={s.backdrop}
        isOpened={Boolean(elidForEditModal)}
        onClick={() => setIdForEditModal(0)}
      >
        <EditModal elid={elidForEditModal} closeFn={() => setIdForEditModal(0)} />
      </Backdrop>

      <Backdrop
        isOpened={idForDeleteModal.length > 0}
        onClick={() => setIdForDeleteModal([])}
      >
        <DeleteModal
          names={getServerName(idForDeleteModal)}
          deleteFn={deleteServer}
          closeFn={() => setIdForDeleteModal([])}
        />
      </Backdrop>

      <Backdrop
        isOpened={idForPassChange.length > 0}
        onClick={() => setIdForPassChange('')}
      >
        <VDSPasswordChange
          id={idForPassChange}
          name={getServerName(idForPassChange)}
          closeFn={() => setIdForPassChange('')}
        />
      </Backdrop>

      <Backdrop isOpened={idForReboot.length > 0} onClick={() => setIdForReboot('')}>
        <VdsRebootModal
          id={idForReboot}
          name={getServerName(idForReboot)}
          closeFn={() => setIdForReboot('')}
        />
      </Backdrop>

      <Backdrop isOpened={idForProlong.length > 0} onClick={() => setIdForProlong('')}>
        <ProlongModal
          elidList={idForProlong}
          closeFn={() => setIdForProlong('')}
          pageName="vds"
          names={getServerName(idForProlong)}
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
          name={getServerName(idForHistory)}
          closeFn={() => setIdForHistory('')}
        />
      </Backdrop>
    </>
  )
}
