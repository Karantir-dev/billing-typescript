import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, useNavigate } from 'react-router-dom'
import * as route from '../../../routes'

import cn from 'classnames'
import s from './VDS.module.scss'
import { Button, IconButton, VDSList } from '../../../Components'
import { useDispatch } from 'react-redux'
import { vdsOperations } from '../../../Redux'

export default function VDS() {
  const dispatch = useDispatch()
  const { t } = useTranslation(['vds', 'other'])
  const navigate = useNavigate()

  const [servers, setServers] = useState()
  const [elidForEditModal, setElidForEditModal] = useState(false)

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
      <div className={s.mobile_filter_wrapper}>
        <IconButton icon="filter" />
        <Button
          className={s.btn_order}
          isShadow
          type="button"
          label={t('to_order', { ns: 'other' })}
          onClick={() => navigate(route.VDS_ORDER)}
        />
      </div>

      <VDSList servers={servers} setElidForEditModal={setElidForEditModal} />
      {elidForEditModal && <h1>EDIT MODAL</h1>}
    </>
  )
}
