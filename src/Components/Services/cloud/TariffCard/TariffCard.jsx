import { Infinity } from '@src/images'
import s from './TariffCard.module.scss'
import cn from 'classnames'
import { useSelector } from 'react-redux'
import { cloudVpsSelectors } from '@src/Redux'
import { checkIfHasWindows } from '@src/utils'

export default function TariffCard({ tariff, onClick, price, active, disabled }) {
  const windowsTag = useSelector(cloudVpsSelectors.getWindowsTag)
  const hasWindows = checkIfHasWindows(tariff, windowsTag)

  const cpu = tariff.detail.find(el => el.name.$.toLowerCase().includes('cpu'))?.value.$
  const memory = tariff.detail
    .find(el => el.name.$.toLowerCase() === 'memory')
    .value.$.replace('.', '')
  const disk = tariff.detail
    .find(el => el.name.$.toLowerCase() === 'disk space')
    .value.$.replace('.', '')

  return (
    <li className={cn(s.tariff_item, { [s.active]: active, [s.disabled]: disabled })}>
      <button className={s.tariff_btn} type="button" onClick={() => onClick(tariff.id.$)}>
        <p className={s.tariff_title}>{tariff.title.main.$}</p>
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
            <span className={s.parameter_value}>1 Gbps</span>
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
