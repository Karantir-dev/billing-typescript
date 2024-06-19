import { useRef } from 'react'
import s from './InstancesList.module.scss'
import cn from 'classnames'
import { CopyText, Icon, InstancesOptions, TooltipWrapper } from '@components'
import * as route from '@src/routes'
import { useNavigate } from 'react-router-dom'
import {
  getFlagFromCountryName,
  getInstanceMainInfo,
  formatCountryName,
  cutDcSuffix,
} from '@utils'
import { useTranslation } from 'react-i18next'

export default function InstanceItemMobile({ item }) {
  const { t } = useTranslation(['cloud_vps'])
  const optionsBlock = useRef()
  const ipCell = useRef()
  const navigate = useNavigate()

  const { isResized, displayStatus, displayName, isNotActive, isDeleting, isSuspended } =
    getInstanceMainInfo(item)

  const itemCountry = formatCountryName(item)
  const ip = item.ip?.$ || item.ip_v6?.$

  const isHintStatus = isSuspended || isResized
  const hintMessage = isResized ? t('resize_popup_text') : t('by_admin')

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
          <div className={s.status_wrapper}>
            {isHintStatus ? (
              <TooltipWrapper
                popupClassName={s.popup}
                wrapperClassName={s.popup__wrapper}
                label={hintMessage}
              >
                <p
                  className={cn(
                    s.status,
                    s[
                      isDeleting
                        ? 'deletion_in_progress'
                        : item?.instance_status?.$.trim().toLowerCase() ||
                          item?.item_status?.$.trim().toLowerCase()
                    ],
                  )}
                >
                  {displayStatus}
                  <Icon name="Attention" />
                </p>
              </TooltipWrapper>
            ) : (
              <p
                className={cn(
                  s.status,
                  s[
                    item.instance_status?.$.trim().toLowerCase() ||
                      item.item_status?.$.trim().toLowerCase()
                  ],
                )}
              >
                {displayStatus}
              </p>
            )}
          </div>
        </div>
        <div ref={optionsBlock}>
          <InstancesOptions item={item} isMobile />
        </div>
      </div>
      <div className={s.mobile_item__body}>
        <p className={s.mobile_item__param}>{t('Flavor')}</p>
        <p className={s.mobile_item__value}>{cutDcSuffix(item.pricelist.$)}</p>

        <p className={s.mobile_item__param}>{t('Price')}</p>
        <p className={s.mobile_item__value}>{item.cost.$}</p>

        <p className={s.mobile_item__param}>{t('Region')}</p>
        <p className={s.mobile_item__value}>
          {item?.datacentername && (
            <img
              src={require(
                `@images/countryFlags/${getFlagFromCountryName(itemCountry)}.png`,
              )}
              width={20}
              height={14}
              alt={itemCountry}
            />
          )}
        </p>

        <p className={s.mobile_item__param}>{t('Created at')}</p>
        <p className={s.mobile_item__value}>{item.createdate.$}</p>

        <p className={s.mobile_item__param}>{t('OS')}</p>
        <p className={s.mobile_item__value}>
          <Icon name={item.instances_os.$.split(/[\s-]+/)[0]} />
        </p>

        <p className={s.mobile_item__param}>{t('Access IP')}</p>
        <p className={s.mobile_item__value} ref={ipCell}>
          <span className={s.ip_cell}>
            <span>{ip}</span>{' '}
            {ip && <CopyText text={ip} promptText={t('ip_address_copied')} />}
          </span>
        </p>
      </div>
    </div>
  )
}
