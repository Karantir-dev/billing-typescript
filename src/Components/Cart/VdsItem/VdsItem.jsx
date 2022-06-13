import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Shevron, Delete } from '../../../images'
import cn from 'classnames'
import { useMediaQuery } from 'react-responsive'

import s from './VdsItem.module.scss'

export default function VdsItem({ el }) {
  const { t } = useTranslation(['vds'])
  const tabletOrHigher = useMediaQuery({ query: '(min-width: 768px)' })
  console.log(el)

  const [dropOpened, setDropOpened] = useState(false)

  const tariffName = el?.desc?.$.match(/(?<=<b>)(.+?)(?= \(base price\))/g)

  // const renderDesc = () => {}
  return (
    <>
      <div className={s.server_item}>
        <button
          className={s.shevron_btn}
          type="button"
          onClick={() => setDropOpened(!dropOpened)}
        >
          <Shevron className={cn({ [s.shevron]: true, [s.opened]: dropOpened })} />
        </button>
        <button className={s.btn_delete} type="button" onClick={() => {}}>
          <Delete />
        </button>
        {tabletOrHigher && (
          <img src={require('./../../../images/services/vds.webp')} alt="vds" />
        )}
        <p className={s.tariff_name}>{tariffName}</p>
        {el?.discount_percent?.$ && (
          <p className={s.discount_wrapper}>
            <span className={s.percent}>-{el?.discount_percent?.$}</span>
            {'  '}
            <span className={s.old_price}>{el?.fullcost?.$} EUR</span>
          </p>
        )}
        <p className={s.price}>{el?.cost?.$} EUR</p>
        <div className={s.dropdown}>
          <p>
            {t('processors')}:
            <span className={s.value}>
              {el?.desc?.$.match(/(?<=CPU count)(.+?)(?=<br\/>)/g)}
            </span>
          </p>
          <p>
            {t('memory')}:
            <span className={s.value}>
              {el?.desc?.$.match(/(?<=Memory)(.+?)(?=<br\/>)/g)}
            </span>
          </p>
          <p>
            {t('disk_space')}:
            <span className={s.value}>
              {el?.desc?.$.match(/(?<=Disk space)(.+?)(?=<br\/>)/g)}
            </span>
          </p>
          <p>
            {t('IPcount')}:
            <span className={s.value}>
              {el?.desc?.$.match(/(?<=IP-addresses count)(.+?)(?=<br\/>)/g)}
            </span>
          </p>
          <p>
            {t('port_speed')}:
            <span className={s.value}>
              {el?.desc?.$.match(/(?<=Port speed)(.+?)(?=<br\/>)/g)}
            </span>
          </p>
          <p>
            {t('license_to_panel')}:
            <span className={s.value}>
              {el?.desc?.$.match(/(?<=Control panel)(.+?)(?=$)/g)}
            </span>
          </p>
        </div>
      </div>

      <div className={cn({ [s.additional_info_item]: true, [s.opened]: dropOpened })}>
        {/* {renderDesc()?.ipAmount && desc.includes('IP-addresses count') && (
          <p className={s.service_name}>
            {t('count_ip', { ns: 'dedicated_servers' })}:
            {renderDesc()?.ipAmount?.split('-')[0]}
          </p>
        )}
        {renderDesc()?.managePanel && desc.includes('Control panel') && (
          <p className={s.service_name}>
            {t('manage_panel', { ns: 'dedicated_servers' })}:
            {renderDesc()?.managePanel?.split('-')[0]}
          </p>
        )}
        {renderDesc()?.postSpeed && desc.includes('Port speed') && (
          <p className={s.service_name}>
            {t('port_speed', { ns: 'dedicated_servers' })}:
            {renderDesc()?.postSpeed?.split('-')[0]}
          </p>
        )} */}
      </div>
    </>
  )
}
