// import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { Cross } from '../../../../images'
import { dnsOperations } from '../../../../Redux'

import Loader from '../../../ui/Loader/Loader'

import s from './DNSInstructionModal.module.scss'

export default function DNSInstructionModal({ elid, closeFn }) {
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
        <span className={s.headerText}>{t('DNS-hosting activation')}</span>
        <Cross onClick={closeFn} className={s.crossIcon} />
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: instruction?.$ }}
        className={s.whoisBlock}
      />
    </div>
  )
}
