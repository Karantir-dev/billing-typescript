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
  const navigate = useNavigate()

  const [serverName, setServerName] = useState(item.servername?.$ || '')

  const { isResized, displayStatus, isNotActive } = getInstanceMainInfo(item)

  const editServerName = value => {
    editInstance({
      value,
      elid: item.id.$,
      errorCallback: () => setServerName(serverName),
    })
    setServerName(value)
  }

  useEffect(() => {
    setServerName(item.servername?.$ || '')
  }, [item.servername?.$])

  const itemCountry = formatCountryName(item)

  return (
    <tr
      className={cn(s.tr, { [s.disabled]: isNotActive })}
      onClick={e => {
        if (
          optionsCell.current.contains(e.target) ||
          // checkboxCell.current.contains(e.target) ||
          servernameCell.current.contains(e.target) ||
          ipCell.current.contains(e.target) ||
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
        <span
          className={cn(
            s.status,
            s[
              item.fotbo_status?.$.trim().toLowerCase() ||
                item.item_status?.$.trim().toLowerCase()
            ],
          )}
        >
          {displayStatus}
          {isResized && (
            <HintWrapper
              popupClassName={s.popup}
              wrapperClassName={s.popup__wrapper}
              label={t('resize_popup_text')}
            >
              <Icon name="Attention" />
            </HintWrapper>
          )}
        </span>
      </td>
      <td className={s.td}>{item.pricelist.$}</td>
      <td className={s.td}>{item.cost.$.replace('Day', t('Day'))}</td>
      <td className={s.td}>
        {item?.datacentername && (
          <HintWrapper
            popupClassName={s.popup}
            wrapperClassName={cn(s.popup__wrapper, s.popup__wrapper_flag)}
            label={itemCountry}
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
      <td ref={ipCell} className={s.td}>
        <div className={s.ip_cell}>
          <span>{item.ip?.$}</span>
          {item.ip?.$ && (
            <div className={s.fade_in}>
              <CopyText text={item.ip?.$} />
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
