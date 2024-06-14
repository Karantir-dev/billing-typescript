/* eslint-disable no-unused-vars */
import { useTranslation } from 'react-i18next'
import s from './InstanceBackups.module.scss'
import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { cloudVpsOperations, cloudVpsActions } from '@redux'
import { useCancelRequest } from '@utils'
import { useCloudInstanceItemContext } from '../../CloudInstanceItemPage/CloudInstanceItemContext'
import { Button, EditCell, Icon, ImagesList, Loader } from '@components'
import ss from '@components/Services/cloud/ImagesList/ImagesList.module.scss'

const INSTANCE_BACKUPS_CELLS = [
  { label: 'name', isSort: false, value: 'name' },
  { label: 'size', isSort: false, value: 'image_size' },
  { label: 'created_at', isSort: false, value: 'createdate' },
  { label: 'price_per_day', isSort: false, value: 'cost' },
  { label: 'os', isSort: false, value: 'os_distro' },
  {
    label: 'options',
    isSort: false,
    isHidden: true,
    value: 'options',
  },
]

export default function InstanceBackups() {
  const { signal, isLoading, setIsLoading } = useCancelRequest()
  const dispatch = useDispatch()
  const { t } = useTranslation(['cloud_vps'])

  const { item } = useCloudInstanceItemContext()

  const [data, setData] = useState()
  const [count, setCount] = useState(0)
  const [cost, setCost] = useState(0)

  const elid = item?.id?.$

  const getItems = useCallback(
    (() => {
      let col, num, cnt
      return ({ p_col, p_num, p_cnt } = {}) => {
        col = p_col ?? col
        num = p_num ?? num
        cnt = p_cnt ?? cnt
        dispatch(
          cloudVpsOperations.getImages({
            p_col: col,
            p_num: num,
            p_cnt: cnt,
            func: 'instances.fleio_bckps',
            elid,
            setData,
            setCount,
            setCost,
            signal,
            setIsLoading,
          }),
        )
      }
    })(),
    [],
  )

  const editImage = ({ id, name, ...values }) => {
    dispatch(
      cloudVpsOperations.editImage({
        func: 'image',
        successCallback: getItems,
        elid: id,
        signal,
        setIsLoading,
        values: {
          image_name: name,
          plid: elid,
          ...values,
          clicked_button: 'ok',
          sok: 'ok',
        },
      }),
    )
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
                },
              }),
            )
          }}
        />
        {/* Later this Button should be inside the created Snapshot as icon (Backup, Image eather) */}
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
          cells={INSTANCE_BACKUPS_CELLS}
          items={data}
          itemsCount={count}
          getItems={getItems}
          editImage={editImage}
          cost={cost}
          type="snapshot"
          idKey="elid"
        />
      </div>

      {isLoading && <Loader local shown={isLoading} halfScreen />}
    </>
  )
}
