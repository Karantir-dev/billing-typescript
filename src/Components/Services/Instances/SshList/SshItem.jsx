import s from './SshList.module.scss'
import cn from 'classnames'
import { Icon } from '@components'
import { useTranslation } from 'react-i18next'
import { cloudVpsActions } from '@redux'
import { useDispatch } from 'react-redux'

export default function SshItem({ item }) {
  const { t } = useTranslation(['vds'])

  const dispatch = useDispatch()

  return (
    <tr className={s.tr}>
      {/* <td ref={checkboxCell}>
        <CheckBox />
      </td> */}
      <td className={cn(s.td, s.servername_cell)}>
        {item?.comment?.$ || t('server_placeholder')}
      </td>
      <td className={s.td}>{item?.cdate?.$}</td>
      <td className={cn(s.td, s.ip_cell)}>{item?.fingerprint?.$}</td>
      <td className={s.td}>
        <button
          type="button"
          className={cn(s.btn, s.table_el_button)}
          onClick={() => {
            dispatch(cloudVpsActions.setItemForModals({ ssh_rename: item }))
          }}
        >
          <Icon name="Rename" />
        </button>
        <button
          className={s.btn}
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
