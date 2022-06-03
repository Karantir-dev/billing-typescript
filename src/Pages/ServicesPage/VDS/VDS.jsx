import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, useNavigate } from 'react-router-dom'
import * as route from '../../../routes'
import cn from 'classnames'
import {
  Button,
  IconButton,
  VDSList,
  HintWrapper,
  EditModal,
  Backdrop,
} from '../../../Components'
import { useDispatch } from 'react-redux'
import { vdsOperations } from '../../../Redux'
import { useMediaQuery } from 'react-responsive'

import s from './VDS.module.scss'

export default function VDS() {
  const widerThan1550 = useMediaQuery({ query: '(min-width: 1550px)' })
  const dispatch = useDispatch()
  const { t } = useTranslation(['vds', 'other'])
  const navigate = useNavigate()

  const [servers, setServers] = useState()
  const [elidForEditModal, setElidForEditModal] = useState(0)
  const [activeServer, setActiveServer] = useState(null)

  useEffect(() => {
    dispatch(vdsOperations.getVDS(setServers))
  }, [])

  return (
    <>
      <div>
        <NavLink to={route.SERVICES} className={s.breadcrumbs_link}>
          {t('breadcrumbs_services', { ns: 'other' })}
        </NavLink>
        <span className={s.breadcrumbs_separator}>{'>'}</span>
        <NavLink
          to={route.VDS}
          className={({ isActive }) =>
            cn(s.breadcrumbs_link, {
              [s.disabled]: isActive,
            })
          }
        >
          {t('servers_title')}
        </NavLink>
      </div>

      <h2 className={s.title}>{t('servers_title')}</h2>
      <div className={s.tools_wrapper}>
        <IconButton className={s.tools_icon} icon="filter" />

        {widerThan1550 && (
          <>
            <div className={s.edit_wrapper}>
              <HintWrapper label={t('edit', { ns: 'other' })}>
                <IconButton
                  className={s.tools_icon}
                  onClick={() => setElidForEditModal(activeServer.id.$)}
                  disabled={!activeServer}
                  icon="edit"
                />
              </HintWrapper>
              <HintWrapper label={t('delete', { ns: 'other' })}>
                <IconButton
                  className={s.tools_icon}
                  disabled={!activeServer}
                  icon="delete"
                />
              </HintWrapper>
            </div>

            <HintWrapper label={t('password_change')}>
              <IconButton
                className={s.tools_icon}
                disabled={activeServer?.allow_changepassword?.$ !== 'on'}
                icon="passChange"
              />
            </HintWrapper>
            <HintWrapper label={t('reload')}>
              <IconButton
                className={s.tools_icon}
                disabled={activeServer?.show_reboot?.$ !== 'on'}
                icon="reload"
              />
            </HintWrapper>
            <HintWrapper label={t('ip_addresses')}>
              <IconButton
                className={s.tools_icon}
                disabled={activeServer?.has_ip_pricelist?.$ !== 'on'}
                icon="ip"
              />
            </HintWrapper>
            <HintWrapper label={t('prolong')}>
              <IconButton
                className={s.tools_icon}
                disabled={activeServer?.status?.$ !== '2'}
                icon="clock"
              />
            </HintWrapper>
            <HintWrapper label={t('history')}>
              <IconButton
                className={s.tools_icon}
                disabled={!activeServer}
                icon="refund"
              />
            </HintWrapper>
            <HintWrapper label={t('instruction')}>
              <IconButton
                className={s.tools_icon}
                disabled={activeServer?.status?.$ !== '2'}
                icon="info"
              />
            </HintWrapper>
            <HintWrapper label={t('go_to_panel')}>
              <IconButton
                className={s.tools_icon}
                disabled={activeServer?.transition?.$ !== 'on'}
                icon="exitSign"
              />
            </HintWrapper>
          </>
        )}
        <Button
          className={s.btn_order}
          isShadow
          type="button"
          label={t('to_order', { ns: 'other' })}
          onClick={() => navigate(route.VDS_ORDER)}
        />
      </div>

      <VDSList
        servers={servers}
        activeServerID={activeServer?.id.$}
        setElidForEditModal={setElidForEditModal}
        setActiveServer={setActiveServer}
      />

      <Backdrop
        className={s.backdrop}
        isOpened={Boolean(elidForEditModal)}
        onClick={() => setElidForEditModal(0)}
      >
        <EditModal elid={elidForEditModal} closeFn={() => setElidForEditModal(0)} />
      </Backdrop>
    </>
  )
}
