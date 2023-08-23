import { useEffect, useState } from 'react'
import {
  BreadCrumbs,
  VpnFilter,
  Pagination,
  VpnTable,
  SiteCareHistoryModal,
  SiteCareProlongModal,
  VpnEditModal,
  SiteCareDeleteModal,
  CheckBox,
  SiteCareBottomBar,
  InstructionModal,
  Loader,
} from '@components'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import s from './VPN.module.scss'
import { vpnOperations, vpnSelectors } from '@redux'
import { checkServicesRights, useCancelRequest, usePageRender } from '@utils'
import * as route from '@src/routes'

export default function Component() {
  const isAllowedToRender = usePageRender('mainmenuservice', 'vpn')

  const { t, i18n } = useTranslation(['container', 'other', 'access_log', 'domains'])
  const dispatch = useDispatch()

  const location = useLocation()
  const navigate = useNavigate()

  const vpnRenderData = useSelector(vpnSelectors.getVpnList)
  const siteCareCount = useSelector(vpnSelectors.getVpnCount)
  const { signal, isLoading, setIsLoading } = useCancelRequest()

  const [p_cnt, setP_cnt] = useState(10)
  const [p_num, setP_num] = useState(1)

  const [selctedItem, setSelctedItem] = useState([])

  const [historyModal, setHistoryModal] = useState(false)
  const [historyList, setHistoryList] = useState([])
  const [historyItemCount, setHistoryItemCount] = useState(0)
  const [historyCurrentPage, setHistoryCurrentPage] = useState(1)

  const [prolongModal, setProlongModal] = useState(false)
  const [prolongData, setProlongData] = useState(null)

  const [editModal, setEditModal] = useState(false)
  const [editData, setEditData] = useState(null)

  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteIds, setDeleteIds] = useState(null)

  const [instructionModal, setInstructionModal] = useState(0)

  const [isFiltered, setIsFiltered] = useState(false)

  const parseSelectedItemName = () => {
    let names = []
    selctedItem?.forEach(el => {
      names.push(el?.name?.$)
    })
    return names?.join(',')
  }

  const parseSelectedItemNameArr = () => {
    let names = []
    selctedItem?.forEach(el => {
      names.push(el?.name?.$)
    })
    return names
  }

  const parseSelectedItemId = () => {
    let id = []
    selctedItem?.forEach(el => {
      id.push(el?.id?.$)
    })
    return id?.join(', ')
  }

  useEffect(() => {
    const data = { p_num, p_cnt }
    dispatch(vpnOperations.getSiteCare(data, signal, setIsLoading))
  }, [p_num, p_cnt])

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

  const historySiteCareHandler = (elid = null) => {
    const data = {
      elid: elid || parseSelectedItemId(),
      elname: parseSelectedItemName(),
      lang: 'en',
      p_num: historyCurrentPage,
    }
    dispatch(
      vpnOperations.getHistorySiteCare(
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
      historySiteCareHandler()
    }
  }, [historyCurrentPage])

  const prolongSiteCareHandler = (elid = null) => {
    const data = {
      elid: elid || parseSelectedItemId(),
      elname: parseSelectedItemName(),
    }
    dispatch(vpnOperations.prolongSiteCare(data, setProlongModal, setProlongData))
  }

  const closeProlongModalHandler = () => {
    setProlongData(null)
    setProlongModal(false)
  }

  const prolongEditSiteCareHandler = (values = {}, elid = null) => {
    let data = {
      elid: elid || parseSelectedItemId(),
      p_num,
      ...values,
    }

    setSelctedItem([])

    dispatch(vpnOperations.prolongSiteCare(data, setProlongModal, setProlongData))
  }

  const editSiteCareHandler = (elid = null, d = null) => {
    let data = {
      elid: elid || parseSelectedItemId(),
      elname: parseSelectedItemName(),
    }

    if (d) {
      data = { ...data, ...d }
    }

    dispatch(vpnOperations.editSiteCare(data, setEditModal, setEditData))
  }

  const closeEditModalHandler = () => {
    setEditData(null)
    setEditModal(false)
  }

  const sendEditSiteCareHandler = (values = {}, elid = null) => {
    let data = {
      elid: elid || parseSelectedItemId(),
      lang: 'en',
      p_num,
      ...values,
    }

    setSelctedItem([])

    dispatch(vpnOperations.editSiteCare(data, setEditModal, setEditData))
  }

  const deleteSiteCareHandler = (elid = null) => {
    const data = {
      elid: elid || parseSelectedItemId(),
      p_num,
    }
    dispatch(vpnOperations.deleteSiteCare(data, setDeleteModal))
  }

  const instructionVhostHandler = id => setInstructionModal(id)

  const dispatchInstruction = setInstruction => {
    const data = {
      elid: instructionModal,
      lang: i18n?.language,
    }
    dispatch(vpnOperations.getInsruction(data, setInstruction))
  }

  const closeInstructionModalHandler = () => {
    setInstructionModal(0)
  }

  const setSelectedAll = val => {
    if (val) {
      setSelctedItem(vpnRenderData?.vpnList)
      return
    }
    setSelctedItem([])
  }

  let rights = checkServicesRights(vpnRenderData?.vpnPageRights?.toolgrp)

  useEffect(() => {
    if (!isAllowedToRender) {
      navigate(route.SERVICES, { replace: true })
    }
  }, [])

  const isAllActive = vpnRenderData?.vpnList?.length === selctedItem?.length
  const toggleIsAllActiveHandler = () => setSelectedAll(!isAllActive)

  return (
    <>
      <div className={s.page_wrapper}>
        <BreadCrumbs pathnames={parseLocations()} />
        <h1 className={s.page_title}>
          {t('VPN')}
          {vpnRenderData?.vpnList?.length !== 0 && (
            <span className={s.title_count_services}>{` (${siteCareCount})`}</span>
          )}
        </h1>

        <VpnFilter
          setIsFiltered={setIsFiltered}
          setSelctedItem={setSelctedItem}
          setCurrentPage={setP_num}
          p_cnt={p_cnt}
          isFiltered={isFiltered}
          isFilterActive={isFiltered || vpnRenderData?.vpnList?.length > 0}
          rights={rights}
          selctedItem={selctedItem}
          list={vpnRenderData?.vpnList}
          signal={signal}
          setIsLoading={setIsLoading}
        />

        {vpnRenderData?.vpnList?.length > 0 && (
          <div className={s.checkBoxColumn}>
            <CheckBox
              className={s.check_box}
              value={isAllActive}
              onClick={toggleIsAllActiveHandler}
            />
            <span>{t('Choose all', { ns: 'other' })}</span>
          </div>
        )}

        {vpnRenderData?.vpnList?.length < 1 && isFiltered && (
          <div className={s.no_vds_wrapper}>
            <p className={s.not_found}>{t('nothing_found', { ns: 'access_log' })}</p>
          </div>
        )}

        {vpnRenderData?.vpnList?.length < 1 &&
          !isFiltered &&
          vpnRenderData?.vpnList &&
          !isLoading && (
            <div className={s.no_service_wrapper}>
              <img
                src={require('@images/services/vpn.webp')}
                alt="sitecare"
                className={s.sitecare_img}
              />
              <p className={s.no_service_title}>
                {t('YOU DONT HAVE A VPN YET', { ns: 'other' })}
              </p>

              <p className={s.no_service_description}>
                {t('Protect yourself and your devices', {
                  ns: 'other',
                })}
              </p>
            </div>
          )}

        {vpnRenderData?.vpnList?.length > 0 && (
          <VpnTable
            historySiteCareHandler={historySiteCareHandler}
            prolongSiteCareHandler={prolongSiteCareHandler}
            editSiteCareHandler={editSiteCareHandler}
            deleteSiteCareHandler={() => setDeleteModal(true)}
            selctedItem={selctedItem}
            setSelctedItem={setSelctedItem}
            list={vpnRenderData?.vpnList}
            rights={rights}
            setDeleteIds={setDeleteIds}
            instructionVhostHandler={instructionVhostHandler}
          />
        )}

        <SiteCareBottomBar
          selctedItem={selctedItem}
          renewDomainHandler={prolongSiteCareHandler}
          deleteSiteCare={() => setDeleteModal(true)}
          setDeleteIds={setDeleteIds}
          rights={rights}
        />

        {siteCareCount > 5 && (
          <div className={s.pagination}>
            <Pagination
              totalCount={Number(siteCareCount)}
              currentPage={p_num}
              pageSize={p_cnt}
              onPageChange={page => setP_num(page)}
              onPageItemChange={items => setP_cnt(items)}
            />
          </div>
        )}

        {historyModal && historyList?.length > 0 && (
          <SiteCareHistoryModal
            historyList={historyList}
            name={parseSelectedItemNameArr()}
            closeModal={closeHistoryModalHandler}
            setHistoryCurrentPage={setHistoryCurrentPage}
            historyCurrentPage={historyCurrentPage}
            historyItemCount={historyItemCount}
            isOpen
          />
        )}

        {prolongModal && prolongData && (
          <SiteCareProlongModal
            prolongData={prolongData}
            name={parseSelectedItemNameArr()}
            closeModal={closeProlongModalHandler}
            prolongEditSiteCareHandler={prolongEditSiteCareHandler}
            isOpen
          />
        )}

        {editModal && editData && (
          <VpnEditModal
            editData={editData}
            name={parseSelectedItemNameArr()}
            closeModal={closeEditModalHandler}
            sendEditSiteCareHandler={sendEditSiteCareHandler}
            editSiteCareHandler={editSiteCareHandler}
            isOpen
          />
        )}

        {deleteModal && (
          <SiteCareDeleteModal
            closeModal={() => {
              setDeleteModal(false)
              setDeleteIds(null)
            }}
            deleteIds={deleteIds}
            deleteSiteCareHandler={deleteSiteCareHandler}
            name={parseSelectedItemNameArr()}
            isOpen
          />
        )}

        {!!instructionModal && (
          <InstructionModal
            title={t('Instruction', { ns: 'domains' })}
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
