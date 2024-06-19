import { Icon, Options, TooltipWrapper } from '@components'
import s from './ImagesOptions.module.scss'
import { useMediaQuery } from 'react-responsive'
import { useTranslation } from 'react-i18next'
import { cloudVpsActions } from '@src/Redux'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import * as route from '@src/routes'

export default function ImagesOptions({ item, type, idKey }) {
  const isMobile = useMediaQuery({ query: '(max-width: 1549px)' })
  const { t } = useTranslation(['cloud_vps'])
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const isImagesPage = type === 'image'

  const isProtected = item?.protected?.$orig === 'on' || item?.protected?.$ === 'on'
  const isActive = item.fleio_status?.$.trim().toLowerCase() === 'active'
  const isImageType = item.image_type?.$.toLowerCase() === 'image'

  const options = [
    {
      label: t('edit'),
      icon: 'Rename',
      disabled: !isActive,
      hidden: !isImageType,
      onClick: () => {
        dispatch(
          cloudVpsActions.setItemForModals({
            [`${type}_edit`]: item,
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
          state: { imageId: item.fleio_id.$, dcLabel: item.region.$ },
        })
      },
      hidden: isImagesPage && item.disk_format.$ === 'iso',
    },
    {
      label: t('copy'),
      icon: 'Copy',
      disabled: !isActive,
      onClick: () => {
        console.log('Copy')
        dispatch(
          cloudVpsActions.setItemForModals({
            images_copy: {
              ...item,
            },
          }),
        )
      },
      hidden: !isImagesPage,
    },
    {
      label: t('restore'),
      icon: 'Restore',
      disabled: !isActive,
      onClick: () => {
        console.log('Restore')
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
