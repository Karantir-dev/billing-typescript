import cn from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

import s from './DedicIPItem.module.scss'
import { Flag } from '../../../../../images'
import HintWrapper from '../../../../ui/HintWrapper/HintWrapper'

export default function DedicIPItem({ ip, activeIP, setActiveIP }) {
  const { t } = useTranslation(['vds', 'dedicated_servers', 'other'])

  console.log(ip)
  return (
    <li className={s.item}>
      {ip?.is_main?.$ === 'on' && (
        <div className={s.hint_wrapper}>
          <HintWrapper label={t('main_ip', { ns: 'dedicated_servers' })}>
            <Flag className={s.flag_icon} />
          </HintWrapper>
        </div>
      )}

      <button
        className={cn(s.item_btn, {
          [s.active_ip]: activeIP?.id?.$ === ip?.id?.$,
        })}
        type="button"
        onClick={() => setActiveIP(ip)}
      >
        <span className={s.value}>{ip?.name?.$}</span>
        <span className={s.value}>{ip?.mask?.$}</span>
        <span className={s.value}>{ip?.gateway?.$}</span>
        <span className={s.value}>{ip?.domain?.$}</span>
        <span className={s.value}>{t(ip?.type?.$, { ns: 'dedicated_servers' })}</span>
        <span className={s.value}>{t(ip?.ip_status?.$?.trim(), { ns: 'other' })}</span>
      </button>
    </li>
  )
}

DedicIPItem.propTypes = {
  server: PropTypes.object,
  setActiveServer: PropTypes.func,
  activeServerID: PropTypes.string,
}
