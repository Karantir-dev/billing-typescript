/* eslint-disable no-unused-vars */
import { useTranslation } from 'react-i18next'
import s from './InstanceBackupsSchedules.module.scss'
import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { cloudVpsActions, cloudVpsOperations } from '@redux'
import { useCancelRequest } from '@utils'
import { useCloudInstanceItemContext } from '../../CloudInstanceItemPage/CloudInstanceItemContext'
import { Button, ImagesList, Loader } from '@components'
import { ImagesModals } from '@src/Components/Services/Instances/ImagesModals/ImagesModals'

const INSTANCE_BACKUPS_SCHEDULES_CELLS = [
  { label: 'name', isSort: false, value: 'name' },
  { label: 'rotation_days', isSort: false, value: 'rotation_days' },
  { label: 'rotation_time', isSort: false, value: 'rotation_time' },
  { label: 'created_at', isSort: false, value: 'create_date' },
  {
    label: 'options',
    isSort: false,
    isHidden: true,
    value: 'options',
  },
]

export default function InstanceBackupsSchedules() {
  const { signal, isLoading, setIsLoading } = useCancelRequest()
  const dispatch = useDispatch()
  const { t } = useTranslation(['cloud_vps'])

  const { item, fetchItemById } = useCloudInstanceItemContext()

  const [data, setData] = useState()

  const [count, setCount] = useState(0)
  const [pagination, setPagination] = useState({})

  const elid = item?.id?.$

  const getItems = useCallback(
    (() => {
      let num
      return ({ p_col, p_num, p_cnt } = {}) => {
        num = p_num ?? num
        dispatch(
          cloudVpsOperations.getImages({
            p_col,
            p_num: num,
            p_cnt,
            func: 'instances.fleio_bckps.schedule',
            elid,
            setData,
            setPagination,
            signal,
            setIsLoading,
          }),
        )
      }
    })(),
    [],
  )

  const editImage = ({ id, successCallback, name, ...values }) => {
    dispatch(
      cloudVpsOperations.editImage({
        func: 'instances.fleio_bckps.schedule',
        successCallback: () => {
          getItems()
          successCallback?.()
        },
        elid: id,

        signal,
        setIsLoading,
        values: { name, plid: elid, ...values, clicked_button: 'ok', sok: 'ok' },
      }),
    )
  }

  const cells = INSTANCE_BACKUPS_SCHEDULES_CELLS.map(cell => {
    let renderData
    switch (cell.label) {
      case 'rotation_days':
        renderData = function renderData(value) {
          const renderValue = value
            .trim()
            .split(' ')
            .map(el => t(el.toLowerCase()))
            .join(', ')
          return <>{renderValue}</>
        }
        return { ...cell, renderData }

      default:
        return cell
    }
  })

  return (
    <>
      <div className={s.container}>
        <Button
          label={t('create_schedule')}
          size="large"
          isShadow
          onClick={() => {
            dispatch(
              cloudVpsActions.setItemForModals({
                schedule_create: {
                  ...item,
                },
              }),
            )
          }}
        />

        <ImagesList
          cells={cells}
          items={data}
          pagination={pagination}
          getItems={getItems}
          editImage={editImage}
          pageList="backups-schedules"
        />
      </div>

      <ImagesModals
        loadingParams={{
          signal,
          setIsLoading,
        }}
        getItems={getItems}
        editImage={editImage}
        fetchInstanceData={fetchItemById}
      />

      {isLoading && <Loader local shown={isLoading} halfScreen />}
    </>
  )
}
