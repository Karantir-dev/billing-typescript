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

  const isStopped = item.fotbo_status?.$ === 'stopped'
  const isResized = item.fotbo_status?.$ === 'resized'
  const isRescued = item.fotbo_status?.$ === 'booted_from_iso'

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
      label: t('Confirm Resize'),
      icon: 'CheckFat',
      hidden: !isResized,
      onClick: () =>
        dispatch(
          cloudVpsActions.setItemForModals({
            confirm: { ...item, confirm_action: 'resize_confirm' },
          }),
        ),
    },
    {
      label: t('Unrescue'),
      icon: 'Rescue',
      hidden: !isRescued,
      onClick: () =>
        dispatch(
          cloudVpsActions.setItemForModals({
            confirm: { ...item, confirm_action: 'unrescue' },
          }),
        ),
    },
    {
      label: t('Revert Resize'),
      icon: 'Cross',
      hidden: !isResized,
      onClick: () =>
        dispatch(
          cloudVpsActions.setItemForModals({
            confirm: { ...item, confirm_action: 'resize_rollback' },
          }),
        ),
    },

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
      hidden: isResized || isRescued,
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
      hidden: isResized || isRescued,
    },
    {
      label: t('Resize'),
      icon: 'Resize',
      disabled: isNotActive || item.change_pricelist?.$ === 'off',
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ resize: item })),
      hidden: isResized || isRescued,
    },

    {
      label: t('Change password'),
      icon: 'ChangePassword',
      disabled: isNotActive,
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ change_pass: item })),
      hidden: isResized || isRescued,
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
      hidden: isResized || isRescued,
    },
    {
      label: t('Instructions'),
      icon: 'Instruction',
      disabled: isNotActive,
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ instruction: item })),
      hidden: isResized || isRescued,
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
      hidden: isResized || isRescued,
    },
    {
      label: t('Create ticket'),
      icon: 'Headphone',
      onClick: () =>
        navigate(`${route.SUPPORT}/requests`, {
          state: { id: item.id.$, openModal: true },
        }),
      hidden: isResized || isRescued,
    },
    {
      label: t('Rename'),
      icon: 'Rename',
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ edit_name: item })),
      hidden: isResized || isRescued,
    },
    {
      label: t('Delete'),
      icon: 'Remove',
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ delete: item })),
      isDelete: true,
    },
  ]

  const optionsColumns = options.filter(el => !el.hidden).length > 5 && 2

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
          {item.fotbo_status?.$ === 'resized' && (
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
        <HintWrapper
          popupClassName={s.popup}
          wrapperClassName={cn(s.popup__wrapper, s.popup__wrapper_flag)}
          label={t(item.datacentername.$.replace('Fotbo ', ''), { ns: 'countries' })}
        >
          <img
            src={require(`@images/countryFlags/${getFlagFromCountryName(
              item.datacentername.$.split(' ')[1],
            )}.png`)}
            width={20}
            height={14}
            alt={item.datacentername.$.replace('Fotbo ', '')}
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
        <Options options={options} columns={optionsColumns} />
      </td>
    </tr>
  )
}
