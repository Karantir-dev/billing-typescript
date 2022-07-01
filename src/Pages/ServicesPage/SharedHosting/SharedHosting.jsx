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
  SharedHostingInstructionModal,
  Backdrop,
} from '../../../Components'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import s from './SharedHosting.module.scss'
import { vhostSelectors, vhostOperations } from '../../../Redux'

export default function Component() {
  const { t, i18n } = useTranslation(['container', 'other', 'access_log'])
  const dispatch = useDispatch()

  const location = useLocation()

  const vhostList = useSelector(vhostSelectors.getVhostList)
  const vhostCount = useSelector(vhostSelectors.getVhostCount)

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

  const [changeTariffModal, setChangeTariffModal] = useState(false)
  const [changeTariffData, setChangeTariffData] = useState(null)
  const [changeTariffInfoData, setChangeTariffInfoData] = useState(null)

  const [instructionModal, setInstructionModal] = useState(false)
  const [instructionData, setInstructionData] = useState(null)

  const [isFiltered, setIsFiltered] = useState(false)

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
      <h1 className={s.page_title}>
        {t('burger_menu.services.services_list.virtual_hosting')}
      </h1>
      <SharedHostingFilter
        setIsFiltered={setIsFiltered}
        setSelctedItem={setSelctedItem}
        historyVhostHandler={historyVhostHandler}
        instructionVhostHandler={instructionVhostHandler}
        platformVhostHandler={platformVhostHandler}
        prolongVhostHandler={prolongVhostHandler}
        editVhostHandler={editVhostHandler}
        changeTariffVhostHandler={changeTariffVhostHandler}
        selctedItem={selctedItem}
        setCurrentPage={setCurrentPage}
        isFilterActive={vhostList?.length > 0}
      />

      {vhostList?.length < 1 && isFiltered && (
        <div className={s.no_vds_wrapper}>
          <p className={s.not_found}>{t('nothing_found', { ns: 'access_log' })}</p>
        </div>
      )}

      {vhostList?.length > 0 && (
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
      )}

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

      <Backdrop
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
