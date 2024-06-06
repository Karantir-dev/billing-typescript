import { Icon, Options, TooltipWrapper } from '@components'
import s from './ImagesOptions.module.scss'
import { useMediaQuery } from 'react-responsive'
import { useTranslation } from 'react-i18next'

export default function ImagesOptions({ item, type, idKey }) {
  const isMobile = useMediaQuery({ query: '(max-width: 1549px)' })
  const { t } = useTranslation(['cloud_vps'])

  const options = [
    {
      label: t('edit'),
      icon: 'Rename',
      onClick: () => {
        console.log('Rename')
      },
    },
    {
      label: t('launch'),
      icon: 'Launch',
      onClick: () => {
        console.log('Launch')
      },
    },
    {
      label: t('copy'),
      icon: 'Copy',
      onClick: () => {
        console.log('Copy')
      },
      hidden: type !== 'images',
    },
    {
      label: t('restore'),
      icon: 'Restore',
      onClick: () => {
        console.log('Restore')
      },
      hidden: type === 'images',
    },
    {
      label: t('download'),
      icon: 'DownloadImage',
      onClick: () => {
        console.log('Downnload')
      },
      hidden: true,
    },
    {
      label: t('delete'),
      icon: 'Remove',
      onClick: () => {
        console.log('Delete')
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
                <TooltipWrapper
                  key={option.label}
                  content={option.label}
                  anchor={`${option.icon}_${item[idKey].$}`}
                >
                  <button onClick={option.onClick}>
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
