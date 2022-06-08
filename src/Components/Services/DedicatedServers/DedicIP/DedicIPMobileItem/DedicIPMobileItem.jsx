import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
// import { useNavigate } from 'react-router-dom'
// import * as route from '../../../../../routes'
import { MoreDots, Delete, Settings, Flag } from '../../../../../images'
import { useOutsideAlerter } from '../../../../../utils'
import PropTypes from 'prop-types'

import s from './DedicIPMobileItem.module.scss'
import HintWrapper from '../../../../ui/HintWrapper/HintWrapper'

export default function DedicIPMobileItem({
  ip,
  setElidForEditModal,
  setElidForDeleteModal,
}) {
  const { t } = useTranslation(['vds', 'dedicated_servers', 'other'])
  const dropdownEl = useRef()

  const [toolsOpened, setToolsOpened] = useState(false)
  //   const navigate = useNavigate()

  useOutsideAlerter(dropdownEl, toolsOpened, () => setToolsOpened(false))

  const handleToolBtnClick = (fn, id) => {
    fn(id)
    setToolsOpened(false)
  }

  console.log(ip)

  return (
    <li className={s.item}>
      <div className={s.dots_wrapper}>
        <button className={s.dots_btn} type="button" onClick={() => setToolsOpened(true)}>
          <MoreDots />
        </button>

        {toolsOpened && (
          <div className={s.dropdown} ref={dropdownEl}>
            <div className={s.pointer_wrapper}>
              <div className={s.pointer}></div>
            </div>
            <ul>
              <li className={s.tool_item}>
                <button
                  className={s.tool_btn}
                  type="button"
                  onClick={() => handleToolBtnClick(setElidForEditModal, ip?.id.$)}
                >
                  <Settings className={s.tool_icon} />
                  {t('edit', { ns: 'other' })}
                </button>
              </li>

              <li className={s.tool_item}>
                <button
                  className={s.tool_btn}
                  type="button"
                  disabled={ip?.no_delete?.$ === 'on'}
                  onClick={() => handleToolBtnClick(setElidForDeleteModal, ip?.id.$)}
                >
                  <Delete className={s.tool_icon} />
                  {t('Remove')}
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {ip?.is_main?.$ === 'on' && (
        <div className={s.hint_wrapper}>
          <HintWrapper label={t('main_ip', { ns: 'dedicated_servers' })}>
            <Flag className={s.flag_icon} />
          </HintWrapper>
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

      <span className={s.label}>{t('type', { ns: 'dedicated_servers' })}:</span>
      <span className={s.value}>{t(ip?.type?.$, { ns: 'dedicated_servers' })}</span>

      <span className={s.label}>{t('status', { ns: 'other' })}:</span>
      <span className={s.value}>{t(ip?.ip_status?.$?.trim(), { ns: 'other' })}</span>
    </li>
  )
}

DedicIPMobileItem.propTypes = {
  server: PropTypes.object,
  setElidForEditModal: PropTypes.func,
}
