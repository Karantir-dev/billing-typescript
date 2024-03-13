/* eslint-disable no-unused-vars */
import { useEffect, useReducer, useState } from 'react'
import { SshList, Button, Loader, Pagination } from '@components'
import s from './SSHKeysPage.module.scss'
import cn from 'classnames'

import { AddSshKeyModal } from '@components/Services/Instances/Modals'
import { useDispatch, useSelector } from 'react-redux'
import { cloudVpsOperations, cloudVpsActions, cloudVpsSelectors } from '@redux'
import { useCancelRequest } from '@src/utils'
import * as route from '@src/routes'
import { useNavigate } from 'react-router-dom'
import { Modals } from '@components/Services/Instances/Modals/Modals'

export default function SSHKeysPage() {
  const navigate = useNavigate()

  const [isAddModalOpened, setIsAddModalOpened] = useState(false)
  const [isFiltered, setIsFiltered] = useState(false)
  const { signal, isLoading, setIsLoading } = useCancelRequest()
  const dispatch = useDispatch()
  const [sshItems, setSshItems] = useState()
  const [sortBy, setSortBy] = useState('+id')

  const itemForModals = useSelector(cloudVpsSelectors.getItemForModals)

  const setNewSshKey = values => {
    dispatch(
      cloudVpsOperations.setSshKey({
        ...values,
        setIsAddModalOpened,
        ...getSshRequiredParams,
      }),
      setPagination({ p_num: 1 }),
    )
  }

  const [pagination, setPagination] = useReducer(
    (state, action) => {
      return { ...state, ...action }
    },
    { p_num: 1, p_cnt: '10', totalElems: 0 },
  )

  /* crutch for paginations */
  const [isPaginationChanged, setIsPaginationChanged] = useState(false)
  const [isFirstRender, setIsFirstRender] = useState(true)

  // change this to get ssh keys that exist
  const getSshRequiredParams = {
    setSshItems,
    setTotalElems: value => setPagination({ totalElems: value }),
    signal,
    setIsLoading,
  }

  useEffect(() => {
    getInstances()
    setIsFirstRender(false)
  }, [])

  const getInstances = () => {
    dispatch(
      cloudVpsOperations.getSshKeys({
        ...getSshRequiredParams,
        ...pagination,
        p_num: 1,
        p_cnt: pagination.p_cnt,
        p_col: sortBy,
      }),
    )
  }

  useEffect(() => {
    if (!isFirstRender) {
      getInstances()
    }
  }, [isPaginationChanged])

  // const setFiltersHandler = values => {
  //   setPagination({ p_num: 1 })

  //   dispatch(
  //     cloudVpsOperations.setInstancesFilter({
  //       values,
  //       ...getInstancesRequiredParams,
  //       p_num: 1,
  //       p_cnt: pagination.p_cnt,
  //       p_col: sortBy,
  //     }),
  //   )
  //   // setIsFiltersOpened(false)
  //   setIsFiltered(!!values)
  // }

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
        ...getSshRequiredParams,
      }),
    )
  }

  const editNameSubmit = ({ value, elid, closeModal, errorCallback }) => {
    editInstanceHandler({
      values: { comment: value },
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
        closeModal: () => dispatch(cloudVpsActions.setItemForModals({ delete: false })),
        ...getSshRequiredParams,
      }),
    )
  }

  return (
    <>
      <Button
        label="Create new SSH Key"
        size="large"
        isShadow
        onClick={() => {
          setIsAddModalOpened(true)
          dispatch(cloudVpsActions.setItemForModals({ publicKey: '' }))
        }}
      />
      {/* isOpened
                      closeFn={() => {
                        setIsFiltersOpened(false)
                      }} */}
      <div>SSHKeys page will be here</div>
      {console.log('isAddModalOpened: ', isAddModalOpened)}
      {isAddModalOpened && (
        <AddSshKeyModal
          isAddModalOpened
          closeModal={() => {
            setIsAddModalOpened(false)
          }}
          // filters={filters.active}
          // filtersList={filters.filtersList}
          // resetFilterHandler={() => setFiltersHandler()}
          onSubmit={setNewSshKey}
        />
      )}
      {/* {isAddModalOpened && (
      )} */}
      <SshList
        ssh={sshItems}
        setSortHandler={setSortValue}
        sortBy={sortBy}
        editInstance={editNameSubmit}
      />
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
      <Modals deleteInstanceSubmit={deleteInstanceSubmit} />
      {isLoading && <Loader local shown={isLoading} halfScreen />}
    </>
  )
}
