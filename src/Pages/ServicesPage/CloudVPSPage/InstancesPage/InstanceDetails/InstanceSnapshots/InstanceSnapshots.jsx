/* eslint-disable no-unused-vars */
import { useTranslation } from 'react-i18next'
import s from './InstanceSnapshots.module.scss'

import { useEffect, useReducer, useState } from 'react'

import { useDispatch } from 'react-redux'
import { cloudVpsOperations, cloudVpsActions } from '@redux'
import { useCancelRequest, formatBytes } from '@utils'

import { Modals } from '@components/Services/Instances/Modals/Modals'
import { useCloudInstanceItemContext } from '../../CloudInstanceItemPage/CloudInstanceItemContext'

import {
  Button,
  Icon,
  IconButton,
  InstancesList,
  Loader,
  Pagination,
  Select,
} from '@components'

export default function InstanceSnapshots() {
  const { signal, isLoading, setIsLoading } = useCancelRequest()
  const dispatch = useDispatch()
  const { t } = useTranslation(['cloud_vps'])

  const { item } = useCloudInstanceItemContext()

  const elid = item?.id?.$

  const [isPaginationChanged, setIsPaginationChanged] = useState(false)
  const [isFirstRender, setIsFirstRender] = useState(true)

  const [pagination, setPagination] = useReducer(
    (state, action) => {
      return { ...state, ...action }
    },
    { p_num: 1, p_cnt: '10', totalElems: 0 },
  )

  const getRequiredParams = {
    setTotalElems: value => setPagination({ totalElems: value }),
    signal,
    setIsLoading,
  }

  // const getSnapshots = ({ p_col, p_num, p_cnt } = {}) => {
  //   dispatch(
  //     cloudVpsOperations.getSnapshots({
  //       p_col,
  //       p_cnt: p_cnt ?? pagination.p_cnt,
  //       p_num: p_num ?? pagination.p_num,
  //       ...getRequiredParams,
  //     }),
  //   )
  // }

  useEffect(() => {
    // getSnapshots()
    setIsFirstRender(false)
  }, [])

  useEffect(() => {
    if (!isFirstRender) {
      // getSnapshots()
    }
  }, [isPaginationChanged])

  // const setSnapshot = (values, p_col, p_cnt) => {
  //   setPagination({ p_num: 1 }),
  //   dispatch(
  //     cloudVpsOperations.editSsh({
  //       ...values,
  //       ...getRequiredParams,
  //       closeModal: () =>
  //         dispatch(cloudVpsActions.setItemForModals({ snapshot_create: false })),
  //       p_col,
  //       p_cnt: p_cnt ?? pagination.p_cnt,
  //       p_num: 1,
  //     }),
  //   )
  // }

  return (
    <>
      <div className={s.container}>
        <Button
          label={t('create_snapshot')}
          size="large"
          isShadow
          onClick={() => {
            dispatch(
              cloudVpsActions.setItemForModals({
                snapshot_create: {
                  ...item,
                },
              }),
            )
          }}
        />
      </div>

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

      {/* setSnapshot func should be replaced when endpoint will be finished */}
      <Modals
        setSnapshot={dispatch(
          cloudVpsActions.setItemForModals({ snapshot_create: false }),
        )}
        // addNewSshSubmit={setNewSshKey}
        // renameSshSubmit={editNameSubmit}
      />
      {isLoading && <Loader local shown={isLoading} halfScreen />}
    </>
  )
}
{
  /*  */
}
