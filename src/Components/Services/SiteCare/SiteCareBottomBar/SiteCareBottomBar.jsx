import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { IconButton, TooltipWrapper } from '@components'

import s from './SiteCareBottomBar.module.scss'
import { roundToDecimal } from '@src/utils'

export default function VDS(props) {
  const { t } = useTranslation(['vds', 'other', 'access_log'])

  const { selctedItem, deleteSiteCare, renewDomainHandler, rights, setDeleteIds } = props

  const domainsTotalPrice = selctedItem?.reduce((curServer, nextServer) => {
    return curServer + +nextServer?.item_cost?.$
  }, 0)

  const parseSelectedItemId = () => {
    let id = []
    selctedItem?.forEach(el => {
      id.push(el?.id?.$)
    })
    return id?.join(', ')
  }

  const checkProlongSelctedItemStatus = () => {
    let blocked = false
    selctedItem?.forEach(el => {
      if (el?.item_status?.$orig === '1') {
        blocked = true
      }
    })
    return blocked
  }

  return (
    <div className={cn(s.tools_footer, { [s.isopen]: selctedItem?.length !== 0 })}>
      {selctedItem?.length !== 0 && (
        <div className={s.buttons_wrapper}>
          <TooltipWrapper content={t('delete', { ns: 'other' })} id="siteCare_delete">
            <IconButton
              className={s.tools_icon}
              disabled={
                selctedItem.some(
                  item => item?.status?.$ === '5' || item?.scheduledclose?.$ === 'on',
                ) || !rights?.delete
              }
              onClick={() => {
                setDeleteIds(parseSelectedItemId())
                deleteSiteCare()
              }}
              icon="delete"
            />
          </TooltipWrapper>

          <TooltipWrapper content={t('prolong', { ns: 'vds' })} id="siteCare_prolong">
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
          </TooltipWrapper>
        </div>
      )}
      <p className={s.services_selected}>
        {t('services_selected', { ns: 'other' })}{' '}
        <span className={s.tools_footer_value}>{selctedItem?.length || '0'}</span>
      </p>
      <p className={s.total_price}>
        {t('total', { ns: 'other' })}:{' '}
        <span className={s.tools_footer_value}>
          {roundToDecimal(domainsTotalPrice) || '0'} EUR /{' '}
          {t('short_month', { ns: 'other' })}
        </span>
      </p>
    </div>
  )
}
