import { useEffect, useState } from 'react'
import {
  BreadCrumbs,
  SharedHostingFilter,
  Pagination,
  SharedHostingTable,
  SharedHostingHistoryModal,
  SharedHostingEditModal,
  SharedHostingChangeTariffModal,
  HintWrapper,
  IconButton,
  ProlongModal,
  InstructionModal,
  Loader,
} from '@components'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import s from './SharedHosting.module.scss'
import { vhostSelectors, vhostOperations, vhostActions } from '@redux'
import * as route from '@src/routes'
import { checkServicesRights, useCancelRequest, usePageRender } from '@utils'
import cn from 'classnames'

export default function Component({ type }) {
  const isAllowedToRender = usePageRender('mainmenuservice', 'vhost')
  const [firstRender, setFirstRender] = useState(true)
  const { t, i18n } = useTranslation([
    'container',
    'other',
    'access_log',
    'virtual_hosting',
    'domains',
  ])
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const virtualHostingRenderData = useSelector(vhostSelectors.getVhostList)
  const vhostCount = useSelector(vhostSelectors.getVhostCount)
  const { signal, isLoading, setIsLoading } = useCancelRequest()

  const [p_cnt, setP_cnt] = useState(10)
  const [p_num, setP_num] = useState(1)

  const [selctedItem, setSelctedItem] = useState(null)
  const [activeServices, setActiveServices] = useState([])
  const [elidForProlongModal, setElidForProlongModal] = useState([])

  const [historyModal, setHistoryModal] = useState(false)
  const [historyList, setHistoryList] = useState([])
  const [historyItemCount, setHistoryItemCount] = useState(0)
  const [historyCurrentPage, setHistoryCurrentPage] = useState(1)

  const [prolongModal, setProlongModal] = useState(false)

  const [editModal, setEditModal] = useState(false)
  const [editData, setEditData] = useState(null)

  const [changeTariffModal, setChangeTariffModal] = useState(false)
  const [changeTariffData, setChangeTariffData] = useState(null)
  const [changeTariffInfoData, setChangeTariffInfoData] = useState(null)

  const [instructionModal, setInstructionModal] = useState(false)

  const [isFiltered, setIsFiltered] = useState(false)

  const conditionalRendering =
    type === 'vhost'
      ? {
          pageName: 'shared_hosting',
          title: t('burger_menu.services.services_list.virtual_hosting'),
          emptyImg: require('@images/services/virtual_hosting.webp'),
          emptyTitle: t('YOU DONT HAVE VIRTUAL HOSTING YET', { ns: 'virtual_hosting' }),
          emptyDesc: t('no services description', { ns: 'virtual_hosting' }),
        }
      : {
          pageName: 'wordpress',
          title: t('burger_menu.services.services_list.wordpress_hosting'),
          emptyImg: require('@images/services/wordpress.webp'),
          emptyTitle: t('YOU DONT HAVE WORDPRESS HOSTING YET', { ns: 'virtual_hosting' }),
          emptyDesc: t('no wordpress description', { ns: 'virtual_hosting' }),
        }

  useEffect(() => {
    if (!isAllowedToRender) {
      navigate(route.SERVICES, { replace: true })
    } else {
      resetFilterHandler()
      setFirstRender(false)
    }

    return () => {
      dispatch(vhostActions.setVhostCount(0))
      dispatch(vhostActions.setVhostList(null))
    }
  }, [])

  useEffect(() => {
    if (!firstRender) {
      const data = { p_num, p_cnt }
      dispatch(vhostOperations.getVhosts(data, type, signal, setIsLoading))
    }
  }, [p_num, p_cnt])

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

  const historyVhostHandler = () => {
    const data = {
      elid: selctedItem?.id?.$,
      elname: selctedItem?.name?.$,
      lang: 'en',
      p_num: historyCurrentPage,
    }
    dispatch(
      vhostOperations.getHistoryVhost(
        data,
        setHistoryModal,
        setHistoryList,
        setHistoryItemCount,
      ),
    )
  }

  const closeHistoryModalHandler = () => {
    setHistoryList([])
    setHistoryCurrentPage(1)
    setHistoryModal(false)
  }

  useEffect(() => {
    if (historyModal && historyList?.length > 0) {
      historyVhostHandler()
    }
  }, [historyCurrentPage])

  const instructionVhostHandler = () => setInstructionModal(selctedItem?.id?.$)

  const dispatchInstruction = setInstruction => {
    const data = {
      elid: selctedItem?.id?.$,
      elname: selctedItem?.name?.$,
      lang: i18n?.language,
    }
    dispatch(vhostOperations.getInsructionVhost(data, setInstruction))
  }

  const closeInstructionModalHandler = () => {
    setInstructionModal(false)
  }

  const platformVhostHandler = () => {
    const data = {
      elid: selctedItem?.id?.$,
      elname: selctedItem?.name?.$,
      lang: 'en',
    }
    dispatch(vhostOperations.openPlatformVhost(data))
  }

  const prolongVhostHandler = () => {
    setProlongModal(true)
  }

  const closeProlongModalHandler = () => {
    setProlongModal(false)
  }

  const editVhostHandler = (d = null) => {
    let data = {
      elid: selctedItem?.id?.$,
      elname: selctedItem?.name?.$,
      lang: 'en',
    }

    if (d) {
      data = { ...data, ...d }
    }
    dispatch(vhostOperations.editVhost(data, type, setEditModal, setEditData))
  }

  const closeEditModalHandler = () => {
    setEditData(null)
    setEditModal(false)
  }

  const sendEditVhostHandler = (values = {}) => {
    let data = {
      elid: selctedItem?.id?.$,
      lang: 'en',
      ...values,
    }

    dispatch(vhostOperations.editVhost(data, type, setEditModal, setEditData))
  }

  const changeTariffVhostHandler = () => {
    const data = {
      elid: selctedItem?.id?.$,
      elname: selctedItem?.name?.$,
    }

    dispatch(
      vhostOperations.changeTariffVhost(data, setChangeTariffModal, setChangeTariffData),
    )
  }

  const closeChangeTariffModalHandler = () => {
    setChangeTariffData(null)
    setChangeTariffInfoData(null)
    setChangeTariffModal(false)
  }

  const changeTariffInfoVhostHandler = pricelist => {
    const data = {
      elid: selctedItem?.id?.$,
      elname: selctedItem?.name?.$,
      pricelist,
      snext: 'ok',
      sok: 'ok',
    }

    dispatch(vhostOperations.changeTariffPriceListVhost(data, setChangeTariffInfoData))
  }

  const changeTariffSaveVhostHandler = pricelist => {
    const data = {
      elid: selctedItem?.id?.$,
      elname: selctedItem?.name?.$,
      pricelist,
      sok: 'ok',
    }

    dispatch(
      vhostOperations.changeTariffSaveVhost(
        data,
        type,
        setChangeTariffModal,
        setChangeTariffInfoData,
      ),
    )
  }

  let rights = checkServicesRights(virtualHostingRenderData?.vhostPageRights?.toolgrp)

  const getTotalPrice = () => {
    const list = activeServices.length >= 1 ? activeServices : []

    return list
      ?.reduce((totalPrice, server) => {
        return totalPrice + +server?.cost?.$?.trim()?.split(' ')?.[0]
      }, 0)
      ?.toFixed(2)
  }

  const getServerName = id => {
    if (typeof id === 'string') {
      return virtualHostingRenderData?.vhostList?.reduce((acc, el) => {
        if (el.id.$ === id) {
          acc = el.name.$
        }
        return acc
      }, '')
    } else if (Array.isArray(id)) {
      return id?.reduce((acc, idValue) => {
        acc.push(
          virtualHostingRenderData?.vhostList?.find(server => server.id.$ === idValue)
            .name.$,
        )

        return acc
      }, [])
    }
  }

  const resetFilterHandler = () => {
    const clearField = {
      id: '',
      ip: '',
      datacenter: '',
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
    }
    setP_num(1)
    setIsFiltered(false)
    setSelctedItem(null)
    setActiveServices([])
    dispatch(
      vhostOperations.getVhostFilters(
        { ...clearField, sok: 'ok' },
        true,
        type,
        signal,
        setIsLoading,
      ),
    )
  }

  const setFilterHandler = values => {
    setP_num(1)
    setIsFiltered(true)
    setSelctedItem(null)
    setActiveServices([])
    dispatch(
      vhostOperations.getVhostFilters(
        { ...values, sok: 'ok' },
        true,
        type,
        signal,
        setIsLoading,
      ),
    )
  }

  return (
    <>
      <div className={s.page_wrapper}>
        <BreadCrumbs pathnames={parseLocations()} />
        <h1 className={s.page_title}>
          {conditionalRendering.title}

          {virtualHostingRenderData?.vhostList?.length !== 0 && (
            <span className={s.title_count_services}>{` (${vhostCount})`}</span>
          )}
        </h1>
        <SharedHostingFilter
          p_cnt={p_cnt}
          isFiltered={isFiltered}
          isFilterActive={isFiltered || virtualHostingRenderData?.vhostList?.length > 0}
          rights={rights}
          activeServices={activeServices}
          setActiveServices={setActiveServices}
          hostingList={virtualHostingRenderData?.vhostList}
          resetFilter={resetFilterHandler}
          setFilter={setFilterHandler}
          type={type}
        />

        {virtualHostingRenderData?.vhostList?.length < 1 && isFiltered && (
          <div className={s.no_vds_wrapper}>
            <p className={s.not_found}>{t('nothing_found', { ns: 'access_log' })}</p>
          </div>
        )}

        {virtualHostingRenderData?.vhostList?.length < 1 &&
          !isFiltered &&
          virtualHostingRenderData?.vhostList && (
            <div className={s.no_service_wrapper}>
              <img
                src={conditionalRendering.emptyImg}
                alt="virtual_hosting"
                className={s.virt_host_img}
              />
              <p className={s.no_service_title}>{conditionalRendering.emptyTitle}</p>
              <p className={s.no_service_description}>{conditionalRendering.emptyDesc}</p>
            </div>
          )}

        {virtualHostingRenderData?.vhostList?.length > 0 && (
          <SharedHostingTable
            historyVhostHandler={historyVhostHandler}
            instructionVhostHandler={instructionVhostHandler}
            platformVhostHandler={platformVhostHandler}
            prolongVhostHandler={prolongVhostHandler}
            editVhostHandler={editVhostHandler}
            changeTariffVhostHandler={changeTariffVhostHandler}
            selctedItem={selctedItem}
            setSelctedItem={setSelctedItem}
            list={virtualHostingRenderData?.vhostList}
            rights={rights}
            activeServices={activeServices}
            setActiveServices={setActiveServices}
            elidForProlongModal={elidForProlongModal}
            setElidForProlongModal={setElidForProlongModal}
          />
        )}

        {vhostCount > 5 && (
          <div className={s.pagination}>
            <Pagination
              totalCount={Number(vhostCount)}
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
                onClick={() => {
                  setElidForProlongModal(activeServices?.map(item => item.id.$))
                  prolongVhostHandler()
                }}
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

        {historyModal && historyList?.length > 0 && (
          <SharedHostingHistoryModal
            historyList={historyList}
            name={selctedItem?.name?.$}
            closeModal={closeHistoryModalHandler}
            setHistoryCurrentPage={setHistoryCurrentPage}
            historyCurrentPage={historyCurrentPage}
            historyItemCount={historyItemCount}
            isOpen
          />
        )}

        {prolongModal && (
          <ProlongModal
            elidList={elidForProlongModal}
            closeModal={() => closeProlongModalHandler()}
            names={getServerName(elidForProlongModal)}
            pageName={conditionalRendering.pageName}
            isOpen
          />
        )}

        {editModal && editData && (
          <SharedHostingEditModal
            editData={editData}
            name={selctedItem?.name?.$}
            closeModal={closeEditModalHandler}
            sendEditVhostHandler={sendEditVhostHandler}
            editVhostHandler={editVhostHandler}
            isOpen
          />
        )}

        {changeTariffModal && changeTariffData && (
          <SharedHostingChangeTariffModal
            changeTariffData={changeTariffData}
            name={selctedItem?.name?.$}
            closeModal={closeChangeTariffModalHandler}
            changeTariffInfoVhostHandler={changeTariffInfoVhostHandler}
            changeTariffInfoData={changeTariffInfoData}
            changeTariffSaveVhostHandler={changeTariffSaveVhostHandler}
            isOpen
          />
        )}

        {!!instructionModal && (
          <InstructionModal
            title={`${t('Instruction', { ns: 'domains' })} ${selctedItem?.name?.$}`}
            dispatchInstruction={dispatchInstruction}
            closeModal={closeInstructionModalHandler}
            isOpen
          />
        )}
      </div>
      {isLoading && <Loader local shown={isLoading} />}
    </>
  )
}
