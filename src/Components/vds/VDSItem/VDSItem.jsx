import React from 'react'
import { useTranslation } from 'react-i18next'
import { Clock, On_Off, MoreDots, Edit } from '../../../images'

import s from './VDSItem.module.scss'

export default function VDSmobileItem({ server }) {
  const { t } = useTranslation(['vds', 'other'])

  return (
    <li className={s.item}>
      <div className={s.dots_wrapper}>
        <button type="button">
          <MoreDots />
        </button>

        <div className={s.dropdown}>
          <div className={s.pointer_wrapper}>
            <div className={s.pointer}></div>
          </div>
          <ul>
            <li>
              <button className={s.tool_btn} type="button">
                <Edit className={s.tool_icon} />
                {t('edit', { ns: 'other' })}
              </button>
            </li>
            <li>
              <button className={s.tool_btn} type="button">
                <Edit className={s.tool_icon} />
                {t('edit', { ns: 'other' })}
              </button>
            </li>
            <li>
              <button className={s.tool_btn} type="button">
                <Edit className={s.tool_icon} />
                {t('edit', { ns: 'other' })}
              </button>
            </li>
            <li>
              <button className={s.tool_btn} type="button">
                <Edit className={s.tool_icon} />
                {t('edit', { ns: 'other' })}
              </button>
            </li>
          </ul>
        </div>
      </div>

      <span className={s.label}>Id:</span>
      <span className={s.value}>{server?.id?.$}</span>
      <span className={s.label}>{t('domain_name')}:</span>
      <span className={s.value}>{server?.domain?.$}</span>
      <span className={s.label}>{t('ip_address')}:</span>
      <span className={s.value}>{server?.ip?.$}</span>
      <span className={s.label}>{t('OS_template')}:</span>
      <span className={s.value}>{server?.ostempl?.$}</span>
      <span className={s.label}>{t('tariff')}:</span>
      <span className={s.value}>
        {server?.pricelist?.$}
        <span className={s.price}>
          {server?.cost?.$.replace('Month', t('short_month', { ns: 'other' }))}
        </span>
      </span>
      <span className={s.label}>{t('data_center')}:</span>
      <span className={s.value}>{server?.datacentername?.$}</span>
      <span className={s.label}>{t('status')}:</span>
      <span className={s.value}>
        {server?.status?.$ === '2' && <On_Off />}{' '}
        {server?.status?.$ === '1' && <On_Off className={s.on_off_icon} />}{' '}
        {server?.autoprolong?.$ === 'Month' && <Clock className={s.clock_icon} />}
      </span>
      <span className={s.label}>{t('created')}:</span>
      <span className={s.value}>{server?.createdate?.$}</span>
      <span className={s.label}>{t('valid_until')}:</span>
      <span className={s.value}>{server?.expiredate?.$}</span>
    </li>
  )
}
