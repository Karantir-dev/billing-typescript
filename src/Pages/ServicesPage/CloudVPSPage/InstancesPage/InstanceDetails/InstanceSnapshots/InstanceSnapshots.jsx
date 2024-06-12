/* eslint-disable no-unused-vars */
import { useTranslation } from 'react-i18next'
import s from './InstanceSnapshots.module.scss'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { cloudVpsOperations, cloudVpsActions } from '@redux'
import { useCancelRequest } from '@utils'
import { useCloudInstanceItemContext } from '../../CloudInstanceItemPage/CloudInstanceItemContext'
import { Button, EditCell, Icon, ImagesList, Loader } from '@components'
import ss from '@components/Services/cloud/ImagesList/ImagesList.module.scss'

const INSTANCE_SNAPSHOTS_CELLS = [
  { label: 'name', isSort: false, value: 'name' },
  { label: 'size', isSort: false, value: 'min_size' },
  // { label: 'created_at', isSort: false, value: 'createdate' },
  // { label: 'price_per_day', isSort: false, value: 'cost' },
  { label: 'os', isSort: false, value: 'os_distro' },
  {
    label: 'options',
    isSort: false,
    isHidden: true,
    value: 'options',
  },
]

export default function InstanceSnapshots() {
  const { signal, isLoading, setIsLoading } = useCancelRequest()
  const dispatch = useDispatch()
  const { t } = useTranslation(['cloud_vps'])

  const { item } = useCloudInstanceItemContext()

  const [data, setData] = useState()
  const [cost, setCost] = useState({})
  const [count, setCount] = useState(0)

  const elid = item?.id?.$

  const getItems = params => {
    dispatch(
      cloudVpsOperations.getImages({
        ...params,
        func: 'instances.snapshots',
        elid,
        setData,
        setCost,
        setCount,
        signal,
        setIsLoading,
      }),
    )
  }

  const editImage = ({ elid, name, ...values }) => {
    dispatch(
      cloudVpsOperations.editImage({
        func: 'instances.snapshots',
        successCallback: getItems,
        elid,
        signal,
        setIsLoading,
        values: { name, plid: elid, ...values },
      }),
    )
  }

  const itemOnClickHandler = (e, item) => {
    if (
      e.target.closest('[data-target="options"]') ||
      e.target.closest('[data-target="name"]')
    )
      return
    console.log('open item page')
  }

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
                  ...cost,
                },
              }),
            )
          }}
        />
        {/* Later, this button should appear inside the created snapshot as an icon (Backup, Image) */}
        <Button
          label={t('copy')}
          size="large"
          isShadow
          onClick={() => {
            dispatch(
              cloudVpsActions.setItemForModals({
                images_copy: {
                  ...item,
                },
              }),
            )
          }}
        />
        <ImagesList
          cells={INSTANCE_SNAPSHOTS_CELLS}
          items={data}
          itemsCount={count}
          itemOnClickHandler={itemOnClickHandler}
          getItems={getItems}
          editImage={editImage}
          idKey="elid"
          type="snapshots"
        />
      </div>

      {isLoading && <Loader local shown={isLoading} halfScreen />}
    </>
  )
}
