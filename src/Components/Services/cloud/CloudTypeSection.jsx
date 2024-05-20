/* eslint-disable no-unused-vars */
import cn from 'classnames'
import { useTranslation } from 'react-i18next'

import crown from '@images/crown.svg'
import { useDispatch } from 'react-redux'
import { cloudVpsOperations } from '@src/Redux'
import { useRef } from 'react'
import { BASIC_TYPE, PREMIUM_TYPE } from '@src/utils/constants'

import s from '../../../Pages/ServicesPage/CloudVPSPage/InstancesPage/CreateInstancePage/CreateInstancePage.module.scss'

export default function CloudTypeSection({
  signal,
  setIsLoading,
  getOsListHandler,
  dcKey,
  value,
  switchCloudType,
}) {
  const CATEGORIES = useRef([
    { type: PREMIUM_TYPE, label: 'Premium VPS' },
    { type: BASIC_TYPE, label: 'Basic VPS' },
  ])
  const dispatch = useDispatch()

  const { t } = useTranslation(['cloud_vps'])

  return (
    <section className={s.section}>
      <h3 className={s.section_title}>{t('server_type')}</h3>

      <ul className={s.grid}>
        {CATEGORIES.current.map(({ type, label }) => {
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
                onClick={() => {
                  getOsListHandler(type)
                  switchCloudType(type)
                }}
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
