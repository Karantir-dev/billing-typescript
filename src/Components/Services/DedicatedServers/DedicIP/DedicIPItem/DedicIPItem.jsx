import cn from 'classnames'

import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

import s from './DedicIPItem.module.scss'

export default function DedicIPItem({ ip, activeIP, setActiveIP }) {
  const { t } = useTranslation(['vds', 'dedicated_servers', 'other'])

  return (
    <li className={s.item}>
      {ip?.is_main?.$ === 'on' && (
        <div className={s.main_ip}>
          <div className={s.triangle}></div>
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
        {/* <span className={s.value}>{t(ip?.type?.$, { ns: 'dedicated_servers' })}</span> */}
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
