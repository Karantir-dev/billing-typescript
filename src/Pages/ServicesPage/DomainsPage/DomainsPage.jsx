import { useEffect, useState } from 'react'
import {
  BreadCrumbs,
  DomainFilters,
  Pagination,
  DomainsTable,
  DomainsHistoryModal,
  DomainsWhoisModal,
  DomainsNSModal,
  DomainsEditModal,
  DomainsProlongModal,
  DomainBottomBar,
  CheckBox,
  Loader,
} from '@components'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import s from './DomainsPage.module.scss'
import { billingOperations, domainsOperations, domainsSelectors } from '@redux'
import { checkServicesRights, useCancelRequest, usePageRender } from '@utils'
import * as route from '@src/routes'

export default function Component() {
  const isAllowedToRender = usePageRender('mainmenuservice', 'domain', true, 4)

  const { t } = useTranslation(['container', 'trusted_users', 'access_log', 'domains'])
  const dispatch = useDispatch()

  const location = useLocation()
  const navigate = useNavigate()

  const { signal, isLoading, setIsLoading } = useCancelRequest()

  const domainsRenderData = useSelector(domainsSelectors.getDomainsList)
  const domainsCount = useSelector(domainsSelectors.getDomainsCount)

  const [p_cnt, setP_cnt] = useState(10)
  const [p_num, setP_num] = useState(1)

  const [selctedItem, setSelctedItem] = useState([])

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

  const [unpaidItems, setUnpaidItems] = useState([])

  useEffect(() => {
    const data = { p_num, p_cnt }
    dispatch(domainsOperations.getDomains(data, signal, setIsLoading))
  }, [p_num, p_cnt])

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

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

  const renewDomainHandler = (elid = null) => {
    const data = {
      elid: elid || parseSelectedItemId(),
      elname: parseSelectedItemName(),
    }
    dispatch(
      domainsOperations.renewService(
        data,
        setProlongModal,
        setProlongData,
        signal,
        setIsLoading,
      ),
    )
  }

  const closeProlongModalHandler = () => {
    setProlongData(null)
    setProlongModal(false)
  }

  const prolongEditDomainHandler = (values = {}, elid = null) => {
    let data = {
      elid: elid || parseSelectedItemId(),
      p_num,
      ...values,
    }

    dispatch(
      domainsOperations.renewService(
        data,
        setProlongModal,
        setProlongData,
        signal,
        setIsLoading,
      ),
    )
  }

  const deleteDomainHandler = (elid = null) => {
    const data = {
      elid: elid || parseSelectedItemId(),
    }
    dispatch(domainsOperations.deleteDomain(data, signal, setIsLoading))
  }

  const historyDomainHandler = (elid = null) => {
    const data = {
      elid: elid || parseSelectedItemId(),
      elname: parseSelectedItemName(),
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

  const whoisDomainHandler = (elid = null) => {
    const data = {
      elid: elid || parseSelectedItemId(),
      elname: parseSelectedItemName(),
    }
    dispatch(domainsOperations.getWhoisDomain(data, setWhoisModal, setWhoisData))
  }

  const closeWhoisModalHandler = () => {
    setWhoisData(null)
    setWhoisModal(false)
  }

  const NSDomainHandler = (elid = null) => {
    const data = {
      elid: elid || parseSelectedItemId(),
    }

    dispatch(
      domainsOperations.editDomainNS(data, setNSModal, setNSData, signal, setIsLoading),
    )
  }

  const closeNSModalHandler = () => {
    setNSData(null)
    setNSModal(false)
  }

  const NSEditDomainHandler = (values = {}, elid = null) => {
    let data = {
      elid: elid || parseSelectedItemId(),
      ...values,
    }

    dispatch(
      domainsOperations.editDomainNS(data, setNSModal, setNSData, signal, setIsLoading),
    )
  }

  const editDomainHandler = (elid = null, d = null) => {
    let data = {
      elid: elid || parseSelectedItemId(),
      elname: parseSelectedItemName(),
    }

    if (d) {
      data = { ...data, ...d }
    }
    dispatch(domainsOperations.editDomain(data, setEditModal, setEditData, true))
  }

  const closeEditModalHandler = () => {
    setEditModal(false)
    setEditData(null)
  }

  const editSaveDomainHandler = (values = {}, isOpenProfile, elid = null) => {
    const data = {
      elid: elid || parseSelectedItemId(),
      elname: parseSelectedItemName(),
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

    dispatch(billingOperations.getUnpaidOrders(setUnpaidItems, signal))
  }, [])

  const setSelectedAll = val => {
    if (val) {
      setSelctedItem(domainsRenderData?.domainsList)
      return
    }
    setSelctedItem([])
  }

  const isAllActive = domainsRenderData?.domainsList?.length === selctedItem?.length
  const toggleIsAllActiveHandler = () => setSelectedAll(!isAllActive)

  return (
    <div>
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
        p_cnt={p_cnt}
        setSelctedItem={setSelctedItem}
        list={domainsRenderData?.domainsList}
        setCurrentPage={setP_num}
        historyDomainHandler={historyDomainHandler}
        deleteDomainHandler={deleteDomainHandler}
        whoisDomainHandler={whoisDomainHandler}
        isFiltered={isFiltered}
        isFilterActive={isFiltered || domainsRenderData?.domainsList?.length > 0}
        rights={rights}
        signal={signal}
        setIsLoading={setIsLoading}
      />
      {domainsRenderData?.domainsList?.length > 0 && (
        <div className={s.checkBoxColumn}>
          <CheckBox
            className={s.check_box}
            value={isAllActive}
            onClick={toggleIsAllActiveHandler}
          />
          <span>{t('Choose all', { ns: 'other' })}</span>
        </div>
      )}

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
              src={require('@images/services/no_domain.png')}
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
          unpaidItems={unpaidItems}
        />
      )}

      <DomainBottomBar
        selctedItem={selctedItem}
        editDomainHandler={editDomainHandler}
        renewDomainHandler={renewDomainHandler}
        NSDomainHandler={NSDomainHandler}
        rights={rights}
      />

      {domainsCount > 5 && (
        <div className={s.pagination}>
          <Pagination
            totalCount={Number(domainsCount)}
            currentPage={p_num}
            pageSize={p_cnt}
            onPageChange={page => {
              setP_num(page)
              setSelctedItem([])
            }}
            onPageItemChange={items => {
              setP_cnt(items)
              setSelctedItem([])
            }}
          />
        </div>
      )}

      {!!prolongModal && !!prolongData && (
        <DomainsProlongModal
          prolongData={prolongData}
          names={parseSelectedItemNameArr()}
          closeModal={closeProlongModalHandler}
          prolongEditSiteCareHandler={prolongEditDomainHandler}
          isOpen
        />
      )}

      {historyModal && historyList?.length > 0 && (
        <DomainsHistoryModal
          historyList={historyList}
          closeModal={closeHistoryModalHandler}
          setHistoryCurrentPage={setHistoryCurrentPage}
          historyCurrentPage={historyCurrentPage}
          historyItemCount={historyItemCount}
          isOpen
        />
      )}

      {!!whoisModal && !!whoisData && (
        <DomainsWhoisModal
          whoisData={whoisData}
          closeModal={closeWhoisModalHandler}
          isOpen
        />
      )}

      {!!NSModal && !!NSData && (
        <DomainsNSModal
          names={parseSelectedItemNameArr()}
          closeModal={closeNSModalHandler}
          NSData={NSData}
          NSEditDomainHandler={NSEditDomainHandler}
          isOpen
        />
      )}

      {!!editModal && !!editData && (
        <DomainsEditModal
          names={parseSelectedItemNameArr()}
          editSaveDomainHandler={editSaveDomainHandler}
          editData={editData}
          editDomainHandler={editDomainHandler}
          closeModal={closeEditModalHandler}
          isOpen
        />
      )}

      {isLoading && <Loader local shown={isLoading} />}
    </div>
  )
}
