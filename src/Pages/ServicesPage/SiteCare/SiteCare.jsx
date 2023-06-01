import { useEffect, useState } from 'react'
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
  CheckBox,
  SiteCareBottomBar,
} from '@components'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import s from './SiteCare.module.scss'
import { selectors, siteCareOperations, siteCareSelectors } from '@redux'
import { checkServicesRights, usePageRender } from '@utils'
import * as route from '@src/routes'

export default function Component() {
  const isAllowedToRender = usePageRender('mainmenuservice', 'zabota-o-servere')

  const { t } = useTranslation(['container', 'other', 'access_log'])
  const dispatch = useDispatch()

  const location = useLocation()
  const navigate = useNavigate()

  const sitecareRenderData = useSelector(siteCareSelectors.getSiteCareList)
  const siteCareCount = useSelector(siteCareSelectors.getSiteCareCount)
  const isLoading = useSelector(selectors.getIsLoadding)

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
    dispatch(siteCareOperations.getSiteCare(data))
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

  const prolongSiteCareHandler = (elid = null) => {
    const data = {
      elid: elid || parseSelectedItemId(),
      elname: parseSelectedItemName(),
    }
    dispatch(siteCareOperations.prolongSiteCare(data, setProlongModal, setProlongData))
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

    dispatch(siteCareOperations.prolongSiteCare(data, setProlongModal, setProlongData))
  }

  const editSiteCareHandler = (elid = null, d = null) => {
    let data = {
      elid: elid || parseSelectedItemId(),
      elname: parseSelectedItemName(),
    }

    if (d) {
      data = { ...data, ...d }
    }

    dispatch(siteCareOperations.editSiteCare(data, setEditModal, setEditData))
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

    dispatch(siteCareOperations.editSiteCare(data, setEditModal, setEditData))
  }

  const deleteSiteCareHandler = (elid = null) => {
    const data = {
      elid: elid || parseSelectedItemId(),
      p_num,
    }

    // setSelctedItem([])
    dispatch(siteCareOperations.deleteSiteCare(data, setDeleteModal))
  }

  const setSelectedAll = val => {
    if (val) {
      setSelctedItem(sitecareRenderData?.siteCareList)
      return
    }
    setSelctedItem([])
  }

  let rights = checkServicesRights(sitecareRenderData?.siteCarePageRights?.toolgrp)

  useEffect(() => {
    if (!isAllowedToRender) {
      navigate(route.SERVICES, { replace: true })
    }
  }, [])

  const isAllActive = sitecareRenderData?.siteCareList?.length === selctedItem?.length
  const toggleIsAllActiveHandler = () => setSelectedAll(!isAllActive)

  return (
    <div className={s.page_wrapper}>
      <BreadCrumbs pathnames={parseLocations()} />
      <h1 className={s.page_title}>
        {t('burger_menu.services.services_list.wetsite_care')}
        {sitecareRenderData?.siteCareList?.length !== 0 && (
          <span className={s.title_count_services}>{` (${siteCareCount})`}</span>
        )}
      </h1>

      <SiteCareFilter
        setIsFiltered={setIsFiltered}
        setSelctedItem={setSelctedItem}
        setCurrentPage={setP_num}
        p_cnt={p_cnt}
        isFiltered={isFiltered}
        isFilterActive={isFiltered || sitecareRenderData?.siteCareList?.length > 0}
        rights={rights}
        selctedItem={selctedItem}
        list={sitecareRenderData?.siteCareList}
      />

      {sitecareRenderData?.siteCareList?.length > 0 && (
        <div className={s.checkBoxColumn}>
          <CheckBox
            className={s.check_box}
            value={isAllActive}
            onClick={toggleIsAllActiveHandler}
          />
          <span>{t('Choose all', { ns: 'other' })}</span>
        </div>
      )}

      {sitecareRenderData?.siteCareList?.length < 1 && isFiltered && (
        <div className={s.no_vds_wrapper}>
          <p className={s.not_found}>{t('nothing_found', { ns: 'access_log' })}</p>
        </div>
      )}

      {sitecareRenderData?.siteCareList?.length < 1 &&
        !isFiltered &&
        sitecareRenderData?.siteCareList &&
        !isLoading && (
          <div className={s.no_service_wrapper}>
            <img
              src={require('@images/services/no_site_care.png')}
              alt="sitecare"
              className={s.sitecare_img}
            />
            <p className={s.no_service_title}>
              {t('YOU DONT HAVE A WEBSITE YET', { ns: 'other' })}
            </p>

            <div className={s.discount_wrapper}>
              <p className={s.discount_percent}>
                {t('DISCOUNT -20% FOR THE FIRST MONTH FOR THE SERVICE CARE OF THE SITE', {
                  ns: 'other',
                })}
              </p>
              <p className={s.discount_desc}>
                {t('You can get a discount using a promo code', { ns: 'other' })}:
                <span className={s.promocode}>ST-ZM-CR</span>
              </p>
            </div>

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
          setDeleteIds={setDeleteIds}
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

      <Backdrop
        className={s.backdrop}
        isOpened={Boolean(historyModal && historyList?.length > 0)}
        onClick={closeHistoryModalHandler}
      >
        <SiteCareHistoryModal
          historyList={historyList}
          name={parseSelectedItemNameArr()}
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
          name={parseSelectedItemNameArr()}
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
          name={parseSelectedItemNameArr()}
          closeEditModalHandler={closeEditModalHandler}
          sendEditSiteCareHandler={sendEditSiteCareHandler}
          editSiteCareHandler={editSiteCareHandler}
        />
      </Backdrop>

      <Backdrop
        className={s.backdrop}
        isOpened={Boolean(deleteModal)}
        onClick={() => setDeleteModal(false)}
      >
        <SiteCareDeleteModal
          closeDeleteModalHandler={() => {
            setDeleteModal(false)
            setDeleteIds(null)
          }}
          deleteIds={deleteIds}
          deleteSiteCareHandler={deleteSiteCareHandler}
          name={parseSelectedItemNameArr()}
        />
      </Backdrop>
    </div>
  )
}
