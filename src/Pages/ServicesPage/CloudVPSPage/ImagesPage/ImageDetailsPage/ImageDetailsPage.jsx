/* eslint-disable no-unused-vars */
import { BreadCrumbs, Icon, ImagesOptions, Loader, TooltipWrapper } from '@components'
import { cloudVpsOperations } from '@src/Redux'
import { useCancelRequest } from '@src/utils'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import s from './ImageDetailsPage.module.scss'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { ImagesModals } from '@src/Components/Services/Instances/ImagesModals/ImagesModals'
import * as route from '@src/routes'

const DETAILS_FIELDS = [
  { value: 'fleio_id' },
  { value: 'region' },
  { value: 'image_size' },
  { value: 'min_ram' },
  { value: 'min_disk' },
  { value: 'created' },
  { value: 'updated' },
  { value: 'architecture' },
  { value: 'disk_format' },
  { value: 'os_distro' },
  { value: 'hypervisor_type' },
  { value: 'os_version' },
  { value: 'fleio_status' },
  { value: 'visibility' },
]

export default function ImageDetailsPage() {
  const { elid } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { t } = useTranslation(['cloud_vps'])

  const { signal, isLoading, setIsLoading } = useCancelRequest()

  const [data, setData] = useState()

  const parseLocations = () => {
    let pathnames = location?.pathname.split('/')

    pathnames = pathnames.filter(p => p.length !== 0)

    return pathnames
  }

  const editImage = ({ successCallback, ...values } = {}) => {
    dispatch(
      cloudVpsOperations.editImage({
        func: 'image',
        elid,
        successCallback: () => {
          getImageData()
          successCallback?.()
        },
        signal,
        setIsLoading,
        values: { ...values, clicked_button: 'ok', sok: 'ok' },
      }),
    )
  }

  const getImageData = () =>
    dispatch(
      cloudVpsOperations.editImage({
        func: 'image',
        elid,
        successCallback: setData,
        signal,
        setIsLoading,
      }),
    )

  useEffect(() => {
    getImageData()
  }, [])

  const fields = DETAILS_FIELDS.map(field => {
    let renderData

    switch (field.value) {
      case 'image_size':
      case 'min_disk':
        renderData = function renderData(value) {
          return <>{value} GB</>
        }
        return { ...field, renderData }
      case 'min_ram':
        renderData = function renderData(value) {
          return <>{value} MB</>
        }
        return { ...field, renderData }
      case 'hypervisor_type':
        renderData = function renderData(value) {
          return <>{value.replace(/_/g, ' ')}</>
        }
        return { ...field, renderData }
      default:
        return field
    }
  })

  return (
    <div>
      <BreadCrumbs pathnames={parseLocations()} />
      {data && (
        <>
          <div className={s.head}>
            <div>
              <div className={s.title_block}>
                <h1>{data.image_name?.$}</h1>
                <TooltipWrapper
                  className={s.popup}
                  wrapperClassName={s.popup__wrapper}
                  content={data.os_distro.$}
                  anchor={`os_${data?.id.$}`}
                >
                  <Icon name={data.os_distro?.$} />
                </TooltipWrapper>
              </div>
              <p className={cn(s.status, s[data?.fleio_status?.$?.trim().toLowerCase()])}>
                {data.fleio_status?.$}
              </p>
            </div>

            <ImagesOptions item={data} idKey="id" type="image" />
          </div>
          <div className={s.block_wrapper}>
            <h3 className={s.block_title}>{t('details.title')}</h3>

            <ul className={s.info_block_wrapper}>
              {fields.map(field => (
                <li className={s.info_block_item} key={field.value}>
                  <span className={s.item_name}>{t(`details.${field.value}`)}</span>
                  <span className={s.item_info}>
                    {field.renderData?.(data[field.value]?.$) ??
                      data[field.value]?.$ ??
                      '-'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      <ImagesModals
        loadingParams={{
          signal,
          setIsLoading,
        }}
        getItems={editImage}
        editImage={editImage}
        redirectCallback={() => navigate(navigate(`${route.CLOUD_VPS}/images`))}
      />
      {isLoading && <Loader local shown={isLoading} />}
    </div>
  )
}
