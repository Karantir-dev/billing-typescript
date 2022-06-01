import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, IconButton } from '../../..'
import * as routes from '../../../../routes'
import s from './DedicatedServersFilters.module.scss'

export default function DedicatedServersFilters() {
  const { t } = useTranslation(['domains', 'other'])
  const navigate = useNavigate()

  return (
    <div className={s.filterBlock}>
      <div className={s.formBlock}>
        <div className={s.filterBtnBlock}>
          <IconButton onClick={() => null} icon="filter" className={s.calendarBtn} />
        </div>
        <IconButton onClick={() => null} icon="edit" className={s.archiveBtn} />
        <IconButton onClick={() => null} icon="clock" className={s.archiveBtn} />
        <IconButton onClick={() => null} icon="refund" className={s.archiveBtn} />
        <IconButton onClick={() => null} icon="transfer" className={s.archiveBtn} />
        <IconButton onClick={() => null} icon="whois" className={s.archiveBtn} />
        <IconButton onClick={() => null} icon="server-cloud" className={s.archiveBtn} />
      </div>
      <Button
        className={s.newServerBtn}
        isShadow
        size="medium"
        label={t('Order')}
        type="button"
        onClick={() => navigate(routes.DEDICATED_SERVERS_ORDER)}
      />
    </div>
  )
}

DedicatedServersFilters.propTypes = {
  selctedServer: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.object]),
}

DedicatedServersFilters.defaultProps = {
  selctedServer: null,
}
