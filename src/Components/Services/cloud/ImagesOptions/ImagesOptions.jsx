import { Icon, Options, TooltipWrapper } from '@components'
import s from './ImagesOptions.module.scss'
import { useMediaQuery } from 'react-responsive'
import { useTranslation } from 'react-i18next'
import { cloudVpsActions } from '@src/Redux'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import * as route from '@src/routes'
import { useEffect } from 'react'

export default function ImagesOptions({ item, pageList, idKey }) {
  const isMobile = useMediaQuery({ query: '(max-width: 1549px)' })
  const { t } = useTranslation(['cloud_vps'])
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const openCopyModal = () => {
    dispatch(
      cloudVpsActions.setItemForModals({
        images_copy: {
          ...item,
        },
      }),
    )
  }

  useEffect(() => {
    if (location.state?.copy) {
      openCopyModal()
    }
  }, [])

  const isImagesPage = pageList === 'images'

  const isProtected = item?.protected?.$orig === 'on' || item?.protected?.$ === 'on'
  const isActive = item.fleio_status?.$.trim().toLowerCase() === 'active'

  const options = [
    {
      label: t('edit'),
      icon: 'Rename',
      disabled: !isActive,
      onClick: () => {
        dispatch(
          cloudVpsActions.setItemForModals({
            images_edit: { ...item, idKey },
          }),
        )
      },
    },
    {
      label: t('launch'),
      icon: 'Launch',
      disabled: !isActive,
      onClick: () => {
        navigate(route.CLOUD_VPS_CREATE_PREMIUM_INSTANCE, {
          state: {
            imageNumber: item.id.$,
            imageId: item.fleio_id.$,
            dcLabel: item.region.$,
            min_disk: item.min_disk?.$,
            min_ram: item.min_ram?.$,
          },
        })
      },
      hidden: isImagesPage && item.disk_format.$ === 'iso',
    },
    {
      label: t('copy'),
      icon: 'Copy',
      disabled: !isActive,
      onClick: () => {
        openCopyModal()
      },
      hidden: !isImagesPage,
    },
    {
      label: t('restore'),
      icon: 'Restore',
      disabled: !isActive,
      onClick: () => {
        dispatch(
          cloudVpsActions.setItemForModals({
            restore_modal: { ...item },
          }),
        )
      },
      hidden: isImagesPage,
    },
    {
      label: t('download'),
      icon: 'DownloadImage',
      disabled: !isActive,
      onClick: () => {
        console.log('Downnload')
      },
      hidden: true,
    },
    {
      label: t('delete'),
      icon: 'Remove',
      disabled: isProtected || !isActive,
      onClick: () => {
        dispatch(
          cloudVpsActions.setItemForModals({
            image_delete: { ...item, idKey },
          }),
        )
      },
    },
  ]

  return (
    <div>
      {isMobile ? (
        <Options
          options={options}
          renderButton={() => (
            <p className={s.dots}>
              <Icon name="MoreDots" />
            </p>
          )}
        />
      ) : (
        <div className={s.options}>
          {options
            .filter(option => !option.hidden)
            .map(option => {
              return (
                <TooltipWrapper key={option.label} content={option.label}>
                  <button onClick={option.onClick} disabled={option.disabled}>
                    <Icon name={option.icon} />
                  </button>
                </TooltipWrapper>
              )
            })}
        </div>
      )}
    </div>
  )
}
