import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, useNavigate } from 'react-router-dom'
import * as route from '../../../routes'

import cn from 'classnames'
import s from './VDS.module.scss'
import { Button, IconButton, VDSList, HintWrapper } from '../../../Components'
import { useDispatch } from 'react-redux'
import { vdsOperations } from '../../../Redux'
import { useMediaQuery } from 'react-responsive'

export default function VDS() {
  const widerThan1550 = useMediaQuery({ query: '(min-width: 1550px)' })
  const dispatch = useDispatch()
  const { t } = useTranslation(['vds', 'other'])
  const navigate = useNavigate()

  const [servers, setServers] = useState()
  const [elidForEditModal, setElidForEditModal] = useState(false)
  const [activeServer, setActiveServer] = useState(null)

  console.log(activeServer)
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
        <HintWrapper label="">
          <IconButton className={s.tools_icon} icon="filter" />
        </HintWrapper>
        {widerThan1550 && (
          <>
            <div className={s.edit_wrapper}>
              <IconButton className={s.tools_icon} icon="edit" />
              <IconButton className={s.tools_icon} icon="delete" />
            </div>
            <IconButton className={s.tools_icon} icon="passChange" />
            <IconButton className={s.tools_icon} icon="reload" />
            <IconButton className={s.tools_icon} icon="ip" />
            <IconButton className={s.tools_icon} icon="clock" />
            <IconButton className={s.tools_icon} icon="refund" />
            <IconButton className={s.tools_icon} icon="info" />
            <IconButton className={s.tools_icon} icon="exitSign" />
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
        setElidForEditModal={setElidForEditModal}
        setActiveServer={setActiveServer}
      />
      {elidForEditModal && <h1>EDIT MODAL</h1>}
    </>
  )
}
