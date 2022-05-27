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
  On_Off,
  CheckCircle,
  InProgress,
  Attention,
} from '../../../images'
import { useOutsideAlerter } from '../../../utils'
import { HintWrapper } from '../..'

import s from './VDSmobileItem.module.scss'

export default function VDSmobileItem({ server, setElidForEditModal }) {
  const { t } = useTranslation(['vds', 'other'])
  const dropdownEl = useRef()

  const [toolsOpened, setToolsOpened] = useState(false)
  useOutsideAlerter(dropdownEl, toolsOpened, () => setToolsOpened(false))

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
                  onClick={() => setElidForEditModal(server.id.$)}
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
      <span>
        {server?.item_status?.$orig === '2' && (
          <HintWrapper label={t('active')}>
            <On_Off className={s.green_icon} />
          </HintWrapper>
        )}
        {server?.item_status?.$orig === '1' && (
          <HintWrapper label={t('ordered')}>
            <CheckCircle className={s.check_icon} />
          </HintWrapper>
        )}
        {server?.item_status?.$orig === '5_open' && (
          <HintWrapper label={t('in_progress')}>
            <InProgress />
          </HintWrapper>
        )}
        {server?.item_status?.$orig === '3_employeesuspend' && (
          <HintWrapper label={t('stopped_by_admin')}>
            <Attention />
          </HintWrapper>
        )}
        {server?.item_status?.$orig === '3_autosuspend' && (
          <HintWrapper label={t('stopped')}>
            <Attention />
          </HintWrapper>
        )}
        {server?.autoprolong?.$ && (
          <HintWrapper label={t('auto_prolong')}>
            <Clock className={s.green_icon} />
          </HintWrapper>
        )}
      </span>
      <span className={s.label}>{t('created')}:</span>
      <span className={s.value}>{server?.createdate?.$}</span>
      <span className={s.label}>{t('valid_until')}:</span>
      <span className={s.value}>{server?.expiredate?.$}</span>
    </li>
  )
}
