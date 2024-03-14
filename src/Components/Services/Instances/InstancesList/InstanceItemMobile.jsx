/* eslint-disable no-unused-vars */
import { useRef } from 'react'
import s from './InstancesList.module.scss'
import cn from 'classnames'
import { HintWrapper, Icon, Options } from '@components'
import * as route from '@src/routes'
import { useNavigate } from 'react-router-dom'
import { getFlagFromCountryName, getInstanceMainInfo } from '@utils'
import { cloudVpsActions, cloudVpsOperations } from '@redux'
import { useDispatch } from 'react-redux'
import formatCountryName from '../ExternalFunc/formatCountryName'
import { useTranslation } from 'react-i18next'

export default function InstanceItemMobile({ item }) {
  const { t } = useTranslation(['cloud_vps', 'vds', 'countries'])

  const optionsBlock = useRef()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { isNotActive, isStopped, isResized, isRescued, displayStatus, displayName } =
    getInstanceMainInfo(item)

  const options = [
    {
      label: t('Unrescue'),
      icon: 'Wrench',
      hidden: !isRescued,
      onClick: () =>
        dispatch(
          cloudVpsActions.setItemForModals({
            confirm: { ...item, confirm_action: 'unrescue' },
          }),
        ),
    },
    {
      label: t('Confirm Resize'),
      icon: 'Check_square',
      hidden: !isResized,
      onClick: () =>
        dispatch(
          cloudVpsActions.setItemForModals({
            confirm: { ...item, confirm_action: 'resize_confirm' },
          }),
        ),
    },

    {
      label: t('Revert Resize'),
      icon: 'Close_square',
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
  return (
    <div
      className={s.mobile_item}
      onClick={e => {
        if (optionsBlock.current.contains(e.target)) return
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
          <Options options={options} />
        </div>
      </div>
      <div className={s.mobile_item__body}>
        <p className={s.mobile_item__param}>Flavor</p>
        <p className={s.mobile_item__value}>{item.pricelist.$}</p>

        <p className={s.mobile_item__param}>Price</p>
        <p className={s.mobile_item__value}>{item.cost.$}</p>

        <p className={s.mobile_item__param}>Region</p>
        <p className={s.mobile_item__value}>
          <img
            src={require(`@images/countryFlags/${getFlagFromCountryName(
              item.datacentername.$.split(' ')[1],
            )}.png`)}
            width={20}
            height={14}
            alt={formatCountryName(item?.datacentername?.$)}
          />
        </p>

        <p className={s.mobile_item__param}>Created at</p>
        <p className={s.mobile_item__value}>{item.createdate.$}</p>

        <p className={s.mobile_item__param}>OS</p>
        <p className={s.mobile_item__value}>
          <Icon name={item.instances_os.$.split(/[\s-]+/)[0]} />
        </p>

        <p className={s.mobile_item__param}>Access IP</p>
        <p className={s.mobile_item__value}>{item.ip?.$}</p>
      </div>
    </div>
  )
}
