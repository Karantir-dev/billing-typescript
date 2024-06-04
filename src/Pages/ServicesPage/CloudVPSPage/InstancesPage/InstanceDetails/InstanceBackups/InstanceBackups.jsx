/* eslint-disable no-unused-vars */
import { useTranslation } from 'react-i18next'
import s from './InstanceBackups.module.scss'

import { useEffect, useReducer, useState } from 'react'

import { useDispatch } from 'react-redux'
import { cloudVpsOperations, cloudVpsActions } from '@redux'
import { useCancelRequest, formatBytes } from '@utils'

import { Modals } from '@components/Services/Instances/Modals/Modals'
import { useCloudInstanceItemContext } from '../../CloudInstanceItemPage/CloudInstanceItemContext'

import { Button, Icon, IconButton, Loader, Select } from '@components'

export default function InstanceBackups() {
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

  // const getBackups = ({ p_col, p_num, p_cnt } = {}) => {
  //   dispatch(
  //     cloudVpsOperations.getBackups({
  //       p_col,
  //       p_cnt: p_cnt ?? pagination.p_cnt,
  //       p_num: p_num ?? pagination.p_num,
  //       ...getRequiredParams,
  //     }),
  //   )
  // }

  useEffect(() => {
    // getBackups()
    setIsFirstRender(false)
  }, [])

  useEffect(() => {
    if (!isFirstRender) {
      // getBackups()
    }
  }, [isPaginationChanged])

  // const setBackup = (values, p_col, p_cnt) => {
  //   setPagination({ p_num: 1 }),
  //   dispatch(
  //     cloudVpsOperations.editSsh({
  //       ...values,
  //       ...getRequiredParams,
  //       closeModal: () =>
  //         dispatch(cloudVpsActions.setItemForModals({ backup_create: false })),
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
          label={t('create_backup')}
          size="large"
          isShadow
          onClick={() => {
            dispatch(
              cloudVpsActions.setItemForModals({
                backup_create: {
                  ...item,
                },
              }),
            )
          }}
        />
      </div>

      {/* setBackup func should be replaced when endpoint will be finished */}
      <Modals
        setBackup={dispatch(cloudVpsActions.setItemForModals({ backup_create: false }))}
      />
      {isLoading && <Loader local shown={isLoading} halfScreen />}
    </>
  )
}
{
  /*  */
}
