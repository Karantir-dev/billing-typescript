/* eslint-disable no-unused-vars */
import { useTranslation } from 'react-i18next'
import s from './InstanceBackups.module.scss'
import { useCallback, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { cloudVpsActions, cloudVpsOperations } from '@redux'
import { useCancelRequest } from '@utils'
import { useCloudInstanceItemContext } from '../../CloudInstanceItemPage/CloudInstanceItemContext'
import { Button, EditCell, Icon, ImagesList, Loader, Select } from '@components'
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
  const [dailyCosts, setDailyCosts] = useState({})
  const [count, setCount] = useState(0)
  const [backupRotation, setBackupRotation] = useState('5')

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
            setBackupRotation,
            setDailyCosts,
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

  // const editBackupName = value => {
  //   const slicedValue = value.slice(0, 100)
  //   editImage({
  //     name: slicedValue,
  //     id: elid,
  //     errorCallback: () => setBackupName(backupName),
  //   })
  //   setBackupName(value)
  // }

  // useEffect(() => {
  //   setBackupName(item.backupName?.$ || '')
  // }, [item.backupName?.$])

  const itemOnClickHandler = (e, item) => {
    if (
      e.target.closest('[data-target="options"]') ||
      e.target.closest('[data-target="name"]')
    )
      return
    console.log('open item page')
  }

  const editInstanceHandler = values => {
    dispatch(
      cloudVpsOperations.editInstance({
        values,
        elid,
        successCallback: () => {},
        signal,
        setIsLoading,
      }),
    )
  }

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
                  ...dailyCosts,
                },
              }),
            )
          }}
        />

        <div className={s.backup_rotation_wrapper}>
          <Select
            className={s.backup_rotation_select}
            label={`${t('backups.backup_rotation')}:`}
            itemsList={['1', '2', '3', '4', '5'].map(el => ({
              label: el,
              value: el,
            }))}
            value={backupRotation}
            getElement={value => {
              if (value === backupRotation) {
                return
              }
              setBackupRotation(value)
              editInstanceHandler({ backup_rotation: value })
            }}
            isShadow
          />
          <p className={s.rotation_info}>{t('backups.rotation_info')}</p>
        </div>

        <ImagesList
          cells={INSTANCE_BACKUPS_CELLS}
          items={data}
          itemsCount={count}
          itemOnClickHandler={itemOnClickHandler}
          getItems={getItems}
          editImage={editImage}
          cost={dailyCosts}
          type="backups"
          idKey="elid"
        />
      </div>

      {isLoading && <Loader local shown={isLoading} halfScreen />}
    </>
  )
}
