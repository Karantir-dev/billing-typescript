/* eslint-disable no-unused-vars */
import { useRef } from 'react'
import s from './InstancesList.module.scss'
import cn from 'classnames'
import { Icon, Options } from '@components'
import * as route from '@src/routes'
import { useNavigate } from 'react-router-dom'
import { getFlagFromCountryName } from '@utils'

export default function InstanceItemMobile({
  status = 'runing',
  item,
  setStopInstanceModal,
  setChangePasswordModal,
  setDeleteModal,
}) {
  const optionsBlock = useRef()
  const navigate = useNavigate()

  const options = [
    {
      label: 'Shut down',
      icon: 'Shutdown',
      disabled: false,
      onClick: () => setStopInstanceModal(status),
    },
    {
      label: 'Console',
      icon: 'Console',
      disabled: false,
      onClick: () => {},
    },
    {
      label: 'Reboot',
      icon: 'Reboot',
      disabled: false,
      onClick: () => {},
    },
    {
      label: 'Shelve',
      icon: 'Shelve',
      disabled: false,
      onClick: () => {},
    },
    {
      label: 'Resize',
      icon: 'Resize',
      disabled: false,
      onClick: () => {},
    },

    {
      label: 'Change password',
      icon: 'ChangePassword',
      disabled: false,
      onClick: () => setChangePasswordModal(status),
    },
    {
      label: 'Rescue',
      icon: 'Rescue',
      disabled: false,
      onClick: () => {},
    },
    {
      label: 'Instructions',
      icon: 'Instruction',
      disabled: false,
      onClick: () => {},
    },
    {
      label: 'Rebuild',
      icon: 'Rebuild',
      disabled: false,
      onClick: () => {},
    },
    {
      label: 'Create ticket',
      icon: 'Headphone',
      disabled: false,
      onClick: () => {},
    },
    {
      label: 'Rename',
      icon: 'Rename',
      disabled: false,
      onClick: () => {},
    },
    {
      label: 'Delete',
      icon: 'Remove',
      disabled: false,
      onClick: () => setDeleteModal(status),
      isDelete: true,
    },
  ]
  return (
    <div
      className={s.mobile_item}
      onClick={e => {
        if (optionsBlock.current.contains(e.target)) return
        navigate(route.CLOUD_VPS_CREATE_INSTANCE)
      }}
      tabIndex={0}
      onKeyUp={() => {}}
      role="button"
    >
      <div className={s.mobile_item__header}>
        <div>
          <p className={s.mobile_item__name}>{item.name.$}</p>
          <p
            className={cn(
              s.status,
              s[
                item.fotbo_status?.$.trim().toLowerCase() ||
                  item.item_status?.$.trim().toLowerCase()
              ],
            )}
          >
            {item.fotbo_status?.$?.replaceAll('_', ' ') || item.item_status?.$}
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
            alt={item.datacentername.$.replace('Fotbo ', '')}
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
