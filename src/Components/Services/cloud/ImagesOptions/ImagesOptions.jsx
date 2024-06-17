import { Icon, Options, TooltipWrapper } from '@components'
import s from './ImagesOptions.module.scss'
import { useMediaQuery } from 'react-responsive'
import { useTranslation } from 'react-i18next'
import { cloudVpsActions } from '@src/Redux'
import { useDispatch } from 'react-redux'

export default function ImagesOptions({ item, type, idKey }) {
  const isMobile = useMediaQuery({ query: '(max-width: 1549px)' })
  const { t } = useTranslation(['cloud_vps'])
  const dispatch = useDispatch()

  const isImagesPage = type === 'image'

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
        console.log('Launch')
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
