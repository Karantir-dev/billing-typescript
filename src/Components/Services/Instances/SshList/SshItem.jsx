/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react'
import s from '../InstancesList/InstancesList.module.scss'
import cn from 'classnames'
import { CheckBox, EditCell, HintWrapper, Icon, Options } from '@components'
import * as route from '@src/routes'
import { useNavigate } from 'react-router-dom'
import { getFlagFromCountryName } from '@utils'
import { useTranslation } from 'react-i18next'
import { cloudVpsActions } from '@redux'
import { useDispatch } from 'react-redux'

export default function InstanceItem({ item, editInstance }) {
  const { t } = useTranslation(['vds', 'other'])

  const optionsCell = useRef()
  const checkboxCell = useRef()
  const servernameCell = useRef()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [keyName, setKeyName] = useState(item.comment?.$ || '')

  const editSshName = value => {
    editInstance({
      value,
      elid: item?.elid?.$,
      errorCallback: () => setKeyName(keyName),
    })
    setKeyName(value)
  }

  useEffect(() => {
    setKeyName(item.comment?.$)
  }, [item.comment?.$])

  const options = [
    {
      label: 'Rename',
      icon: 'Rename',
      disabled: false,
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ comment: item })),
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
      // onClick={e => {
      //   if (
      //     optionsCell.current.contains(e.target) ||
      //     // checkboxCell.current.contains(e.target) ||
      //     servernameCell.current.contains(e.target)
      //   )
      //     return
      //   navigate(`${route.CLOUD_VPS}/${item.elid.$}`, { state: item })
      // }}
    >
      {/* <td ref={checkboxCell}>
        <CheckBox />
      </td> */}
      <td ref={servernameCell} className={s.servername_cell}>
        <EditCell
          originName={keyName}
          onSubmit={editSshName}
          placeholder={t(keyName || t('server_placeholder', { ns: 'vds' }), {
            ns: 'vds',
          })}
          isShadow={true}
        />
      </td>
      {/* <td>
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
      </td> */}
      <td>{item.cdate.$}</td>
      {/* <td>
        <HintWrapper
          popupClassName={s.popup}
          wrapperClassName={s.popup__wrapper}
          label={item.instances_os.$}
        >
          <Icon name={item.instances_os.$.split(/[\s-]+/)[0]} />
        </HintWrapper>
      </td> */}
      <td className={s.ip_cell}>{item?.fingerprint?.$}</td>
      {/* <td ref={optionsCell}>
        <Options options={options} columns={2} />
      </td> */}
    </tr>
  )
}
