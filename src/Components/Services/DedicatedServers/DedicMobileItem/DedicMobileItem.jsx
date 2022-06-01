import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Clock,
  MoreDots,
  Edit,
  PassChange,
  Reload,
  Refund,
  IP,
  Info,
  Delete,
  ExitSign,
} from '../../../../images'
import { useOutsideAlerter } from '../../../../utils'
// import { ServerState } from '../..'
import PropTypes from 'prop-types'

import s from './DedicMobileItem.module.scss'

export default function DedicMobileItem({ server, setElidForEditModal }) {
  const { t } = useTranslation(['vds', 'other'])
  const dropdownEl = useRef()

  const [toolsOpened, setToolsOpened] = useState(false)
  useOutsideAlerter(dropdownEl, toolsOpened, () => setToolsOpened(false))

  const handleToolBtnClick = (fn, id) => {
    fn(id)
    setToolsOpened(false)
  }

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
                  onClick={() => handleToolBtnClick(setElidForEditModal, server.id.$)}
                >
                  <Edit className={s.tool_icon} />
                  {t('edit', { ns: 'other' })}
                </button>
              </li>
              <li className={s.tool_item}>
                <button
                  className={s.tool_btn}
                  type="button"
                  disabled={server.allow_changepassword?.$ !== 'on'}
                >
                  <PassChange className={s.tool_icon} />
                  {t('password_change')}
                </button>
              </li>
              <li className={s.tool_item}>
                <button
                  className={s.tool_btn}
                  type="button"
                  disabled={server.show_reboot?.$ !== 'on'}
                >
                  <Reload className={s.tool_icon} />
                  {t('reload')}
                </button>
              </li>
              <li className={s.tool_item}>
                <button
                  className={s.tool_btn}
                  type="button"
                  disabled={server.has_ip_pricelist?.$ !== 'on'}
                >
                  <IP className={s.tool_icon} />
                  {t('ip_addresses')}
                </button>
              </li>
              <li className={s.tool_item}>
                <button
                  className={s.tool_btn}
                  type="button"
                  disabled={server?.status?.$ !== '2'}
                >
                  <Clock className={s.tool_icon} />
                  {t('prolong')}
                </button>
              </li>
              <li className={s.tool_item}>
                <button className={s.tool_btn} type="button">
                  <Refund className={s.tool_icon} />
                  {t('history')}
                </button>
              </li>
              <li className={s.tool_item}>
                <button
                  className={s.tool_btn}
                  type="button"
                  disabled={server?.status?.$ !== '2'}
                >
                  <Info className={s.tool_icon} />
                  {t('instruction')}
                </button>
              </li>
              <li className={s.tool_item}>
                <button
                  className={s.tool_btn}
                  type="button"
                  disabled={server.transition?.$ !== 'on'}
                >
                  <ExitSign className={s.tool_icon} />
                  {t('go_to_panel')}
                </button>
              </li>
              <li className={s.tool_item}>
                <button className={s.tool_btn} type="button">
                  <Delete className={s.tool_icon} />
                  {t('delete', { ns: 'other' })}
                </button>
              </li>
            </ul>
          </div>
        )}
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
      {/* <ServerState server={server} /> */}
      <span className={s.label}>{t('created')}:</span>
      <span className={s.value}>{server?.createdate?.$}</span>
      <span className={s.label}>{t('valid_until')}:</span>
      <span className={s.value}>{server?.expiredate?.$}</span>
    </li>
  )
}

DedicMobileItem.propTypes = {
  server: PropTypes.object,
  setElidForEditModal: PropTypes.func,
}
