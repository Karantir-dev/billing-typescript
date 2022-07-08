import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Cross } from '../../../../images'
import { dedicOperations } from '../../../../Redux'
import { Loader } from '../../..'

import s from './InstructionModal.module.scss'

export default function InstructionModal({ elid, closeFn }) {
  const dispatch = useDispatch()

  const { t } = useTranslation('other')

  const [instruction, setInstruction] = useState('')

  useEffect(() => {
    dispatch(dedicOperations.getServiceInstruction(elid, setInstruction))
  }, [])

  if (!instruction) {
    return <Loader />
  }

  return (
    <div className={s.modalBlock}>
      <div className={s.modalHeader}>
        <span className={s.headerText}>{t('Virtual server activation')}</span>
        <Cross onClick={closeFn} className={s.crossIcon} />
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: instruction?.$ }}
        className={s.whoisBlock}
      />
    </div>
  )
}
