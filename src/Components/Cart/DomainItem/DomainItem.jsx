import React from 'react'
import { useTranslation } from 'react-i18next'
import { Delete } from '../../../images'
import s from './DomainItem.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['cart', 'other'])

  const { desc, deleteItemHandler } = props

  const renderDesc = () => {
    const beforeWord = 'Domain registration'
    const afterWord = '</b>'

    const domainName = desc.slice(
      desc.indexOf(beforeWord) + beforeWord?.length,
      desc.indexOf(afterWord),
    )

    const beforeWordProtect = 'Data protection'

    const dataProtect = desc.slice(
      desc.indexOf(beforeWordProtect) + beforeWordProtect?.length,
    )

    return {
      domainName,
      dataProtect,
    }
  }

  return (
    <div className={s.domainItem}>
      <div className={s.priceList}>
        <div className={s.domainInfo}>
          <span className={s.domainName}>{renderDesc()?.domainName}</span>
          {desc?.includes('Data protection') && (
            <span className={s.domainProtect}>
              {t('Data protection')}: {t(renderDesc()?.dataProtect?.trim())}
            </span>
          )}
        </div>
      </div>
      {deleteItemHandler && (
        <Delete onClick={deleteItemHandler} width={15} className={s.deleteIcon} />
      )}
    </div>
  )
}
