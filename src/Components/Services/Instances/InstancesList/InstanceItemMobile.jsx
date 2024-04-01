import { useRef } from 'react'
import s from './InstancesList.module.scss'
import cn from 'classnames'
import { CopyText, Icon, InstancesOptions } from '@components'
import * as route from '@src/routes'
import { useNavigate } from 'react-router-dom'
import { getFlagFromCountryName, getInstanceMainInfo, formatCountryName } from '@utils'
import { useTranslation } from 'react-i18next'

export default function InstanceItemMobile({ item }) {
  const { t } = useTranslation(['cloud_vps'])
  const optionsBlock = useRef()
  const ipCell = useRef()
  const navigate = useNavigate()

  const { isResized, displayStatus, displayName, isNotActive } = getInstanceMainInfo(item)

  const itemCountry = formatCountryName(item)
  const ip = item.ip?.$ || item.ip_v6?.$

  return (
    <div
      className={s.mobile_item}
      onClick={e => {
        if (
          optionsBlock.current.contains(e.target) ||
          ipCell.current.contains(e.target) ||
          isNotActive
        )
          return
        navigate(`${route.CLOUD_VPS}/${item.id.$}`, { state: item })
      }}
      tabIndex={0}
      onKeyUp={() => {}}
      role="button"
    >
      <div className={s.mobile_item__header}>
        <div className={s.mobile_item__header_name}>
          <p className={s.mobile_item__name}>{displayName}</p>
          <p
            className={cn(
              s.status,
              s[
                item.fotbo_status?.$.trim().toLowerCase() ||
                  item.item_status?.$.trim().toLowerCase()
              ],
            )}
          >
            {displayStatus}
            {isResized && <Icon name="Attention" />}
          </p>
        </div>
        <div ref={optionsBlock}>
          <InstancesOptions item={item} isMobile />
        </div>
      </div>
      <div className={s.mobile_item__body}>
        <p className={s.mobile_item__param}>Flavor</p>
        <p className={s.mobile_item__value}>{item.pricelist.$}</p>

        <p className={s.mobile_item__param}>Price</p>
        <p className={s.mobile_item__value}>{item.cost.$}</p>

        <p className={s.mobile_item__param}>Region</p>
        <p className={s.mobile_item__value}>
          {item?.datacentername && (
            <img
              src={require(`@images/countryFlags/${getFlagFromCountryName(
                itemCountry,
              )}.png`)}
              width={20}
              height={14}
              alt={itemCountry}
            />
          )}
        </p>

        <p className={s.mobile_item__param}>{t('Created at')}</p>
        <p className={s.mobile_item__value}>{item.createdate.$}</p>

        <p className={s.mobile_item__param}>OS</p>
        <p className={s.mobile_item__value}>
          <Icon name={item.instances_os.$.split(/[\s-]+/)[0]} />
        </p>

        <p className={s.mobile_item__param}>Access IP</p>
        <p className={s.mobile_item__value} ref={ipCell}>
          <span className={s.ip_cell}>
            <span>{ip}</span> {ip && <CopyText text={ip} />}
          </span>
        </p>
      </div>
    </div>
  )
}
