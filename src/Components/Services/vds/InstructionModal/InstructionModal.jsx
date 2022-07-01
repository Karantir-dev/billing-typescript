import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Cross } from '../../../../images'
import { dedicOperations } from '../../../../Redux'
import { Loader } from '../../..'

import s from '../../DedicatedServers/InstructionModal/InstructionModal.module.scss'

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
    <>
      <div className={s.instruction_modal}>
        <div className={s.title_wrapper}>
          <div className={s.title}>
            <h3 className={s.modal_title}>{t('Virtual server activation')}</h3>
          </div>
          <Cross className={s.icon_cross} onClick={closeFn} width={15} height={15} />
        </div>

        <div
          className={s.modal_content}
          dangerouslySetInnerHTML={{ __html: instruction?.$ }}
        ></div>
      </div>
    </>
  )
}
