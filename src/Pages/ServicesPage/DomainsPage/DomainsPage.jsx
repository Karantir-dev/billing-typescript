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
} from '../../../Components'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import s from './DomainsPage.module.scss'
import { domainsOperations, domainsSelectors } from '../../../Redux'

export default function Component() {
  const { t, i18n } = useTranslation(['container', 'trusted_users'])
  const dispatch = useDispatch()

  const location = useLocation()

  const domainsList = useSelector(domainsSelectors.getDomainsList)
  const domainsCount = useSelector(domainsSelectors.getDomainsCount)

  const [currentPage, setCurrentPage] = useState(1)
  const [selctedItem, setSelctedItem] = useState(null)

  const [historyModal, setHistoryModal] = useState(false)
  const [historyList, setHistoryList] = useState([])

  const [whoisModal, setWhoisModal] = useState(false)
  const [whoisData, setWhoisData] = useState(null)

  const [NSModal, setNSModal] = useState(false)
  const [NSData, setNSData] = useState(null)

  const [editModal, setEditModal] = useState(false)
  const [editData, setEditData] = useState(null)

  useEffect(() => {
    const data = { p_num: currentPage }
    dispatch(domainsOperations.getDomains(data))
  }, [currentPage])

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
    dispatch(domainsOperations.renewService(data))
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
      lang: i18n?.language,
    }
    dispatch(domainsOperations.getHistoryDomain(data, setHistoryModal, setHistoryList))
  }

  const closeHistoryModalHandler = () => {
    setHistoryList([])
    setHistoryModal(false)
  }

  const whoisDomainHandler = () => {
    const data = {
      elid: selctedItem?.id?.$,
      elname: selctedItem?.name?.$,
      lang: i18n?.language,
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
      lang: i18n?.language,
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
      lang: i18n?.language,
      ...values,
    }

    dispatch(domainsOperations.editDomainNS(data, setNSModal, setNSData))
  }

  const editDomainHandler = () => {
    const data = {
      elid: selctedItem?.id?.$,
      elname: selctedItem?.name?.$,
      lang: i18n?.language,
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
      lang: i18n?.language,
      sok: 'ok',
      ...values,
    }
    dispatch(domainsOperations.editDomain(data, setEditModal, setEditData, isOpenProfile))
  }

  return (
    <>
      <BreadCrumbs pathnames={parseLocations()} />
      <h1 className={s.page_title}>{t('burger_menu.services.services_list.domains')}</h1>
      <DomainFilters
        selctedItem={selctedItem}
        setCurrentPage={setCurrentPage}
        historyDomainHandler={historyDomainHandler}
        deleteDomainHandler={deleteDomainHandler}
        editDomainHandler={editDomainHandler}
        renewDomainHandler={renewDomainHandler}
        NSDomainHandler={NSDomainHandler}
        whoisDomainHandler={whoisDomainHandler}
      />
      <DomainsTable
        selctedItem={selctedItem}
        setSelctedItem={setSelctedItem}
        list={domainsList}
        historyDomainHandler={historyDomainHandler}
        deleteDomainHandler={deleteDomainHandler}
        editDomainHandler={editDomainHandler}
        renewDomainHandler={renewDomainHandler}
        NSDomainHandler={NSDomainHandler}
        whoisDomainHandler={whoisDomainHandler}
      />
      {domainsList.length !== 0 && (
        <div className={s.pagination}>
          <Pagination
            currentPage={currentPage}
            totalCount={Number(domainsCount)}
            pageSize={30}
            onPageChange={page => setCurrentPage(page)}
          />
        </div>
      )}

      <Backdrop
        className={s.backdrop}
        isOpened={Boolean(historyModal && historyList?.length > 0)}
        onClick={closeHistoryModalHandler}
      >
        <DomainsHistoryModal
          historyList={historyList}
          name={selctedItem?.name?.$}
          closeHistoryModalHandler={closeHistoryModalHandler}
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
