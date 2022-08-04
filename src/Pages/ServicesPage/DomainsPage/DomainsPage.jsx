import React, { useEffect, useState } from 'react'
import {
  BreadCrumbs,
  DomainFilters,
  Pagination,
  DomainsTable,
  DomainsHistoryModal,
  DomainsWhoisModal,
  DomainsNSModal,
  DomainsEditModal,
  Backdrop,
  DomainsProlongModal,
} from '../../../Components'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import s from './DomainsPage.module.scss'
import { domainsOperations, domainsSelectors } from '../../../Redux'
import { checkServicesRights, usePageRender } from '../../../utils'
import * as route from '../../../routes'

export default function Component() {
  const isAllowedToRender = usePageRender('mainmenuservice', 'domain')

  const { t } = useTranslation(['container', 'trusted_users', 'access_log', 'domains'])
  const dispatch = useDispatch()

  const location = useLocation()
  const navigate = useNavigate()

  const domainsRenderData = useSelector(domainsSelectors.getDomainsList)
  const domainsCount = useSelector(domainsSelectors.getDomainsCount)

  const [p_cnt, setP_cnt] = useState(10)

  const [p_num, setP_num] = useState(1)
  const [selctedItem, setSelctedItem] = useState(null)

  const [historyModal, setHistoryModal] = useState(false)
  const [historyList, setHistoryList] = useState([])
  const [historyItemCount, setHistoryItemCount] = useState(0)
  const [historyCurrentPage, setHistoryCurrentPage] = useState(1)

  const [whoisModal, setWhoisModal] = useState(false)
  const [whoisData, setWhoisData] = useState(null)

  const [NSModal, setNSModal] = useState(false)
  const [NSData, setNSData] = useState(null)

  const [editModal, setEditModal] = useState(false)
  const [editData, setEditData] = useState(null)

  const [prolongModal, setProlongModal] = useState(false)
  const [prolongData, setProlongData] = useState(null)

  const [isFiltered, setIsFiltered] = useState(false)

  // const domainsTotalPrice = domainsRenderData?.domainsList?.reduce(
  //   (curServer, nextServer) => {
  //     return curServer + +nextServer?.item_cost?.$
  //   },
  //   0,
  // )

  useEffect(() => {
    const data = { p_num, p_cnt }
    dispatch(domainsOperations.getDomains(data))
  }, [p_num, p_cnt])

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

  const renewDomainHandler = () => {
    const data = {
      elid: selctedItem?.id?.$,
      elname: selctedItem?.name?.$,
    }
    dispatch(domainsOperations.renewService(data, setProlongModal, setProlongData))
  }

  const closeProlongModalHandler = () => {
    setProlongData(null)
    setProlongModal(false)
  }

  const prolongEditDomainHandler = (values = {}) => {
    let data = {
      elid: selctedItem?.id?.$,
      p_num,
      ...values,
    }

    dispatch(domainsOperations.renewService(data, setProlongModal, setProlongData))
  }

  const deleteDomainHandler = () => {
    const data = {
      elid: selctedItem?.id?.$,
    }
    dispatch(domainsOperations.deleteDomain(data))
  }

  const historyDomainHandler = () => {
    const data = {
      elid: selctedItem?.id?.$,
      elname: selctedItem?.name?.$,
      p_num: historyCurrentPage,
    }
    dispatch(
      domainsOperations.getHistoryDomain(
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
      historyDomainHandler()
    }
  }, [historyCurrentPage])

  const whoisDomainHandler = () => {
    const data = {
      elid: selctedItem?.id?.$,
      elname: selctedItem?.name?.$,
    }
    dispatch(domainsOperations.getWhoisDomain(data, setWhoisModal, setWhoisData))
  }

  const closeWhoisModalHandler = () => {
    setWhoisData(null)
    setWhoisModal(false)
  }

  const NSDomainHandler = () => {
    const data = {
      elid: selctedItem?.id?.$,
    }
    dispatch(domainsOperations.editDomainNS(data, setNSModal, setNSData))
  }

  const closeNSModalHandler = () => {
    setNSData(null)
    setNSModal(false)
  }

  const NSEditDomainHandler = (values = {}) => {
    let data = {
      elid: selctedItem?.id?.$,
      ...values,
    }

    dispatch(domainsOperations.editDomainNS(data, setNSModal, setNSData))
  }

  const editDomainHandler = () => {
    const data = {
      elid: selctedItem?.id?.$,
      elname: selctedItem?.name?.$,
    }
    dispatch(domainsOperations.editDomain(data, setEditModal, setEditData))
  }

  const closeEditModalHandler = () => {
    setEditModal(false)
    setEditData(null)
  }

  const editSaveDomainHandler = (values = {}, isOpenProfile) => {
    const data = {
      elid: selctedItem?.id?.$,
      elname: selctedItem?.name?.$,
      sok: 'ok',
      ...values,
    }
    dispatch(domainsOperations.editDomain(data, setEditModal, setEditData, isOpenProfile))
  }

  let rights = checkServicesRights(domainsRenderData?.domainsPageRights?.toolgrp)

  useEffect(() => {
    if (!isAllowedToRender) {
      navigate(route.SERVICES, { replace: true })
    }
  }, [])

  return (
    <>
      <BreadCrumbs pathnames={parseLocations()} />
      <h1 className={s.page_title}>
        {t('burger_menu.services.services_list.domains')}
        {domainsRenderData?.domainsList?.length !== 0 && (
          <span className={s.title_count_services}>{` (${domainsCount})`}</span>
        )}
      </h1>
      <DomainFilters
        setIsFiltered={setIsFiltered}
        selctedItem={selctedItem}
        setSelctedItem={setSelctedItem}
        setCurrentPage={setP_num}
        historyDomainHandler={historyDomainHandler}
        deleteDomainHandler={deleteDomainHandler}
        editDomainHandler={editDomainHandler}
        renewDomainHandler={renewDomainHandler}
        NSDomainHandler={NSDomainHandler}
        whoisDomainHandler={whoisDomainHandler}
        isFiltered={isFiltered}
        isFilterActive={isFiltered || domainsRenderData?.domainsList?.length > 0}
        rights={rights}
      />

      {domainsRenderData?.domainsList?.length < 1 && isFiltered && (
        <div className={s.no_vds_wrapper}>
          <p className={s.not_found}>{t('nothing_found', { ns: 'access_log' })}</p>
        </div>
      )}

      {domainsRenderData?.domainsList?.length < 1 &&
        !isFiltered &&
        domainsRenderData?.domainsList && (
          <div className={s.no_service_wrapper}>
            <img
              src={require('../../../images/services/no_domain.png')}
              alt="domains"
              className={s.domains_img}
            />
            <p className={s.no_service_title}>
              {t('YOU DO NOT HAVE A DOMAIN YET', { ns: 'domains' })}
            </p>
            <p className={s.no_service_description}>
              {t('no services description', { ns: 'domains' })}
            </p>
          </div>
        )}

      {domainsRenderData?.domainsList?.length > 0 && (
        <DomainsTable
          selctedItem={selctedItem}
          setSelctedItem={setSelctedItem}
          list={domainsRenderData?.domainsList}
          historyDomainHandler={historyDomainHandler}
          deleteDomainHandler={deleteDomainHandler}
          editDomainHandler={editDomainHandler}
          renewDomainHandler={renewDomainHandler}
          NSDomainHandler={NSDomainHandler}
          whoisDomainHandler={whoisDomainHandler}
          rights={rights}
        />
      )}

      {/* {Number(domainsCount) <= 30 &&
        widerThan1600 &&
        domainsRenderData?.domainsList?.length !== 0 && (
          <div className={s.total_pagination_price}>
            {t('Sum', { ns: 'other' })}: {`${+domainsTotalPrice?.toFixed(4)} EUR`}
          </div>
        )} */}

      <div className={s.pagination}>
        <Pagination
          currentPage={p_num}
          totalCount={Number(domainsCount)}
          pageSize={p_cnt}
          onPageChange={page => setP_num(page)}
          onPageItemChange={items => setP_cnt(items)}
        />
      </div>

      <Backdrop
        className={s.backdrop}
        isOpened={Boolean(prolongModal && prolongData)}
        onClick={closeProlongModalHandler}
      >
        <DomainsProlongModal
          prolongData={prolongData}
          name={selctedItem?.name?.$}
          closeProlongModalHandler={closeProlongModalHandler}
          prolongEditSiteCareHandler={prolongEditDomainHandler}
        />
      </Backdrop>

      <Backdrop
        className={s.backdrop}
        isOpened={Boolean(historyModal && historyList?.length > 0)}
        onClick={closeHistoryModalHandler}
      >
        <DomainsHistoryModal
          historyList={historyList}
          name={selctedItem?.name?.$}
          closeHistoryModalHandler={closeHistoryModalHandler}
          setHistoryCurrentPage={setHistoryCurrentPage}
          historyCurrentPage={historyCurrentPage}
          historyItemCount={historyItemCount}
        />
      </Backdrop>

      <Backdrop
        className={s.backdrop}
        isOpened={Boolean(whoisModal && whoisData)}
        onClick={closeWhoisModalHandler}
      >
        <DomainsWhoisModal
          whoisData={whoisData}
          name={selctedItem?.name?.$}
          closeWhoisModalHandler={closeWhoisModalHandler}
        />
      </Backdrop>

      <Backdrop
        className={s.backdrop}
        isOpened={Boolean(NSModal && NSData)}
        onClick={closeNSModalHandler}
      >
        <DomainsNSModal
          name={selctedItem?.name?.$}
          closeNSModalHandler={closeNSModalHandler}
          NSData={NSData}
          NSEditDomainHandler={NSEditDomainHandler}
        />
      </Backdrop>

      <Backdrop
        className={s.backdrop}
        isOpened={Boolean(editModal && editData)}
        onClick={closeEditModalHandler}
      >
        <DomainsEditModal
          name={selctedItem?.name?.$}
          closeEditModalHandler={closeEditModalHandler}
          editSaveDomainHandler={editSaveDomainHandler}
          editData={editData}
        />
      </Backdrop>
    </>
  )
}
