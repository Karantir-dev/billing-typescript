import { Infinity } from '@src/images'
import s from './TariffCard.module.scss'
import cn from 'classnames'
import { useSelector } from 'react-redux'
import { cloudVpsSelectors } from '@src/Redux'
import { checkIfHasWindows } from '@src/utils'
import {
  Icon,
  // TooltipWrapper
} from '@src/Components'
// import { useMediaQuery } from 'react-responsive'
// import { Trans, useTranslation } from 'react-i18next'
// import * as route from '@src/routes'
// import { useState } from 'react'

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

  // const { t } = useTranslation(['cloud_vps'])
  // const lessThan1024 = useMediaQuery({ query: '(max-width: 1024px)' })

  // const [tooltipIsOpen, setTooltipIsOpen] = useState(false)

  const cpu = tariff.detail.find(el => el.name.$.toLowerCase().includes('cpu'))?.value.$
  const memory = tariff.detail
    .find(el => el.name.$.toLowerCase() === 'memory')
    .value.$.replace('.', '')
  const disk = tariff.detail
    .find(el => el.name.$.toLowerCase() === 'disk space')
    .value.$.replace('.', '')

  const portSpeed = tariff.detail.find(el => el.name.$.toLowerCase() === 'port speed')
    ?.value.$

  return (
    <li className={cn(s.tariff_item, { [s.active]: active, [s.disabled]: disabled })}>
      <button
        className={s.tariff_btn}
        type="button"
        onClick={() => {
          onClick(tariff.id.$)
          // setTooltipIsOpen(true)
        }}
      >
        <p className={s.tariff_title}>
          {/* {isSoldOut && (
            <TooltipWrapper
              className={s.tooltip_bg}
              isOpen={active ? tooltipIsOpen : false}
              html={
                <div className={s.tooltip_html}>
                  <Icon className={s.icon_triangle} name="Warning_triangle" />
                  <div>
                    <p className={s.tooltip_message}>
                      {t('sold_out_messsage')}{' '}
                      <button type="button" onClick={() => setTooltipIsOpen(false)}>
                        <Icon className={s.tooltip_cross} name="Cross" />
                      </button>
                    </p>
                    <p className={s.tooltip_description}>
                      <Trans
                        t={t}
                        i18nKey="sold_out_description"
                        components={{
                          // eslint-disable-next-line jsx-a11y/anchor-has-content
                          a: <a className={s.link} href={route.USER_SETTINGS_PERSONAL} />,
                        }}
                      />
                    </p>
                  </div>
                </div>
              }
              clickable
              disabled={lessThan1024}
            >
              <Icon className={s.warn_icon} name="Warning_triangle" />
            </TooltipWrapper>
          )} */}
          {isSoldOut && <Icon className={s.warn_icon} name="Warning_triangle" />}
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
