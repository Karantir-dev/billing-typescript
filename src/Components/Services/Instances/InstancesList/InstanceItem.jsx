/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react'
import s from './InstancesList.module.scss'
import cn from 'classnames'
import { CheckBox, EditCell, HintWrapper, Icon, Options } from '@components'
import * as route from '@src/routes'
import { useNavigate } from 'react-router-dom'
import { getFlagFromCountryName } from '@utils'
import { useTranslation } from 'react-i18next'
import { cloudVpsActions, cloudVpsOperations } from '@redux'
import { useDispatch } from 'react-redux'
import formatCountryName from '../ExternalFunc/formatCountryName'

export default function InstanceItem({ item, editInstance }) {
  const { t } = useTranslation(['cloud_vps', 'vds', 'countries'])

  const optionsCell = useRef()
  const checkboxCell = useRef()
  const servernameCell = useRef()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [serverName, setServerName] = useState(item.servername?.$ || '')

  const isNotActive =
    item.status.$ === '1' || item.status.$ === '4' || item.status.$ === '5'

  const isStopped = item.item_status.$orig === '2_2_16'

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

  const options = [
    {
      label: t(isStopped ? 'Start' : 'Shut down'),
      icon: 'Shutdown',
      onClick: () =>
        dispatch(
          cloudVpsActions.setItemForModals({
            confirm: { ...item, confirm_action: isStopped ? 'start' : 'stop' },
          }),
        ),
      disabled: isNotActive,
    },
    {
      label: t('Console'),
      icon: 'Console',
      disabled: isNotActive,
      onClick: () => dispatch(cloudVpsOperations.openConsole({ elid: item.id.$ })),
    },
    {
      label: t('Reboot'),
      icon: 'Reboot',
      disabled: isNotActive,
      onClick: () =>
        dispatch(
          cloudVpsActions.setItemForModals({
            confirm: { ...item, confirm_action: 'reboot' },
          }),
        ),
    },
    {
      label: t('Resize'),
      icon: 'Resize',
      disabled: isNotActive || item.change_pricelist?.$ === 'off',
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ resize: item })),
    },

    {
      label: t('Change password'),
      icon: 'ChangePassword',
      disabled: isNotActive,
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ change_pass: item })),
    },
    {
      label: t('Rescue'),
      icon: 'Rescue',
      disabled: isNotActive,
      onClick: () =>
        dispatch(
          cloudVpsActions.setItemForModals({
            rebuild: { ...item, rebuild_action: 'bootimage' },
          }),
        ),
    },
    {
      label: t('Instructions'),
      icon: 'Instruction',
      disabled: isNotActive,
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ instruction: item })),
    },
    {
      label: t('Rebuild'),
      icon: 'Rebuild',
      disabled: isNotActive,
      onClick: () =>
        dispatch(
          cloudVpsActions.setItemForModals({
            rebuild: { ...item, rebuild_action: 'rebuild' },
          }),
        ),
    },
    {
      label: t('Create ticket'),
      icon: 'Headphone',
      onClick: () =>
        navigate(`${route.SUPPORT}/requests`, {
          state: { id: item.id.$, openModal: true },
        }),
    },
    {
      label: t('Rename'),
      icon: 'Rename',
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ edit_name: item })),
    },
    {
      label: t('Delete'),
      icon: 'Remove',
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ delete: item })),
      isDelete: true,
    },
  ]

  const itemCountry = formatCountryName(item)

  return (
    <tr
      className={s.tr}
      onClick={e => {
        if (
          optionsCell.current.contains(e.target) ||
          // checkboxCell.current.contains(e.target) ||
          servernameCell.current.contains(e.target)
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
          {item.fotbo_status?.$?.replaceAll('_', ' ') || item.item_status?.$}
        </span>
      </td>
      <td className={s.td}>{item.pricelist.$}</td>
      <td className={s.td}>{item.cost.$.replace('Day', t('Day'))}</td>
      <td className={s.td}>
        <HintWrapper
          popupClassName={s.popup}
          wrapperClassName={cn(s.popup__wrapper, s.popup__wrapper_flag)}
          label={itemCountry}
        >
          <img
            src={require(`@images/countryFlags/${getFlagFromCountryName(
              item.datacentername.$.split(' ')[1],
            )}.png`)}
            width={20}
            height={14}
            alt={itemCountry}
          />
        </HintWrapper>
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
      <td className={cn(s.td, s.ip_cell)}>{item.ip?.$}</td>
      <td className={s.td} ref={optionsCell}>
        <Options options={options} columns={2} />
      </td>
    </tr>
  )
}
