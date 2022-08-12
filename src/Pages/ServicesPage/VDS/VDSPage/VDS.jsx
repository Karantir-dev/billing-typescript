import React, { useEffect, useState } from 'react'
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

  const [elemsTotal, setElemsTotal] = useState(0)

  const [p_num, setP_num] = useState(1)
  const [p_cnt, setP_cnt] = useState(10)

  const itemWithPenalty = activeServices.find(item => item?.item_real_status?.$ === '3')

  const filteredElidForProlongModal = itemWithPenalty
    ? idForProlong?.filter(el => el !== itemWithPenalty.id.$)
    : idForProlong

  if (itemWithPenalty) {
    filteredElidForProlongModal.unshift(itemWithPenalty?.id?.$)
  }

  const [firstRender, setFirstRender] = useState(true)
  const [isFiltersOpened, setIsFiltersOpened] = useState(false)
  const [isFiltered, setIsFiltered] = useState(false)
  const [isSearchMade, setIsSearchMade] = useState(false)

  const getTotalPrice = () => {
    const list = activeServices.length > 0 ? activeServices : []

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
      dispatch(
        vdsOperations.getVDS({ setServers, setRights, setElemsTotal, p_num, p_cnt }),
      )
      setActiveServices([])
    }
  }, [p_num, p_cnt])

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
          setP_cnt,
          p_cnt,
        ),
      )

      setFirstRender(false)
    }
  }, [])

  const deleteServer = () => {
    dispatch(
      vdsOperations.deleteVDS(
        idForDeleteModal,
        setServers,
        () => setIdForDeleteModal([]),
        setElemsTotal,
      ),
    )
    setActiveServices([])
  }

  const resetFilterHandler = () => {
    setIsFiltered(false)
    setP_num(1)
    dispatch(
      vdsOperations.setVdsFilters(
        null,
        setFiltersState,
        setfiltersListState,
        setServers,
        setRights,
        setElemsTotal,
        null,
        p_cnt,
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
    setP_num(1)
    dispatch(
      vdsOperations.setVdsFilters(
        values,
        setFiltersState,
        setfiltersListState,
        setServers,
        setRights,
        setElemsTotal,
        null,
        p_cnt,
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

        {!widerThan1600 && servers.length > 0 && (
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

      {elemsTotal > 5 && (
        <Pagination
          className={s.pagination}
          currentPage={p_num}
          totalCount={Number(elemsTotal)}
          onPageChange={page => {
            setP_num(page)
            setActiveServices([])
          }}
          pageSize={p_cnt}
          onPageItemChange={items => {
            setP_cnt(items)
            setActiveServices([])
          }}
        />
      )}

      <div
        className={cn({
          [s.tools_footer]: true,
          [s.active_footer]: activeServices.length > 0,
        })}
      >
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
                activeServices.some(server => server?.allow_changepassword?.$ !== 'on') ||
                !rights?.changepassword
              }
              onClick={() =>
                setIdForPassChange(activeServices.map(server => server.id.$))
              }
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
              onClick={() => setIdForReboot(activeServices.map(server => server.id.$))}
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
              onClick={() => setIdForProlong(activeServices.map(server => server.id.$))}
              // onClick={() => setIdForProlong(activeServices)}
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

      {servers?.length < 1 && !isSearchMade && !isLoading && (
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

      <Backdrop isOpened={idForPassChange.length > 0}>
        <VDSPasswordChange
          id={idForPassChange}
          names={getServerName(idForPassChange)}
          closeFn={() => setIdForPassChange([])}
        />
      </Backdrop>

      <Backdrop isOpened={idForReboot.length > 0} onClick={() => setIdForReboot([])}>
        <VdsRebootModal
          id={idForReboot}
          names={getServerName(idForReboot)}
          closeFn={() => setIdForReboot([])}
        />
      </Backdrop>

      <Backdrop isOpened={idForProlong.length > 0} onClick={() => setIdForProlong([])}>
        <ProlongModal
          elidList={filteredElidForProlongModal}
          closeFn={() => setIdForProlong([])}
          pageName="vds"
          names={getServerName(idForProlong)}
          itemsList={servers.filter(item => idForProlong.includes(item.id.$))}
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
