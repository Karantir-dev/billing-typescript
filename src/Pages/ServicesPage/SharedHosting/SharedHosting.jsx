import React, { useEffect, useState } from 'react'
import {
  BreadCrumbs,
  SharedHostingFilter,
  Pagination,
  SharedHostingTable,
  SharedHostingHistoryModal,
  SharedHostingProlongModal,
  SharedHostingEditModal,
  SharedHostingChangeTariffModal,
} from '../../../Components'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import s from './SharedHosting.module.scss'
import { vhostSelectors, vhostOperations } from '../../../Redux'

export default function Component() {
  const { t, i18n } = useTranslation(['container', 'other'])
  const dispatch = useDispatch()

  const location = useLocation()

  const vhostList = useSelector(vhostSelectors.getVhostList)
  const vhostCount = useSelector(vhostSelectors.getVhostCount)

  const [currentPage, setCurrentPage] = useState(1)
  const [selctedItem, setSelctedItem] = useState(null)

  const [historyModal, setHistoryModal] = useState(false)
  const [historyList, setHistoryList] = useState([])

  const [prolongModal, setProlongModal] = useState(false)
  const [prolongData, setProlongData] = useState(null)

  const [editModal, setEditModal] = useState(false)
  const [editData, setEditData] = useState(null)

  const [changeTariffModal, setChangeTariffModal] = useState(false)
  const [changeTariffData, setChangeTariffData] = useState(null)
  const [changeTariffInfoData, setChangeTariffInfoData] = useState(null)

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
    }
    dispatch(vhostOperations.getHistoryVhost(data, setHistoryModal, setHistoryList))
  }

  const closeHistoryModalHandler = () => {
    setHistoryList([])
    setHistoryModal(false)
  }

  const instructionVhostHandler = () => {
    const data = {
      elid: selctedItem?.id?.$,
      elname: selctedItem?.name?.$,
      lang: i18n?.language,
    }
    dispatch(vhostOperations.getInsructionVhost(data))
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
    const data = {
      elid: selctedItem?.id?.$,
      elname: selctedItem?.name?.$,
      lang: i18n?.language,
    }
    dispatch(vhostOperations.prolongVhost(data, setProlongModal, setProlongData))
  }

  const closeProlongModalHandler = () => {
    setProlongData(null)
    setProlongModal(false)
  }

  const prolongEditVhostHandler = (values = {}) => {
    let data = {
      elid: selctedItem?.id?.$,
      lang: i18n?.language,
      ...values,
    }

    dispatch(vhostOperations.prolongVhost(data, setProlongModal, setProlongData))
  }

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
      lang: i18n?.language,
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

  return (
    <div className={s.page_wrapper}>
      <BreadCrumbs pathnames={parseLocations()} />
      <h1 className={s.page_title}>{t('burger_menu.services.services_list.virtual_hosting')}</h1>
      <SharedHostingFilter
        historyVhostHandler={historyVhostHandler}
        instructionVhostHandler={instructionVhostHandler}
        platformVhostHandler={platformVhostHandler}
        prolongVhostHandler={prolongVhostHandler}
        editVhostHandler={editVhostHandler}
        changeTariffVhostHandler={changeTariffVhostHandler}
        selctedItem={selctedItem}
        setCurrentPage={setCurrentPage}
      />
      <SharedHostingTable
        historyVhostHandler={historyVhostHandler}
        instructionVhostHandler={instructionVhostHandler}
        platformVhostHandler={platformVhostHandler}
        prolongVhostHandler={prolongVhostHandler}
        editVhostHandler={editVhostHandler}
        changeTariffVhostHandler={changeTariffVhostHandler}
        selctedItem={selctedItem}
        setSelctedItem={setSelctedItem}
        list={vhostList}
      />

      {vhostList.length !== 0 && (
        <div className={s.pagination}>
          <Pagination
            currentPage={currentPage}
            totalCount={Number(vhostCount)}
            pageSize={30}
            onPageChange={page => setCurrentPage(page)}
          />
        </div>
      )}

      {historyModal && historyList?.length > 0 && (
        <SharedHostingHistoryModal
          historyList={historyList}
          name={selctedItem?.name?.$}
          closeHistoryModalHandler={closeHistoryModalHandler}
        />
      )}

      {prolongModal && prolongData && (
        <SharedHostingProlongModal
          prolongData={prolongData}
          name={selctedItem?.name?.$}
          closeProlongModalHandler={closeProlongModalHandler}
          prolongEditVhostHandler={prolongEditVhostHandler}
        />
      )}

      {editModal && editData && (
        <SharedHostingEditModal
          editData={editData}
          name={selctedItem?.name?.$}
          closeEditModalHandler={closeEditModalHandler}
          sendEditVhostHandler={sendEditVhostHandler}
        />
      )}

      {changeTariffModal && changeTariffData && (
        <SharedHostingChangeTariffModal
          changeTariffData={changeTariffData}
          name={selctedItem?.name?.$}
          closeChangeTariffModalHandler={closeChangeTariffModalHandler}
          changeTariffInfoVhostHandler={changeTariffInfoVhostHandler}
          changeTariffInfoData={changeTariffInfoData}
          changeTariffSaveVhostHandler={changeTariffSaveVhostHandler}
        />
      )}
    </div>
  )
}
