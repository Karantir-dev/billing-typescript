import React, { useEffect, useState } from 'react'
import {
  BreadCrumbs,
  SiteCareFilter,
  Pagination,
  SiteCareTable,
  SiteCareHistoryModal,
  SiteCareProlongModal,
  SiteCareEditModal,
  SiteCareDeleteModal,
  Backdrop,
} from '../../../Components'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import s from './SiteCare.module.scss'
import { siteCareOperations, siteCareSelectors } from '../../../Redux'
import { checkServicesRights, usePageRender } from '../../../utils'
import * as route from '../../../routes'

export default function Component() {
  const isAllowedToRender = usePageRender('mainmenuservice', 'zabota-o-servere')

  const { t, i18n } = useTranslation(['container', 'other', 'access_log'])
  const dispatch = useDispatch()

  const location = useLocation()
  const navigate = useNavigate()

  const sitecareRenderData = useSelector(siteCareSelectors.getSiteCareList)
  const siteCareCount = useSelector(siteCareSelectors.getSiteCareCount)

  const [currentPage, setCurrentPage] = useState(1)
  const [selctedItem, setSelctedItem] = useState(null)

  const [historyModal, setHistoryModal] = useState(false)
  const [historyList, setHistoryList] = useState([])
  const [historyItemCount, setHistoryItemCount] = useState(0)
  const [historyCurrentPage, setHistoryCurrentPage] = useState(1)

  const [prolongModal, setProlongModal] = useState(false)
  const [prolongData, setProlongData] = useState(null)

  const [editModal, setEditModal] = useState(false)
  const [editData, setEditData] = useState(null)

  const [deleteModal, setDeleteModal] = useState(false)

  const [isFiltered, setIsFiltered] = useState(false)

  useEffect(() => {
    const data = { p_num: currentPage }
    dispatch(siteCareOperations.getSiteCare(data))
  }, [currentPage])

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

  const historySiteCareHandler = () => {
    const data = {
      elid: selctedItem?.id?.$,
      elname: selctedItem?.name?.$,
      lang: i18n?.language,
      p_num: historyCurrentPage,
    }
    dispatch(
      siteCareOperations.getHistorySiteCare(
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

  const prolongSiteCareHandler = () => {
    const data = {
      elid: selctedItem?.id?.$,
      elname: selctedItem?.name?.$,
      lang: i18n?.language,
    }
    dispatch(siteCareOperations.prolongSiteCare(data, setProlongModal, setProlongData))
  }

  const closeProlongModalHandler = () => {
    setProlongData(null)
    setProlongModal(false)
  }

  const prolongEditSiteCareHandler = (values = {}) => {
    let data = {
      elid: selctedItem?.id?.$,
      lang: i18n?.language,
      p_num: currentPage,
      ...values,
    }

    dispatch(siteCareOperations.prolongSiteCare(data, setProlongModal, setProlongData))
  }

  const editSiteCareHandler = () => {
    const data = {
      elid: selctedItem?.id?.$,
      elname: selctedItem?.name?.$,
      lang: i18n?.language,
    }
    dispatch(siteCareOperations.editSiteCare(data, setEditModal, setEditData))
  }

  const closeEditModalHandler = () => {
    setEditData(null)
    setEditModal(false)
  }

  const sendEditSiteCareHandler = (values = {}) => {
    let data = {
      elid: selctedItem?.id?.$,
      lang: i18n?.language,
      p_num: currentPage,
      ...values,
    }

    dispatch(siteCareOperations.editSiteCare(data, setEditModal, setEditData))
  }

  const deleteSiteCareHandler = () => {
    const data = {
      elid: selctedItem?.id?.$,
      p_num: currentPage,
    }

    dispatch(siteCareOperations.deleteSiteCare(data, setDeleteModal))
  }

  let rights = checkServicesRights(sitecareRenderData?.siteCarePageRights?.toolgrp)

  useEffect(() => {
    if (!isAllowedToRender) {
      navigate(route.SERVICES, { replace: true })
    }
  }, [])

  return (
    <div className={s.page_wrapper}>
      <BreadCrumbs pathnames={parseLocations()} />
      <h1 className={s.page_title}>
        {t('burger_menu.services.services_list.wetsite_care')}
      </h1>
      <SiteCareFilter
        setIsFiltered={setIsFiltered}
        setSelctedItem={setSelctedItem}
        historySiteCareHandler={historySiteCareHandler}
        prolongSiteCareHandler={prolongSiteCareHandler}
        editSiteCareHandler={editSiteCareHandler}
        deleteSiteCareHandler={() => setDeleteModal(true)}
        selctedItem={selctedItem}
        setCurrentPage={setCurrentPage}
        isFiltered={isFiltered}
        isFilterActive={isFiltered || sitecareRenderData?.siteCareList?.length > 0}
        rights={rights}
      />

      {sitecareRenderData?.siteCareList?.length < 1 && isFiltered && (
        <div className={s.no_vds_wrapper}>
          <p className={s.not_found}>{t('nothing_found', { ns: 'access_log' })}</p>
        </div>
      )}

      {sitecareRenderData?.siteCareList?.length < 1 &&
        !isFiltered &&
        sitecareRenderData?.siteCareList && (
          <div className={s.no_service_wrapper}>
            <img
              src={require('../../../images/services/care.webp')}
              alt="sitecare"
              className={s.sitecare_img}
            />
            <p className={s.no_service_title}>
              {t('YOU DONT HAVE A WEBSITE YET', { ns: 'other' })}
            </p>
            <p className={s.no_service_description}>
              {t('no services sitecare description', { ns: 'other' })}
            </p>
          </div>
        )}

      {sitecareRenderData?.siteCareList?.length > 0 && (
        <SiteCareTable
          historySiteCareHandler={historySiteCareHandler}
          prolongSiteCareHandler={prolongSiteCareHandler}
          editSiteCareHandler={editSiteCareHandler}
          deleteSiteCareHandler={() => setDeleteModal(true)}
          selctedItem={selctedItem}
          setSelctedItem={setSelctedItem}
          list={sitecareRenderData?.siteCareList}
          rights={rights}
        />
      )}

      {sitecareRenderData?.siteCareList?.length !== 0 && (
        <div className={s.pagination}>
          <Pagination
            currentPage={currentPage}
            totalCount={Number(siteCareCount)}
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
        <SiteCareHistoryModal
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
        isOpened={Boolean(prolongModal && prolongData)}
        onClick={closeProlongModalHandler}
      >
        <SiteCareProlongModal
          prolongData={prolongData}
          name={selctedItem?.name?.$}
          closeProlongModalHandler={closeProlongModalHandler}
          prolongEditSiteCareHandler={prolongEditSiteCareHandler}
        />
      </Backdrop>

      <Backdrop
        className={s.backdrop}
        isOpened={Boolean(editModal && editData)}
        onClick={closeEditModalHandler}
      >
        <SiteCareEditModal
          editData={editData}
          name={selctedItem?.name?.$}
          closeEditModalHandler={closeEditModalHandler}
          sendEditSiteCareHandler={sendEditSiteCareHandler}
        />
      </Backdrop>

      <Backdrop
        className={s.backdrop}
        isOpened={Boolean(deleteModal)}
        onClick={() => setDeleteModal(false)}
      >
        <SiteCareDeleteModal
          closeDeleteModalHandler={() => setDeleteModal(false)}
          deleteSiteCareHandler={deleteSiteCareHandler}
          name={selctedItem?.name?.$}
        />
      </Backdrop>
    </div>
  )
}
