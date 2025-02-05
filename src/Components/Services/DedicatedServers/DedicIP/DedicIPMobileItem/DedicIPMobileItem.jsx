import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '@components'
import { useOutsideAlerter } from '@utils'
import PropTypes from 'prop-types'

import s from './DedicIPMobileItem.module.scss'

export default function DedicIPMobileItem({
  ip,
  setElidForEditModal,
  setElidForDeleteModal,
  rights,
}) {
  const { t } = useTranslation(['vds', 'dedicated_servers', 'other'])
  const dropdownEl = useRef()

  const [toolsOpened, setToolsOpened] = useState(false)
  // const navigate = useNavigate()

  useOutsideAlerter(dropdownEl, toolsOpened, () => setToolsOpened(false))

  const handleToolBtnClick = (fn, id) => {
    fn(id)
    setToolsOpened(false)
  }

  return (
    <li className={s.item}>
      <div className={s.dots_wrapper}>
        <button className={s.dots_btn} type="button" onClick={() => setToolsOpened(true)}>
          <Icon name="MoreDots" />
        </button>

        {toolsOpened && (
          <div className={s.dropdown} ref={dropdownEl}>
            <div className={s.pointer_wrapper}>
              <div className={s.pointer}></div>
            </div>
            <ul>
              <li className={s.tool_item}>
                <button
                  disabled={!rights?.edit}
                  className={s.tool_btn}
                  type="button"
                  onClick={() => handleToolBtnClick(setElidForEditModal, ip?.id.$)}
                >
                  <Icon name="Settings" className={s.tool_icon} />
                  {t('edit', { ns: 'other' })}
                </button>
              </li>

              <li className={s.tool_item}>
                <button
                  className={s.tool_btn}
                  type="button"
                  disabled={ip?.no_delete?.$ === 'on' || !rights?.delete}
                  onClick={() => handleToolBtnClick(setElidForDeleteModal, ip?.id.$)}
                >
                  <Icon name="Delete" className={s.tool_icon} />
                  {t('delete', { ns: 'other' })}
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {ip?.is_main?.$ === 'on' && (
        <div className={s.main_ip}>
          <div className={s.triangle}></div>
        </div>
      )}

      <span className={s.label}>{t('ip_address')}:</span>
      <span className={s.value}>{ip?.name?.$}</span>

      <span className={s.label}>{t('mask', { ns: 'dedicated_servers' })}:</span>
      <span className={s.value}>{ip?.mask?.$}</span>

      <span className={s.label}>{t('gateway', { ns: 'dedicated_servers' })}:</span>
      <span className={s.value}>{ip?.gateway?.$}</span>

      <span className={s.label}>{t('domain', { ns: 'dedicated_servers' })}:</span>
      <span className={s.value}>{ip?.domain?.$}</span>

      {/* <span className={s.label}>{t('type', { ns: 'dedicated_servers' })}:</span>
      <span className={s.value}>{t(ip?.type?.$, { ns: 'dedicated_servers' })}</span> */}

      <span className={s.label}>{t('status', { ns: 'other' })}:</span>
      <span className={s.value}>{t(ip?.ip_status?.$?.trim(), { ns: 'other' })}</span>
    </li>
  )
}

DedicIPMobileItem.propTypes = {
  server: PropTypes.object,
  setElidForEditModal: PropTypes.func,
  rights: PropTypes.object,
}
