/* eslint-disable no-unused-vars */
import { useRef } from 'react'
import s from './SshList.module.scss'
import cn from 'classnames'
import { Icon, Options } from '@components'
import { cloudVpsActions, cloudVpsOperations } from '@redux'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

export default function SshItemMobile({ item }) {
  const { t } = useTranslation(['cloud_vps', 'vds'])

  const optionsBlock = useRef()
  const dispatch = useDispatch()

  const options = [
    {
      label: t('Rename'),
      icon: 'Rename',
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ ssh_rename: item })),
    },
    {
      label: t('Delete'),
      icon: 'Remove',
      onClick: () => dispatch(cloudVpsActions.setItemForModals({ ssh_delete: item })),
      isDelete: true,
    },
  ]

  return (
    <div
      className={s.mobile_item}
      tabIndex={0}
      onKeyUp={() => {}}
      role="button"
    >
      <div className={s.mobile_item__header}>
        <div ref={optionsBlock} className={s.mobile_item_options_wrapper}>
          <Options options={options} />
        </div>
        <div className={s.mobile_item__header_name}>
          <p className={s.mobile_item__name}>{item?.comment?.$}</p>
        </div>
      </div>
      <div className={s.mobile_item__body}>
        <p className={s.mobile_item__param}>{t('Created at')}</p>
        <p className={s.mobile_item__value}>{item.cdate.$}</p>

        <p className={s.mobile_item__param}>{t('Fingerprint')}</p>
        <p className={s.mobile_item__value}>{item?.fingerprint?.$}</p>
      </div>
    </div>
  )
}
