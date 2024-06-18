import { Infinity } from '@src/images'
import s from './TariffCard.module.scss'
import cn from 'classnames'
import { useSelector } from 'react-redux'
import { cloudVpsSelectors } from '@src/Redux'
import { checkIfHasWindows } from '@src/utils'
import { Icon, TooltipWrapper } from '@src/Components'
import { useMediaQuery } from 'react-responsive'
import { useTranslation } from 'react-i18next'

export default function TariffCard({
  tariff,
  onClick,
  price,
  active,
  disabled,
  isSoldOut,
}) {
  const windowsTag = useSelector(cloudVpsSelectors.getWindowsTag)
  const hasWindows = checkIfHasWindows(tariff, windowsTag)

  const { t } = useTranslation(['cloud_vps'])
  const lessThan1024 = useMediaQuery({ query: '(max-width: 1024px)' })

  const cpu = tariff.detail.find(el => el.name.$.toLowerCase().includes('cpu'))?.value.$
  const memory = tariff.detail
    .find(el => el.name.$.toLowerCase() === 'memory')
    .value.$.replace('.', '')
  const disk = tariff.detail
    .find(el => el.name.$.toLowerCase() === 'disk space')
    .value.$.replace('.', '')

  const portSpeed = tariff.detail.find(el => el.name.$.toLowerCase() === 'port speed')
    ?.value.$
  console.log(tariff)
  return (
    <li className={cn(s.tariff_item, { [s.active]: active, [s.disabled]: disabled })}>
      <button className={s.tariff_btn} type="button" onClick={() => onClick(tariff.id.$)}>
        <p className={s.tariff_title}>
          {isSoldOut && (
            <TooltipWrapper
              backgroundClassName={s.tooltip_bg}
              html={
                <div>
                  <Icon name="Warning_triangle" />
                  <div>
                    <p>{t('sold_out_messsage')}</p>
                    <p>{t('sold_out_description')}</p>
                  </div>
                </div>
              }
              anchor={`sold_out_${tariff.id.$}`}
              disabled={lessThan1024}
            >
              <Icon className={s.warn_icon} name="Warning_triangle" />
            </TooltipWrapper>
          )}
          {tariff.title.$}
        </p>
        <div className={s.tariff_parameters}>
          <div className={s.tariff_row}>
            <span className={s.parameter_label}>CPU</span>
            <span className={s.parameter_value}>{cpu}</span>
          </div>
          <div className={s.tariff_row}>
            <span className={s.parameter_label}>RAM</span>
            <span className={s.parameter_value}>{memory}</span>
          </div>
          <div className={s.tariff_row}>
            <span className={s.parameter_label}>NVMe</span>
            <span className={s.parameter_value}>{disk}</span>
          </div>
          <div className={s.tariff_row}>
            <span className={s.parameter_label}>Speed</span>
            <span className={s.parameter_value}>{portSpeed}</span>
          </div>
          <div className={s.tariff_row}>
            <span className={s.parameter_label}>Bandwidth</span>
            <span className={s.parameter_value}>
              <Infinity className={s.infinity} />
            </span>
          </div>
          <div className={s.tariff_row}>
            <span className={s.parameter_label}>OS</span>
            <span className={s.parameter_value}>
              {hasWindows ? 'Windows & Linux' : 'Linux'}
            </span>
          </div>
        </div>
        <p className={s.tariff_price}>€{price}</p>
      </button>
    </li>
  )
}
