/* eslint-disable no-unused-vars */
import { Button, IconButton, InstancesList, Loader, Pagination } from '@components'
import s from './InstancesPage.module.scss'
import cn from 'classnames'
import { useEffect, useReducer, useState } from 'react'
import { InstanceFiltersModal } from '@components/Services/Instances/Modals'
import { useDispatch } from 'react-redux'
import { cloudVpsOperations } from '@redux'
import { useCancelRequest } from '@src/utils'
import * as route from '@src/routes'
import { useNavigate } from 'react-router-dom'
import { Modals } from '@components/Services/Instances/Modals/Modals'

export default function InstancesPage() {
  const navigate = useNavigate()

  const [isFiltersOpened, setIsFiltersOpened] = useState(false)
  const [isFiltered, setIsFiltered] = useState(false)
  const { signal, isLoading, setIsLoading } = useCancelRequest()
  const dispatch = useDispatch()
  const [instances, setInstances] = useState()
  const [sortBy, setSortBy] = useState('+id')

  const [itemForModals, setItemForModals] = useReducer((state, action) => {
    return { ...state, ...action }
  }, {})

  const [filters, setFilters] = useReducer(
    (state, action) => {
      return { ...state, ...action }
    },
    { active: {}, filtersList: {} },
  )

  const [pagination, setPagination] = useReducer(
    (state, action) => {
      return { ...state, ...action }
    },
    { p_num: 1, p_cnt: '10', totalElems: 0 },
  )

  /* crutch for paginations */
  const [isPaginationChanged, setIsPaginationChanged] = useState(false)
  const [isFirstRender, setIsFirstRender] = useState(true)

  const getInstancesRequiredParams = {
    setInstances,
    setTotalElems: value => setPagination({ totalElems: value }),
    setFilters,
    signal,
    setIsLoading,
  }

  useEffect(() => {
    setFiltersHandler()
    setIsFirstRender(false)
  }, [])

  const getInstances = p_col => {
    dispatch(
      cloudVpsOperations.getInstances({
        ...getInstancesRequiredParams,
        ...pagination,
        p_col,
      }),
    )
  }

  useEffect(() => {
    if (!isFirstRender) {
      getInstances()
    }
  }, [isPaginationChanged])

  const setFiltersHandler = values => {
    setPagination({ p_num: 1 })

    dispatch(
      cloudVpsOperations.setInstancesFilter({
        values,
        ...getInstancesRequiredParams,
        p_num: 1,
        p_cnt: pagination.p_cnt,
        p_col: sortBy,
      }),
    )
    setIsFiltersOpened(false)
    setIsFiltered(!!values)
  }

  const setSortValue = value => {
    setSortBy(value)
    getInstances(value)
  }

  const editInstanceHandler = ({ values, elid, closeModal, errorCallback }) => {
    dispatch(
      cloudVpsOperations.editInstance({
        values,
        elid,
        errorCallback,
        closeModal,
        ...getInstancesRequiredParams,
      }),
    )
  }

  const editNameSubmit = ({ value, elid, closeModal, errorCallback }) => {
    editInstanceHandler({
      values: { servername: value },
      elid,
      closeModal,
      errorCallback,
    })
  }

  const deleteInstanceSubmit = () => {
    setPagination({ p_num: 1 })
    dispatch(
      cloudVpsOperations.deleteInstance({
        elid: itemForModals.delete.id.$,
        closeModal: () => setItemForModals({ delete: false }),
        ...getInstancesRequiredParams,
      }),
    )
  }

  const confirmInstanceSubmit = (action, elid) => {
    dispatch(
      cloudVpsOperations.startStopInstance({
        action,
        elid,
        closeModal: () => setItemForModals({ confirm: false }),
        ...getInstancesRequiredParams,
        ...pagination,
      }),
    )
  }

  const changeInstancePasswordSubmit = password => {
    dispatch(
      cloudVpsOperations.changeInstancePassword({
        password,
        elid: itemForModals.change_pass.id.$,
        closeModal: () => setItemForModals({ change_pass: false }),
        signal,
        setIsLoading,
      }),
    )
  }

  return (
    <>
      {instances && (
        <>
          <div className={s.options}>
            <div className={s.filter__wrapper}>
              <div className={s.filter}>
                <IconButton
                  className={cn(s.filter__icon, { [s.filtered]: isFiltered })}
                  onClick={() => setIsFiltersOpened(true)}
                  icon="filter"
                />

                {isFiltersOpened && (
                  <>
                    <InstanceFiltersModal
                      isOpened
                      closeFn={() => {
                        setIsFiltersOpened(false)
                      }}
                      filters={filters.active}
                      filtersList={filters.filtersList}
                      resetFilterHandler={() => setFiltersHandler()}
                      handleSubmit={setFiltersHandler}
                    />
                  </>
                )}
              </div>
            </div>
            <Button
              label="Create new Instance"
              size="large"
              isShadow
              onClick={() => navigate(route.CLOUD_VPS_CREATE_INSTANCE)}
            />
          </div>
          <InstancesList
            instances={instances}
            setSortHandler={setSortValue}
            sortBy={sortBy}
            editInstance={editNameSubmit}
            setItemForModals={setItemForModals}
          />
        </>
      )}
      {pagination.totalElems > 5 && (
        <Pagination
          className={s.pagination}
          currentPage={pagination.p_num}
          totalCount={Number(pagination.totalElems)}
          onPageChange={value => {
            setPagination({ p_num: value })
            setIsPaginationChanged(prev => !prev)
          }}
          pageSize={pagination.p_cnt}
          onPageItemChange={value => {
            setPagination({ p_cnt: value })
          }}
        />
      )}
      <Modals
        itemForModals={itemForModals}
        setItemForModals={setItemForModals}
        deleteInstanceSubmit={deleteInstanceSubmit}
        changeInstancePasswordSubmit={changeInstancePasswordSubmit}
        editNameSubmit={editNameSubmit}
        confirmSubmit={confirmInstanceSubmit}
      />
      {isLoading && <Loader local shown={isLoading} halfScreen />}
    </>
  )
}
