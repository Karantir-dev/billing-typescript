import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import crown from '@images/crown.svg'

import { BASIC_TYPE, PREMIUM_TYPE } from '@src/utils/constants'

import s from '../../../Pages/ServicesPage/CloudVPSPage/InstancesPage/CreateInstancePage/CreateInstancePage.module.scss'

export default function CloudTypeSection({
  value,
  switchCloudType,
  isLaunchMode,
  premiumTariffs,
  basicTariffs,
}) {
  const CATEGORIES = [
    { type: PREMIUM_TYPE, label: 'Premium VPS', hasTariffs: premiumTariffs },
    { type: BASIC_TYPE, label: 'Basic VPS', hasTariffs: basicTariffs },
  ]

  const { t } = useTranslation(['cloud_vps'])

  const tabsToRender = isLaunchMode ? CATEGORIES.filter(el => el.hasTariffs) : CATEGORIES

  return (
    <section className={s.section}>
      <h3 className={s.section_title}>{t('server_type')}</h3>

      <ul className={s.grid}>
        {tabsToRender.map(({ type, label }) => {
          return (
            <li
              key={type}
              className={cn(s.category_item, {
                [s.selected]: type === value,
              })}
            >
              <button
                className={cn(s.category_btn, s.serverType_btn)}
                type="button"
                onClick={() => switchCloudType(type)}
              >
                {type === PREMIUM_TYPE && (
                  <img
                    className={s.serverType_icon}
                    src={crown}
                    width={20}
                    height={14}
                    alt={'crown'}
                  />
                )}
                {label}
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
