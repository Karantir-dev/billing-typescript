/* eslint-disable no-unused-vars */
import { useRef } from 'react'
import s from './InstancesList.module.scss'
import cn from 'classnames'
import { Icon, Options } from '@components'
import * as route from '@src/routes'
import { useNavigate } from 'react-router-dom'
import { getFlagFromCountryName } from '@utils'
import { cloudVpsActions } from '@redux'
import { useDispatch } from 'react-redux'

export default function InstanceItemMobile({ item }) {
  const optionsBlock = useRef()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const isNotActive =
    item.status.$ === '1' || item.status.$ === '4' || item.status.$ === '5'

  const options = [
    {
      label: item.item_status.$orig === '2_2_16' ? 'Start' : 'Shut down',
      icon: 'Shutdown',
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ start_stop: item })),
      disabled: item.item_status.$.includes('in progress') || isNotActive,
    },
    {
      label: 'Console',
      icon: 'Console',
      disabled: isNotActive,
      onClick: () => {},
    },
    {
      label: 'Reboot',
      icon: 'Reboot',
      disabled: isNotActive,
      onClick: () => {},
    },
    {
      label: 'Shelve',
      icon: 'Shelve',
      disabled: isNotActive,
      onClick: () => {},
    },
    {
      label: 'Resize',
      icon: 'Resize',
      disabled: isNotActive,
      onClick: () => {},
    },

    {
      label: 'Change password',
      icon: 'ChangePassword',
      disabled: isNotActive,
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ change_pass: item })),
    },
    {
      label: 'Rescue',
      icon: 'Rescue',
      disabled: isNotActive,
      onClick: () => {},
    },
    {
      label: 'Instructions',
      icon: 'Instruction',
      disabled: isNotActive,
      onClick: () => {},
    },
    {
      label: 'Rebuild',
      icon: 'Rebuild',
      disabled: isNotActive,
      onClick: () => {},
    },
    {
      label: 'Create ticket',
      icon: 'Headphone',
      disabled: isNotActive,
      onClick: () => {},
    },
    {
      label: 'Rename',
      icon: 'Rename',
      disabled: isNotActive,
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ edit_name: item })),
    },
    {
      label: 'Delete',
      icon: 'Remove',
      disabled: false,
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ delete: item.id.$ })),
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
          <p className={s.mobile_item__name}>{item.servername?.$}</p>
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
