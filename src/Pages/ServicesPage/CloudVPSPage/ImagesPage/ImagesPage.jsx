/* eslint-disable no-unused-vars */
import {
  Loader,
  ImagesList,
  ImagesOptions,
  TooltipWrapper,
  Icon,
  EditCell,
} from '@components'
import s from './ImagesPage.module.scss'
import ss from '@components/Services/cloud/ImagesList/ImagesList.module.scss'
import { CLOUD_IMAGE_CELLS } from '@utils/constants'
import { useDispatch } from 'react-redux'
import { useCancelRequest } from '@src/utils'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import { useEffect } from 'react'
import { cloudVpsOperations } from '@src/Redux'

const items = [
  {
    id: 1,
    name: 'name',
    isProtected: true,
    status: 'active',
    type: ' name',
    region: 'nl',
    created_at: '31.05.24',
    size: '16GB',
    price_per_day: '.5$',
    os: 'AlmaLinux',
  },
  {
    id: 2,
    name: 'type',
    status: 'active',
    type: ' type 2',
    region: 'nl',
    created_at: '31.05.24',
    size: '16GB',
    price_per_day: '.5$',
    os: 'AlmaLinux',
  },
  {
    id: 3,
    name: 'region',
    status: 'active',
    type: ' region 3',
    region: 'nl',
    created_at: '31.05.24',
    size: '16GB',
    price_per_day: '.5$',
    os: 'AlmaLinux',
  },
  {
    id: 4,
    name: 'created_at',
    status: 'active',
    type: ' created_at',
    region: 'nl',
    created_at: '31.05.24',
    size: '16GB',
    price_per_day: '.5$',
    os: 'AlmaLinux',
  },
  {
    id: 5,
    name: 'min_disk',
    status: 'active',
    type: ' min_disk',
    region: 'nl',
    created_at: '31.05.24',
    size: '16GB',
    price_per_day: '.5$',
    os: 'AlmaLinux',
  },
  {
    id: 6,
    name: 'price_per_day',
    status: 'active',
    type: ' price_per_day',
    region: 'nl',
    created_at: '31.05.24',
    size: '16GB',
    price_per_day: '.5$',
    os: 'AlmaLinux',
  },
]

export default function ImagesPage() {
  const { t } = useTranslation(['cloud_vps'])

  const { signal, isLoading, setIsLoading } = useCancelRequest()
  const dispatch = useDispatch()

  // useEffect(() => {
  //   dispatch(cloudVpsOperations.getImages({}))
  // }, [])

  const cells = CLOUD_IMAGE_CELLS.map(cell => {
    let renderData
    switch (cell.label) {
      case 'name':
        renderData = function renderData(value, item) {
          return (
            <div className={ss.name_wrapper}>
              <div className={ss.name_field_wrapper}>
                {item.isProtected && <Icon name="Protected" />}
                <div className={ss.name_field}>
                  <EditCell
                    originName={value}
                    // onSubmit={editServerName}
                    placeholder={value || t('server_placeholder', { ns: 'vds' })}
                    isShadow={true}
                  />
                </div>
              </div>
              <p className={cn(ss.status, ss[item?.status?.trim().toLowerCase()])}>
                {item.status}
              </p>
            </div>
          )
        }
        break
      case 'options':
        renderData = function renderData(_, item) {
          return <ImagesOptions item={item} type="images" />
        }
        break
      case 'os':
        renderData = function renderData(value, item) {
          return (
            <TooltipWrapper
              className={ss.popup}
              wrapperClassName={ss.popup__wrapper}
              content={item.os}
              anchor={`instances_os_${item?.id}`}
            >
              <Icon name={value} />
            </TooltipWrapper>
          )
        }
        break
      case 'region':
        renderData = function renderData(value, item) {
          return (
            <TooltipWrapper
              className={ss.popup}
              wrapperClassName={cn(ss.popup__wrapper, ss.popup__wrapper_flag)}
              content={item.region}
              anchor={`country_flag_${item?.id}`}
            >
              <img
                src={require(`@images/countryFlags/${value}.png`)}
                width={20}
                height={14}
                alt={value}
              />
            </TooltipWrapper>
          )
        }
        break
      default:
        renderData = function renderData(value) {
          return value
        }
    }

    return { ...cell, renderData }
  })

  const itemOnClickHandler = (e, item) => {
    if (
      e.target.closest('[data-target="options"]') ||
      e.target.closest('[data-target="region"]') ||
      e.target.closest('[data-target="name"]') ||
      e.target.closest('[data-target="os"]')
    )
      return
    console.log(item, ' item')
  }

  return (
    <div className={s.images}>
      <ImagesList cells={cells} items={items} itemOnClickHandler={itemOnClickHandler} />
      {isLoading && <Loader local shown={isLoading} halfScreen />}
    </div>
  )
}
