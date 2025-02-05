import {
  Button,
  Icon,
  IconButton,
  InstancesList,
  Loader,
  PaginationUpdated,
  Select,
} from '@components'
import s from './InstancesPage.module.scss'
import cn from 'classnames'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { InstanceFiltersModal } from '@components/Services/Instances/Modals'
import { useDispatch, useSelector } from 'react-redux'
import { cloudVpsOperations, cloudVpsActions, cloudVpsSelectors } from '@redux'
import { getInstanceMainInfo, useCancelRequest } from '@utils'
import * as route from '@src/routes'
import { useNavigate } from 'react-router-dom'
import { Modals } from '@components/Services/Instances/Modals/Modals'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { CLOUD_SORT_LIST } from '@utils/constants'

export default function InstancesPage() {
  const navigate = useNavigate()
  const { t } = useTranslation(['cloud_vps', 'other'])
  const lessThan1550 = useMediaQuery({ query: '(max-width: 1549px)' })

  const interval = useRef()

  const [isFiltersOpened, setIsFiltersOpened] = useState(false)
  const [isFiltered, setIsFiltered] = useState(false)
  const { signal, isLoading, setIsLoading } = useCancelRequest()
  const dispatch = useDispatch()
  const [sortBy, setSortBy] = useState('+id')

  const instances = useSelector(cloudVpsSelectors.getInstancesList)
  const filters = useSelector(cloudVpsSelectors.getInstancesFilters)
  const allSshCount = useSelector(cloudVpsSelectors.getSshCount)

  const [pagination, setPagination] = useState({})

  useEffect(() => {
    const isProcessing = instances?.find(item => {
      return getInstanceMainInfo(item).isProcessing
    })

    interval.current =
      isProcessing &&
      setInterval(() => {
        getInstances({ isLoader: false })
      }, 10000)
    return () => {
      clearInterval(interval.current)
    }
  }, [instances])

  const loadingParams = {
    signal,
    setIsLoading,
  }

  useEffect(() => {
    setFiltersHandler()

    return () => {
      dispatch(cloudVpsActions.setInstancesCount(0))
      dispatch(cloudVpsActions.setInstancesList(null))
      dispatch(cloudVpsActions.setInstancesFilters({}))
    }
  }, [])

  const getInstances = useCallback(
    (() => {
      let num
      return ({ p_col, p_num, p_cnt, isLoader } = {}) => {
        num = p_num ?? num
        dispatch(
          cloudVpsOperations.getInstances({
            ...loadingParams,
            p_col,
            p_cnt,
            p_num: num,
            setPagination,
            isLoader,
          }),
        )
      }
    })(),
    [],
  )

  const setFiltersHandler = values => {
    dispatch(
      cloudVpsOperations.setInstancesFilter({
        values,
        ...loadingParams,
        successCallback: () => {
          getInstances({ p_num: 1 })
        },
      }),
    )

    const isFiltered = !!(values ? Object.values(values) : []).filter(el => el).length

    setIsFiltersOpened(false)
    setIsFiltered(isFiltered)
  }

  const setSortValue = p_col => {
    setSortBy(p_col)
    getInstances({ p_col })
  }

  const editInstanceHandler = ({ values, elid, closeModal, errorCallback }) => {
    dispatch(
      cloudVpsOperations.editInstance({
        values,
        elid,
        errorCallback,
        closeModal,
        successCallback: () => getInstances(),
        ...loadingParams,
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

  const checkSortItem = value => {
    const isActive = sortBy?.replace(/[+-]/g, '') === value
    const isAsc = isActive ? sortBy[0] === '-' : true
    const icon = `Sort_${isAsc ? 'a_z' : 'z_a'}`
    return {
      isActive,
      isAsc,
      icon,
    }
  }

  const changeSort = value => {
    const { isActive, isAsc } = checkSortItem(value)

    if (isActive && isAsc) {
      setSortValue(`+${value}`)
    } else {
      setSortValue(`-${value}`)
    }
  }

  const filterKeys = filters?.active && Object.keys(filters.active)

  const setNewSshKey = values => {
    dispatch(
      cloudVpsOperations.editSsh({
        ...values,
        p_cnt: allSshCount + 1,
        setAllSshItems: list => dispatch(cloudVpsActions.setAllSshList(list)),
        closeModal: () =>
          dispatch(cloudVpsActions.setItemForModals({ ssh_rename: false })),
      }),
    )
  }

  return (
    <>
      {instances && (
        <>
          <div className={s.options}>
            <Button
              label={t('to_order', { ns: 'other' })}
              size="large"
              isShadow
              onClick={() => navigate(route.CLOUD_VPS_CREATE_PREMIUM_INSTANCE)}
            />
            {!instances.length && !isFiltered ? null : (
              <>
                <div className={s.filter}>
                  <IconButton icon="update" onClick={() => getInstances()} />
                  <IconButton
                    className={cn(s.filter__icon, { [s.filtered]: isFiltered })}
                    onClick={() => setIsFiltersOpened(true)}
                    icon="filter"
                    disabled={!instances.length && !isFiltered}
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
                {lessThan1550 && (
                  <Select
                    className={s.sort_select}
                    placeholder={t('sort')}
                    label={`${t('sort')}:`}
                    isShadow
                    itemsList={CLOUD_SORT_LIST.filter(el => el.isSort).map(el => {
                      const { icon } = checkSortItem(el.value)
                      return {
                        ...el,
                        label: t(el.label),
                        icon,
                      }
                    })}
                    itemIcon
                    getElement={value => changeSort(value)}
                    value={sortBy?.replace(/[+-]/g, '')}
                    disableClickActive={false}
                  />
                )}
              </>
            )}

            {filterKeys && (
              <ul className={s.filter__clouds}>
                {filterKeys.map(key => {
                  const value =
                    (filters.filtersList[key] &&
                      filters.filtersList[key]?.find(
                        el => el.$key === filters.active[key],
                      )?.$) ||
                    filters.active[key]
                  return (
                    <Fragment key={key}>
                      {filters.active[key] && (
                        <li className={s.filter__cloud}>
                          <span className={s.filter__cloud_name}>{t(key)}:</span>
                          <span className={s.filter__cloud_value}>{t(value.trim())}</span>
                          <button
                            className={s.filter__cloud_btn}
                            onClick={() => {
                              setFiltersHandler({ ...filters.active, [key]: '' })
                            }}
                          >
                            <Icon name="Cross" />
                          </button>
                        </li>
                      )}
                    </Fragment>
                  )
                })}
              </ul>
            )}
          </div>
          <InstancesList
            instances={instances}
            sortBy={sortBy}
            editInstance={editNameSubmit}
            changeSort={changeSort}
            checkSortItem={checkSortItem}
            isFiltered={isFiltered}
          />
        </>
      )}

      <PaginationUpdated
        className={s.pagination}
        pagination={pagination}
        getItemsHandler={getInstances}
      />

      <Modals
        editNameSubmit={editNameSubmit}
        loadingParams={loadingParams}
        pagination={pagination}
        setPagination={setPagination}
        getInstances={getInstances}
        addNewSshSubmit={setNewSshKey}
      />
      {isLoading && <Loader local shown={isLoading} halfScreen />}
    </>
  )
}
