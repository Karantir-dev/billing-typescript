import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { Backdrop, BreadCrumbs, IconButton, IPeditModal, Icon } from '@components'
import { vdsOperations } from '@redux'
import { useMediaQuery } from 'react-responsive'
import cn from 'classnames'
import * as route from '@src/routes'

import s from './VDSip.module.scss'


export default function VDSip() {
  const { t } = useTranslation(['vds', 'dedicated_servers', 'other'])
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const widerThan900px = useMediaQuery({ query: '(min-width: 900px)' })

  const [elements, setElements] = useState()
  const [name, setName] = useState('')
  const [idForEditModal, setIdForEditModal] = useState()

  const ServerID = location?.state?.id
  useEffect(() => {
    if (!ServerID) {
      navigate(route.VPS, { replace: true })
    } else {
      dispatch(vdsOperations.getIpInfo(ServerID, setElements, setName))
    }
  }, [])

  return (
    <>
      <BreadCrumbs pathnames={location?.pathname.split('/')} />
      {elements && (
        <>
          <p className={s.title}>
            <span className={s.bold}>
              {t('ip_address')} — {name.split('(')[0]}
            </span>
            {'(' + name.split('(')[1]}
          </p>

          {widerThan900px && (
            <ul className={s.table_headrow}>
              <li className={s.desktop_label}>{t('ip_address')}:</li>
              <li className={s.desktop_label}>
                {t('mask', { ns: 'dedicated_servers' })}:
              </li>
              <li className={s.desktop_label}>
                {t('gateway', { ns: 'dedicated_servers' })}:
              </li>
              <li className={s.desktop_label}>
                {t('domain', { ns: 'dedicated_servers' })}:
              </li>
              <li className={s.desktop_label}>{t('status', { ns: 'other' })}:</li>
            </ul>
          )}

          <ul className={s.list}>
            {elements.map(el => {
              const status = el.ip_status.$orig
              let statusText
              switch (status) {
                case '2':
                  statusText = t('active')
                  break
                case '5_open':
                  statusText = t('in_progress')
                  break
                default:
                  statusText = 'STATUS'
                  break
              }
              return widerThan900px ? (
                <li key={el.id.$} className={s.table_row}>
                  <span className={s.table_value}>{el.name.$}</span>
                  <span className={s.table_value}>{el.mask.$}</span>
                  <span className={s.table_value}>{el.gateway.$}</span>
                  <span className={s.table_value}>{el.domain.$}</span>
                  <span className={cn(s.table_value, { [s.green]: status === '2' })}>
                    {statusText}
                  </span>
                  <button
                    className={s.desktop_edit}
                    onClick={() => setIdForEditModal(el.id.$)}
                    type="button"
                  >
                    <Icon name="Edit" className={s.icon_edit} />
                  </button>
                </li>
              ) : (
                <li key={el.id.$} className={s.card}>
                  <div className={s.content}>
                    <div className={s.label}>{t('ip_address')}:</div>
                    <div className={s.value}>{el.name.$}</div>
                    <div className={s.label}>
                      {t('mask', { ns: 'dedicated_servers' })}:
                    </div>
                    <div className={s.value}>{el.mask.$}</div>
                    <div className={s.label}>
                      {t('gateway', { ns: 'dedicated_servers' })}:
                    </div>
                    <div className={s.value}>{el.gateway.$}</div>
                    <div className={s.label}>
                      {t('domain', { ns: 'dedicated_servers' })}:
                    </div>
                    <div className={s.value}>{el.domain.$}</div>
                    <div className={s.label}>{t('status', { ns: 'other' })}:</div>
                    <div className={cn(s.value, { [s.green]: status === '2' })}>
                      {statusText}
                    </div>
                  </div>
                  <IconButton
                    className={s.btn_edit}
                    icon="edit"
                    onClick={() => setIdForEditModal(el.id.$)}
                  />
                </li>
              )
            })}
          </ul>
        </>
      )}

      <Backdrop isOpened={!!idForEditModal} onClick={() => setIdForEditModal('')}>
        <IPeditModal
          serverID={ServerID}
          closeFn={() => setIdForEditModal('')}
          id={idForEditModal}
          setElements={setElements}
        />
      </Backdrop>
    </>
  )
}
