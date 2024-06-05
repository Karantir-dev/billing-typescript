/* eslint-disable no-unused-vars */
import { useTranslation } from 'react-i18next'
import s from './InstanceSnapshots.module.scss'

import { useEffect, useReducer, useState } from 'react'

import { useDispatch } from 'react-redux'
import { cloudVpsOperations, cloudVpsActions } from '@redux'
import { useCancelRequest, formatBytes } from '@utils'

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

  const getRequiredParams = {
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

      {isLoading && <Loader local shown={isLoading} halfScreen />}
    </>
  )
}
