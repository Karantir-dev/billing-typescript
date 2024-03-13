/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react'
import s from './InstancesList.module.scss'
import cn from 'classnames'
import { CheckBox, EditCell, HintWrapper, Icon, Options } from '@components'
import * as route from '@src/routes'
import { useNavigate } from 'react-router-dom'
import { getFlagFromCountryName } from '@utils'
import { useTranslation } from 'react-i18next'
import { cloudVpsActions } from '@redux'
import { useDispatch } from 'react-redux'
import formatCountryName from '../ExternalFunc/formatCountryName'


export default function InstanceItem({ item, editInstance }) {
  const { t } = useTranslation(['vds', 'other'])

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
    setServerName(item.servername?.$)
  }, [item.servername?.$])

  const options = [
    {
      label: isStopped ? 'Start' : 'Shut down',
      icon: 'Shutdown',
      onClick: () =>
      dispatch(cloudVpsActions.setItemForModals({
          confirm: { ...item, confirm_action: isStopped ? 'start' : 'stop' },
        })),
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
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ confirm: { ...item, confirm_action: 'reboot' } })),
    },
    // {
    //   label: 'Shelve',
    //   icon: 'Shelve',
    //   disabled: isNotActive,
    //   onClick: () => {},
    // },
    {
      label: 'Resize',
      icon: 'Resize',
      disabled: isNotActive,
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ resize: item })),
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
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ rebuild: item })),
    },
    {
      label: 'Create ticket',
      icon: 'Headphone',
      disabled: false,
      onClick: () =>
        navigate(`${route.SUPPORT}/requests`, {
          state: { id: item.id.$, openModal: true },
        }),
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
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ delete: item })),
      isDelete: true,
    },
  ]

  return (
    <tr
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
      <td ref={servernameCell} className={s.servername_cell}>
        <EditCell
          originName={serverName}
          onSubmit={editServerName}
          placeholder={t(serverName || t('server_placeholder', { ns: 'vds' }), {
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
          label={formatCountryName(item?.datacentername?.$)}
        >
          <img
            src={require(`@images/countryFlags/${getFlagFromCountryName(
              item.datacentername.$.split(' ')[1],
            )}.png`)}
            width={20}
            height={14}
            alt={formatCountryName(item?.datacentername?.$)}
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
