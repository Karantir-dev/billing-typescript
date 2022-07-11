import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import * as route from '../../../routes'
import { useMediaQuery } from 'react-responsive'

import {
  Button,
  IconButton,
  HintWrapper,
  Backdrop,
  BreadCrumbs,
  ProlongModal,
  DedicsHistoryModal,
  Portal,
  ForexList,
  ForexEditModal,
  ForexFiltersModal,
  ForexDeletionModal,
} from '../../../Components'
import { forexOperations, forexSelectors } from '../../../Redux'
import { useDispatch, useSelector } from 'react-redux'
import s from './ForexPage.module.scss'
import { checkServicesRights, usePageRender } from '../../../utils'

export default function ForexPage() {
  const widerThan1550 = useMediaQuery({ query: '(min-width: 1600px)' })
  const dispatch = useDispatch()
  const { t } = useTranslation(['vds', 'container', 'other'])
  const navigate = useNavigate()

  const forexRenderData = useSelector(forexSelectors.getForexList)
  const isAllowedToRender = usePageRender('mainmenuservice', 'forexbox')

  // const [forexList, setForexList] = useState(null)
  const [activeServer, setActiveServer] = useState(null)
  const [elidForEditModal, setElidForEditModal] = useState(0)
  const [elidForProlongModal, setElidForProlongModal] = useState(0)
  const [elidForHistoryModal, setElidForHistoryModal] = useState(0)
  const [elidForDeletionModal, setElidForDeletionModal] = useState(0)
  const [filterModal, setFilterModal] = useState(false)
  const [filters, setFilters] = useState([])
  const [emptyFilter, setEmptyFilter] = useState(false)

  const mobile = useMediaQuery({ query: '(max-width: 767px)' })

  const location = useLocation()

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

  const resetFilterHandler = () => {
    const clearField = {
      id: '',
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
      datacenter: '',
    }
    // setValues && setValues({ ...clearField })

    setFilterModal(false)
    dispatch(
      forexOperations.getForexFilters(
        setFilters,
        { ...clearField, sok: 'ok' },
        true,
        setEmptyFilter,
      ),
    )
  }

  const setFilterHandler = values => {
    setFilterModal(false)
    setFilters(null)
    dispatch(
      forexOperations.getForexFilters(
        setFilters,
        { ...values, sok: 'ok' },
        true,
        setEmptyFilter,
      ),
    )
  }

  useEffect(() => {
    if (!isAllowedToRender) {
      navigate(route.SERVICES, { replace: true })
    } else {
      const clearField = {
        id: '',
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
        datacenter: '',
      }

      dispatch(
        forexOperations.getForexFilters(setFilters, { ...clearField, sok: 'ok' }, true),
      )
    }
  }, [])

  let rights = checkServicesRights(forexRenderData?.forexPageRights?.toolgrp)

  useEffect(() => {
    if (filterModal) dispatch(forexOperations.getForexFilters(setFilters))
  }, [filterModal])

  return (
    <>
      <BreadCrumbs pathnames={parseLocations()} />
      <h2 className={s.page_title}>{t('forex', { ns: 'crumbs' })}</h2>
      <div className={s.tools_wrapper}>
        <div className={s.tools_container}>
          <div className={s.filterBtnBlock}>
            <IconButton
              onClick={() => setFilterModal(true)}
              icon="filter"
              className={s.calendarBtn}
              disabled={
                (!emptyFilter && forexRenderData?.forexList?.length === 0) ||
                !rights?.filter
              }
            />
            {filterModal && (
              <>
                <Portal>
                  <div className={s.bg}>
                    {mobile && (
                      <ForexFiltersModal
                        filterModal={filterModal}
                        setFilterModal={setFilterModal}
                        filters={filters?.currentFilters}
                        filtersList={filters?.filters}
                        resetFilterHandler={resetFilterHandler}
                        setFilterHandler={setFilterHandler}
                      />
                    )}
                  </div>
                </Portal>
                {!mobile && (
                  <ForexFiltersModal
                    filterModal={filterModal}
                    setFilterModal={setFilterModal}
                    filters={filters?.currentFilters}
                    filtersList={filters?.filters}
                    resetFilterHandler={resetFilterHandler}
                    setFilterHandler={setFilterHandler}
                  />
                )}
              </>
            )}
          </div>

          {widerThan1550 && (
            <div className={s.desktop_tools_wrapper}>
              <HintWrapper
                wrapperClassName={s.hint_wrapper}
                label={t('edit', { ns: 'other' })}
              >
                <IconButton
                  className={s.tools_icon}
                  onClick={() => setElidForEditModal(activeServer?.id?.$)}
                  disabled={!activeServer || !rights?.edit}
                  icon="edit"
                />
              </HintWrapper>

              <HintWrapper wrapperClassName={s.hint_wrapper} label={t('prolong')}>
                <IconButton
                  onClick={() => setElidForProlongModal(activeServer?.id?.$)}
                  className={s.tools_icon}
                  disabled={activeServer?.status?.$ !== '2' || !rights?.prolong}
                  icon="clock"
                />
              </HintWrapper>
              <HintWrapper wrapperClassName={s.hint_wrapper} label={t('history')}>
                <IconButton
                  onClick={() => setElidForHistoryModal(activeServer?.id?.$)}
                  className={s.tools_icon}
                  icon="refund"
                  disabled={!activeServer?.id?.$ || !rights?.history}
                />
              </HintWrapper>
              <HintWrapper
                wrapperClassName={s.hint_wrapper}
                label={t('delete', { ns: 'other' })}
              >
                <IconButton
                  className={s.tools_icon}
                  disabled={!activeServer?.id?.$ || !rights?.delete}
                  icon="delete"
                  onClick={() => setElidForDeletionModal(activeServer?.id?.$)}
                />
              </HintWrapper>
            </div>
          )}
        </div>

        <Button
          className={s.order_btn}
          isShadow
          type="button"
          label={t('to_order', { ns: 'other' }).toLocaleUpperCase()}
          onClick={() => {
            navigate(route.FOREX_ORDER, {
              state: { isForexOrderAllowed: rights?.new },
              replace: true,
            })
          }}
          disabled={!rights?.new}
        />
      </div>
      <ForexList
        emptyFilter={emptyFilter}
        forexList={forexRenderData?.forexList}
        activeServerID={activeServer?.id.$}
        setElidForEditModal={setElidForEditModal}
        setElidForProlongModal={setElidForProlongModal}
        setElidForHistoryModal={setElidForHistoryModal}
        setElidForDeletionModal={setElidForDeletionModal}
        setActiveServer={setActiveServer}
        pageRights={rights}
      />
      <Backdrop onClick={() => null} isOpened={Boolean(elidForEditModal)}>
        <ForexEditModal elid={elidForEditModal} closeFn={() => setElidForEditModal(0)} />
      </Backdrop>

      <Backdrop
        onClick={() => setElidForProlongModal(0)}
        isOpened={Boolean(elidForProlongModal)}
      >
        <ProlongModal
          elid={elidForProlongModal}
          closeFn={() => setElidForProlongModal(0)}
          pageName="forex"
        />
      </Backdrop>

      <Backdrop
        onClick={() => setElidForHistoryModal(0)}
        isOpened={Boolean(elidForHistoryModal)}
      >
        <DedicsHistoryModal
          elid={elidForHistoryModal}
          server={activeServer}
          closeFn={() => setElidForHistoryModal(0)}
        />
      </Backdrop>

      <Backdrop
        onClick={() => setElidForDeletionModal(0)}
        isOpened={Boolean(elidForDeletionModal)}
      >
        <ForexDeletionModal
          server={activeServer}
          elid={elidForDeletionModal}
          closeFn={() => setElidForDeletionModal(0)}
        />
      </Backdrop>
    </>
  )
}