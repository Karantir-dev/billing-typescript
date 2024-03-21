import { useEffect, useRef, useState } from 'react'
import s from './SshList.module.scss'
import cn from 'classnames'
import { EditCell, Icon } from '@components'
import { useTranslation } from 'react-i18next'
import { cloudVpsActions } from '@redux'
import { useDispatch } from 'react-redux'

export default function InstanceItem({ item, editSsh }) {
  const { t } = useTranslation(['vds', 'other'])

  const sshNameCell = useRef()
  const dispatch = useDispatch()

  const [keyName, setKeyName] = useState(item.comment?.$ || '')

  const editSshName = value => {
    editSsh({
      value,
      elid: item?.elid?.$,
      errorCallback: () => setKeyName(keyName),
    })
    setKeyName(value)
  }

  useEffect(() => {
    setKeyName(item.comment?.$)
  }, [item.comment?.$])

  return (
    <tr className={s.tr}>
      {/* <td ref={checkboxCell}>
        <CheckBox />
      </td> */}
      <td ref={sshNameCell} className={cn(s.td, s.servername_cell)}>
        <EditCell
          originName={keyName}
          onSubmit={editSshName}
          placeholder={t(keyName || t('server_placeholder', { ns: 'vds' }), {
            ns: 'vds',
          })}
          isShadow={true}
        />
      </td>
      <td className={s.td}>{item?.cdate?.$}</td>
      <td className={cn(s.td, s.ip_cell)}>{item?.fingerprint?.$}</td>
      <td className={s.td}>
        <button
          type="button"
          onClick={() => {
            dispatch(cloudVpsActions.setItemForModals({ ssh_delete: item }))
          }}
        >
          <Icon name="Remove" />
        </button>
      </td>
    </tr>
  )
}
