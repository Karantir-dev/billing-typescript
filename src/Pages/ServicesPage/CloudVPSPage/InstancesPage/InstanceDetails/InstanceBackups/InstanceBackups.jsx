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

  const [isFirstRender, setIsFirstRender] = useState(true)

  const getRequiredParams = {
    signal,
    setIsLoading,
  }

  useEffect(() => {
    // getBackups()
    setIsFirstRender(false)
  }, [])

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

      {isLoading && <Loader local shown={isLoading} halfScreen />}
    </>
  )
}
