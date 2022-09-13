import React from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { IconButton, HintWrapper } from '../../../../Components'

import s from './DomainBottomBar.module.scss'

export default function VDS(props) {
  const { t } = useTranslation(['vds', 'other', 'access_log'])

  const { selctedItem, NSDomainHandler, renewDomainHandler, editDomainHandler, rights } =
    props

  const domainsTotalPrice = selctedItem?.reduce((curServer, nextServer) => {
    return curServer + +nextServer?.item_cost?.$
  }, 0)

  const checkProlongSelctedItemStatus = () => {
    let blocked = false
    selctedItem?.forEach(el => {
      if (el?.item_status?.$orig === '1') {
        blocked = true
      }
    })
    return blocked
  }

  const checkNSSelctedItemStatus = () => {
    let blocked = false
    selctedItem?.forEach(el => {
      if (
        el?.item_status?.$orig === '5_open' ||
        el?.item_status?.$orig === '3_autosuspend'
      ) {
        blocked = true
      }
    })
    return blocked
  }

  return (
    <div className={cn(s.tools_footer, { [s.isopen]: selctedItem?.length !== 0 })}>
      {selctedItem?.length !== 0 && (
        <div className={s.buttons_wrapper}>
          <HintWrapper label={t('edit', { ns: 'other' })}>
            <IconButton
              className={s.tools_icon}
              disabled={selctedItem?.length === 0 || !rights?.edit}
              onClick={() => editDomainHandler()}
              icon="edit"
            />
          </HintWrapper>

          <HintWrapper label={t('prolong', { ns: 'vds' })}>
            <IconButton
              className={s.tools_icon}
              disabled={
                selctedItem?.length === 0 ||
                checkProlongSelctedItemStatus() ||
                !rights?.prolong
              }
              onClick={() => renewDomainHandler()}
              icon="clock"
            />
          </HintWrapper>

          <HintWrapper label={t('View/change the list of nameservers')}>
            <IconButton
              className={s.tools_icon}
              disabled={
                selctedItem?.length === 0 || !rights?.ns || checkNSSelctedItemStatus()
              }
              onClick={() => NSDomainHandler()}
              icon="server-cloud"
            />
          </HintWrapper>
        </div>
      )}
      <p className={s.services_selected}>
        {t('services_selected', { ns: 'other' })}{' '}
        <span className={s.tools_footer_value}>{selctedItem?.length || '0'}</span>
      </p>
      <p className={s.total_price}>
        {t('total', { ns: 'other' })}:{' '}
        <span className={s.tools_footer_value}>
          {domainsTotalPrice || '0'} EUR / {t('short_month', { ns: 'other' })}
        </span>
      </p>
    </div>
  )
}