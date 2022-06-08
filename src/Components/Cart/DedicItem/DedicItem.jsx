import React, { useState } from 'react'
import {} from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Shevron } from '../../../images'
import s from './DedicItem.module.scss'
import classNames from 'classnames'

export default function DedicItem(props) {
  const { t } = useTranslation(['cart', 'dedicated_servers', 'other'])

  const { desc, cost, discount_percent, fullcost, pricelist_name } = props

  console.log(desc)

  const [dropOpened, setDropOpened] = useState(false)

  const renderDesc = () => {
    const beforeWord = 'Панель управления сервером'
    const afterWord = '<br/>Количество IP-адресов'

    const managePanel = desc.slice(
      desc.indexOf(beforeWord) + beforeWord?.length,
      desc.indexOf(afterWord),
    )

    const beforeWordProtect = 'Количество IP-адресов'

    const ipAmount = desc.slice(
      desc.indexOf(beforeWordProtect) + beforeWordProtect?.length,
    )

    const postSpeed = desc.slice(
      desc.indexOf(beforeWord) + beforeWord?.length,
      desc.indexOf(afterWord),
    )

    return {
      managePanel,
      ipAmount,
      postSpeed,
    }
  }

  return (
    <>
      <div className={s.server_item}>
        <button className={s.shevron_btn} onClick={() => setDropOpened(!dropOpened)}>
          <Shevron
            className={classNames({ [s.shevron]: true, [s.opened]: dropOpened })}
          />
        </button>

        <img src={require('./../../../images/cart/domains.png')} alt="domains" />
        <div className={s.priceList}>
          <div className={s.server_info}>
            <span className={s.domainName}>{pricelist_name}</span>
          </div>
          <div className={s.costBlock}>
            <div className={s.cost}>
              {cost} EUR/{t('year', { ns: 'other' }).toLowerCase()}
            </div>
            {discount_percent && (
              <div className={s.discountBlock}>
                <span className={s.discountPerCent}>-{discount_percent}</span>
                <span className={s.fullcost}>{fullcost} EUR</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className={classNames({ [s.additional_info_item]: true, [s.opened]: dropOpened })}
      >
        {renderDesc()?.ipAmount && (
          <p className={s.service_name}>
            {t('count_ip', { ns: 'dedicated_servers' })}
            {t(renderDesc()?.ipAmount?.split('-')[0])}
          </p>
        )}
        {renderDesc()?.managePanel && (
          <p className={s.service_name}>
            {t('manage_panel', { ns: 'dedicated_servers' })}
            {t(renderDesc()?.managePanel?.split('-')[0])}
          </p>
        )}
        {renderDesc()?.postSpeed && (
          <p className={s.service_name}>
            {t('port_speed', { ns: 'dedicated_servers' })}
            {t(renderDesc()?.postSpeed?.split('-')[0])}
          </p>
        )}
      </div>
    </>
  )
}
