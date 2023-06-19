// import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { Icon, Loader } from '@components'
import { dnsOperations } from '@redux'

import s from './ForexInstructionModal.module.scss'

export default function ForexInstructionModal({ elid, closeFn }) {
  const dispatch = useDispatch()

  const { t } = useTranslation('other')

  const [instruction, setInstruction] = useState('')

  useEffect(() => {
    dispatch(dnsOperations.getServiceInstruction(elid, setInstruction))
  }, [])

  if (!instruction) {
    return <Loader />
  }

  return (
    <div className={s.modalBlock}>
      <div className={s.modalHeader}>
        <span className={s.headerText}>{t('Forex server activation')}</span>
        <Icon name="Cross" onClick={closeFn} className={s.crossIcon} />
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: instruction?.$ }}
        className={s.whoisBlock}
      />
    </div>
  )
}
