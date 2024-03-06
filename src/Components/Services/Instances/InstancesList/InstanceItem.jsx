/* eslint-disable no-unused-vars */
import { useRef, useState } from 'react'
import s from './InstancesList.module.scss'
import cn from 'classnames'
import { CheckBox, EditCell, HintWrapper, Icon, Options } from '@components'
import * as route from '@src/routes'
import { useNavigate } from 'react-router-dom'
import { getFlagFromCountryName } from '@utils'
import { useTranslation } from 'react-i18next'

export default function InstanceItem({
  status = 'runing',
  item,
  setStopInstanceModal,
  setChangePasswordModal,
  setDeleteModal,
  editInstance,
}) {
  const { t } = useTranslation(['vds', 'other'])

  const optionsCell = useRef()
  const checkboxCell = useRef()
  const servernameCell = useRef()
  const navigate = useNavigate()
  const [originName, setOriginName] = useState(item.servername?.$ || '')
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

  const editServerName = value => {
    editInstance({ servername: value }, item.id.$, () => setOriginName(originName))
    setOriginName(value)
  }
  return (
    <tr
      onClick={e => {
        if (
          optionsCell.current.contains(e.target) ||
          checkboxCell.current.contains(e.target) ||
          servernameCell.current.contains(e.target)
        )
          return
        navigate(`${route.CLOUD_VPS}/${item.id.$}`, { state: item })
      }}
    >
      <td ref={checkboxCell}>
        <CheckBox />
      </td>
      <td ref={servernameCell} className={s.servername_cell}>
        <EditCell
          originName={originName}
          onSubmit={editServerName}
          placeholder={t(originName || t('server_placeholder', { ns: 'vds' }), {
            ns: 'vds',
          })}
          isShadow={true}
        />
      </td>
      <td>
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
      <td>{item.pricelist.$}</td>
      <td>{item.cost.$}</td>
      <td>
        <HintWrapper
          popupClassName={s.popup}
          wrapperClassName={cn(s.popup__wrapper, s.popup__wrapper_flag)}
          label={item.datacentername.$.replace('Fotbo ', '')}
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
      <td>{item.createdate.$}</td>
      <td>
        <HintWrapper
          popupClassName={s.popup}
          wrapperClassName={s.popup__wrapper}
          label={item.instances_os.$}
        >
          <Icon name={item.instances_os.$.split(/[\s-]+/)[0]} />
        </HintWrapper>
      </td>
      <td className={s.ip_cell}>{item.ip?.$}</td>
      <td ref={optionsCell}>
        <Options options={options} columns={2} />
      </td>
    </tr>
  )
}
