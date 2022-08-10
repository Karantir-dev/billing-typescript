import React, { useEffect, useState } from 'react'
import {
  BreadCrumbs,
  SharedHostingFilter,
  Pagination,
  SharedHostingTable,
  SharedHostingHistoryModal,
  // SharedHostingProlongModal,
  SharedHostingEditModal,
  SharedHostingChangeTariffModal,
  SharedHostingInstructionModal,
  Backdrop,
  HintWrapper,
  IconButton,
  ProlongModal,
} from '../../../Components'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import s from './SharedHosting.module.scss'
import { vhostSelectors, vhostOperations } from '../../../Redux'
import * as route from '../../../routes'
import { checkServicesRights, usePageRender } from '../../../utils'
import { useMediaQuery } from 'react-responsive'
import cn from 'classnames'

export default function Component() {
  const isAllowedToRender = usePageRender('mainmenuservice', 'vhost')

  const { t, i18n } = useTranslation([
    'container',
    'other',
    'access_log',
    'virtual_hosting',
  ])
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const virtualHostingRenderData = useSelector(vhostSelectors.getVhostList)
  const vhostCount = useSelector(vhostSelectors.getVhostCount)

  const [currentPage, setCurrentPage] = useState(1)
  const [selctedItem, setSelctedItem] = useState(null)
  const [activeServices, setActiveServices] = useState([])
  const [elidForProlongModal, setElidForProlongModal] = useState([])

  const [historyModal, setHistoryModal] = useState(false)
  const [historyList, setHistoryList] = useState([])
  const [historyItemCount, setHistoryItemCount] = useState(0)
  const [historyCurrentPage, setHistoryCurrentPage] = useState(1)

  const [prolongModal, setProlongModal] = useState(false)
  // const [prolongData, setProlongData] = useState(null)

  const [editModal, setEditModal] = useState(false)
  const [editData, setEditData] = useState(null)

  const [changeTariffModal, setChangeTariffModal] = useState(false)
  const [changeTariffData, setChangeTariffData] = useState(null)
  const [changeTariffInfoData, setChangeTariffInfoData] = useState(null)

  const [instructionModal, setInstructionModal] = useState(false)
  const [instructionData, setInstructionData] = useState(null)

  const [isFiltered, setIsFiltered] = useState(false)
  const widerThan1600 = useMediaQuery({ query: '(min-width: 1600px)' })

  const hostingsTotalPrice = virtualHostingRenderData?.vhostList?.reduce(
    (curServer, nextServer) => {
      return curServer + +nextServer?.item_cost?.$
    },
    0,
  )

  useEffect(() => {
    const data = { p_num: currentPage }
    dispatch(vhostOperations.getVhosts(data))
  }, [currentPage])

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

  const historyVhostHandler = () => {
    const data = {
      elid: selctedItem?.id?.$,
      elname: selctedItem?.name?.$,
      lang: i18n?.language,
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

  const instructionVhostHandler = () => {
    const data = {
      elid: selctedItem?.id?.$,
      elname: selctedItem?.name?.$,
      lang: i18n?.language,
    }
    dispatch(
      vhostOperations.getInsructionVhost(data, setInstructionModal, setInstructionData),
    )
  }

  const closeInstructionModalHandler = () => {
    setInstructionData(null)
    setInstructionModal(false)
  }

  const platformVhostHandler = () => {
    const data = {
      elid: selctedItem?.id?.$,
      elname: selctedItem?.name?.$,
      lang: i18n?.language,
    }
    dispatch(vhostOperations.openPlatformVhost(data))
  }

  const prolongVhostHandler = () => {
    setProlongModal(true)
    // const data = {
    //   elid: selctedItem?.id?.$,
    //   elname: selctedItem?.name?.$,
    //   lang: i18n?.language,
    // }
    // dispatch(vhostOperations.prolongVhost(data, setProlongModal, setProlongData))
  }

  const closeProlongModalHandler = () => {
    // setProlongData(null)
    setProlongModal(false)
  }

  // const prolongEditVhostHandler = (values = {}) => {
  //   let data = {
  //     elid: selctedItem?.id?.$,
  //     lang: i18n?.language,
  //     ...values,
  //   }

  //   dispatch(vhostOperations.prolongVhost(data, setProlongModal, setProlongData))
  // }

  const editVhostHandler = () => {
    const data = {
      elid: selctedItem?.id?.$,
      elname: selctedItem?.name?.$,
      lang: i18n?.language,
    }
    dispatch(vhostOperations.editVhost(data, setEditModal, setEditData))
  }

  const closeEditModalHandler = () => {
    setEditData(null)
    setEditModal(false)
  }

  const sendEditVhostHandler = (values = {}) => {
    let data = {
      elid: selctedItem?.id?.$,
      lang: i18n?.language,
      ...values,
    }

    dispatch(vhostOperations.editVhost(data, setEditModal, setEditData))
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
        setChangeTariffModal,
        setChangeTariffInfoData,
      ),
    )
  }

  let rights = checkServicesRights(virtualHostingRenderData?.vhostPageRights?.toolgrp)

  useEffect(() => {
    if (!isAllowedToRender) {
      navigate(route.SERVICES, { replace: true })
    }
  }, [])

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

  return (
    <div className={s.page_wrapper}>
      <BreadCrumbs pathnames={parseLocations()} />
      <h1 className={s.page_title}>
        {t('burger_menu.services.services_list.virtual_hosting')}

        {virtualHostingRenderData?.vhostList?.length !== 0 && (
          <span className={s.title_count_services}>{` (${vhostCount})`}</span>
        )}
      </h1>
      <SharedHostingFilter
        setIsFiltered={setIsFiltered}
        setSelctedItem={setSelctedItem}
        setCurrentPage={setCurrentPage}
        isFiltered={isFiltered}
        isFilterActive={isFiltered || virtualHostingRenderData?.vhostList?.length > 0}
        rights={rights}
        activeServices={activeServices}
        setActiveServices={setActiveServices}
        hostingList={virtualHostingRenderData?.vhostList}
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
              src={require('../../../images/services/virtual_hosting.webp')}
              alt="virtual_hosting"
              className={s.virt_host_img}
            />
            <p className={s.no_service_title}>
              {t('YOU DONT HAVE VIRTUAL HOSTING YET', { ns: 'virtual_hosting' })}
            </p>
            <p className={s.no_service_description}>
              {t('no services description', { ns: 'virtual_hosting' })}
            </p>
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

      {virtualHostingRenderData?.vhostList?.length !== 0 && (
        <div className={s.pagination}>
          <Pagination
            currentPage={currentPage}
            totalCount={Number(vhostCount)}
            pageSize={30}
            totalPrice={widerThan1600 && +hostingsTotalPrice?.toFixed(4)}
            onPageChange={page => setCurrentPage(page)}
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

      <Backdrop
        className={s.backdrop}
        isOpened={Boolean(historyModal && historyList?.length > 0)}
        onClick={closeHistoryModalHandler}
      >
        <SharedHostingHistoryModal
          historyList={historyList}
          name={selctedItem?.name?.$}
          closeHistoryModalHandler={closeHistoryModalHandler}
          setHistoryCurrentPage={setHistoryCurrentPage}
          historyCurrentPage={historyCurrentPage}
          historyItemCount={historyItemCount}
        />
      </Backdrop>

      {/* <Backdrop
        className={s.backdrop}
        isOpened={Boolean(prolongModal && prolongData)}
        onClick={closeProlongModalHandler}
      >
        <SharedHostingProlongModal
          prolongData={prolongData}
          name={selctedItem?.name?.$}
          closeProlongModalHandler={closeProlongModalHandler}
          prolongEditVhostHandler={prolongEditVhostHandler}
        />
      </Backdrop> */}

      <Backdrop
        className={s.backdrop}
        isOpened={Boolean(prolongModal)}
        onClick={closeProlongModalHandler}
      >
        <ProlongModal
          elidList={elidForProlongModal}
          closeFn={() => closeProlongModalHandler()}
          names={getServerName(elidForProlongModal)}
          pageName="shared_hosting"
        />
      </Backdrop>

      <Backdrop
        className={s.backdrop}
        isOpened={Boolean(editModal && editData)}
        onClick={closeEditModalHandler}
      >
        <SharedHostingEditModal
          editData={editData}
          name={selctedItem?.name?.$}
          closeEditModalHandler={closeEditModalHandler}
          sendEditVhostHandler={sendEditVhostHandler}
        />
      </Backdrop>

      <Backdrop
        className={s.backdrop}
        isOpened={Boolean(changeTariffModal && changeTariffData)}
        onClick={closeChangeTariffModalHandler}
      >
        <SharedHostingChangeTariffModal
          changeTariffData={changeTariffData}
          name={selctedItem?.name?.$}
          closeChangeTariffModalHandler={closeChangeTariffModalHandler}
          changeTariffInfoVhostHandler={changeTariffInfoVhostHandler}
          changeTariffInfoData={changeTariffInfoData}
          changeTariffSaveVhostHandler={changeTariffSaveVhostHandler}
        />
      </Backdrop>

      <Backdrop
        className={s.backdrop}
        isOpened={Boolean(instructionModal && instructionData)}
        onClick={closeInstructionModalHandler}
      >
        <SharedHostingInstructionModal
          instructionData={instructionData}
          name={selctedItem?.name?.$}
          closeInstructionModalHandler={closeInstructionModalHandler}
        />
      </Backdrop>
    </div>
  )
}
