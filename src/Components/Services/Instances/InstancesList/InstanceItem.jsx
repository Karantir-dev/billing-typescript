import { useEffect, useRef, useState } from 'react'
import s from './InstancesList.module.scss'
import cn from 'classnames'
import { CopyText, EditCell, HintWrapper, Icon, InstancesOptions } from '@components'
import * as route from '@src/routes'
import { useNavigate } from 'react-router-dom'
import { getFlagFromCountryName, getInstanceMainInfo, formatCountryName } from '@utils'
import { useTranslation } from 'react-i18next'

export default function InstanceItem({ item, editInstance }) {
  const { t } = useTranslation(['cloud_vps', 'vds', 'countries'])

  const optionsCell = useRef()
  // const checkboxCell = useRef()
  const servernameCell = useRef()
  const ipCell = useRef()
  const hintCell = useRef()
  const navigate = useNavigate()

  const [serverName, setServerName] = useState(item.servername?.$ || '')

  const { isResized, displayStatus, isNotActive, isDeleting, isSuspended } =
    getInstanceMainInfo(item)

  const editServerName = value => {
    const slicedValue = value.slice(0, 100)
    editInstance({
      value: slicedValue,
      elid: item.id.$,
      errorCallback: () => setServerName(serverName),
    })
    setServerName(value)
  }

  useEffect(() => {
    setServerName(item.servername?.$ || '')
  }, [item.servername?.$])

  const itemCountry = formatCountryName(item)

  const ip = item.ip?.$ || item.ip_v6?.$

  const isHintStatus = isSuspended || isResized
  const hintMessage = isResized ? t('resize_popup_text') : t('by_admin')

  return (
    <tr
      className={cn(s.tr, { [s.disabled]: isNotActive })}
      onClick={e => {
        if (
          optionsCell.current.contains(e.target) ||
          // checkboxCell.current.contains(e.target) ||
          servernameCell.current.contains(e.target) ||
          ipCell.current.contains(e.target) ||
          hintCell.current.contains(e.target) ||
          isNotActive
        )
          return
        navigate(`${route.CLOUD_VPS}/${item.id.$}`, { state: item })
      }}
    >
      {/* <td ref={checkboxCell}>
        <CheckBox />
      </td> */}
      <td ref={servernameCell} className={cn(s.td, s.servername_cell)}>
        <EditCell
          originName={serverName}
          onSubmit={editServerName}
          placeholder={t(serverName || t('server_placeholder', { ns: 'vds' }), {
            ns: 'vds',
          })}
          isShadow={true}
        />
      </td>
      <td className={s.td}>
        <div className={s.status_wrapper} ref={hintCell}>
          {isHintStatus ? (
            <HintWrapper
              popupClassName={s.popup}
              wrapperClassName={s.popup__wrapper}
              label={hintMessage}
            >
              <span
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
              </span>
            </HintWrapper>
          ) : (
            <span
              className={cn(
                s.status,
                s[
                  item?.instance_status?.$.trim().toLowerCase() ||
                    item?.item_status?.$.trim().toLowerCase()
                ],
              )}
            >
              {displayStatus}
            </span>
          )}
        </div>
      </td>
      <td className={s.td}>{item.pricelist.$.split('|')[0]}</td>
      <td className={s.td}>{item.cost.$.replace('Day', t('day'))}</td>
      <td className={s.td}>
        {item?.datacentername && (
          <HintWrapper
            popupClassName={s.popup}
            wrapperClassName={cn(s.popup__wrapper, s.popup__wrapper_flag)}
            label={t(itemCountry, { ns: 'countries' })}
          >
            <img
              src={require(`@images/countryFlags/${getFlagFromCountryName(
                itemCountry,
              )}.png`)}
              width={20}
              height={14}
              alt={itemCountry}
            />
          </HintWrapper>
        )}
      </td>
      <td className={s.td}>{item.createdate.$}</td>
      <td className={s.td}>
        <HintWrapper
          popupClassName={s.popup}
          wrapperClassName={s.popup__wrapper}
          label={item.instances_os.$}
        >
          <Icon name={item.instances_os.$.split(/[\s-]+/)[0]} />
        </HintWrapper>
      </td>
      <td className={s.td}>
        <div className={s.ip_cell} ref={ipCell}>
          <span>{ip}</span>
          {ip && (
            <div className={s.fade_in}>
              <CopyText text={ip} promptText={t('ip_address_copied')} />
            </div>
          )}
        </div>
      </td>
      <td className={s.td} ref={optionsCell}>
        <InstancesOptions item={item} />
      </td>
    </tr>
  )
}
