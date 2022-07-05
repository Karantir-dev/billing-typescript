import React, { useEffect, useState } from 'react'
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

  console.log(instruction, 'instruction')

  return (
    <>
      <div className={s.instruction_modal}>
        <div className={s.title_wrapper}>
          <div className={s.title}>
            <h3 className={s.modal_title}>{t('Activation of Dedicated server')}</h3>
          </div>
          <Cross className={s.icon_cross} onClick={closeFn} width={17} height={17} />
        </div>

        <div
          className={s.modal_content}
          dangerouslySetInnerHTML={{ __html: instruction?.$ }}
        ></div>
      </div>
    </>
  )
}
