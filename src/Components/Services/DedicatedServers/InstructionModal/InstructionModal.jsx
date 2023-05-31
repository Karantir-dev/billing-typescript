import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
// import { NavLink } from 'react-router-dom'

import { Cross } from '../../../../images'
import { dedicOperations } from '../../../../Redux'
// import * as route from '../../../../routes'
import { Loader } from '../../..'

import s from './InstructionModal.module.scss'

export default function InstructionModal({ elid, closeFn }) {
  const dispatch = useDispatch()

  const { t } = useTranslation('dedicated_servers')

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
        <span className={s.headerText}>{t('Activation of Dedicated server')}</span>
        <Cross onClick={closeFn} className={s.crossIcon} />
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: instruction?.$ }}
        className={s.whoisBlock}
      />
    </div>
  )
}
