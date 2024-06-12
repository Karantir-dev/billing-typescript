/* eslint-disable no-unused-vars */
import { useTranslation } from 'react-i18next'
import s from './InstanceBackups.module.scss'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { cloudVpsOperations, cloudVpsActions } from '@redux'
import { useCancelRequest } from '@utils'
import { useCloudInstanceItemContext } from '../../CloudInstanceItemPage/CloudInstanceItemContext'
import { Button, EditCell, Icon, ImagesList, Loader } from '@components'
import ss from '@components/Services/cloud/ImagesList/ImagesList.module.scss'

const INSTANCE_BACKUPS_CELLS = [
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

export default function InstanceBackups() {
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
        func: 'instances.fleio_bckps',
        elid,
        setData,
        setCost,
        setCount,
        signal,
        setIsLoading,
      }),
    )
  }

  const editName = ({ elid, value }) => {
    dispatch(
      cloudVpsOperations.editImage({
        func: 'instances.snapshots',
        successCallback: getItems,
        elid,
        signal,
        setIsLoading,
        values: { name: value, plid: elid },
      }),
    )
  }

  const cells = INSTANCE_BACKUPS_CELLS.map(cell => {
    let renderData

    switch (cell.label) {
      case 'name':
        renderData = function renderData(value, item) {
          return (
            <div className={ss.name_wrapper}>
              <div className={ss.name_field_wrapper}>
                {item?.protected?.$ === 'on' && <Icon name="Protected" />}
                <div className={ss.name_field}>
                  <EditCell
                    originName={value}
                    onSubmit={val => {
                      const value = val.trim()
                      if (value) {
                        editName({ elid: item.elid.$, value })
                      }
                    }}
                    placeholder={value || t('server_placeholder', { ns: 'vds' })}
                    isShadow={true}
                  />
                </div>
              </div>
              {/* <p
                className={cn(s.status, s[item?.fleio_status?.$?.trim().toLowerCase()])}
              >
                {item?.fleio_status.$}
              </p> */}
            </div>
          )
        }
        return { ...cell, renderData }
    }

    return cell
  })

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
                backup_create: {
                  ...item,
                  ...cost,
                },
              }),
            )
          }}
        />
        <ImagesList
          cells={cells}
          items={data}
          itemsCount={count}
          itemOnClickHandler={itemOnClickHandler}
          getItems={getItems}
          idKey="elid"
          type="snapshots"
        />
      </div>

      {isLoading && <Loader local shown={isLoading} halfScreen />}
    </>
  )
}
