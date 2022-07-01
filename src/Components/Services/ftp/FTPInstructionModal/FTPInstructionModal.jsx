import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { Cross } from '../../../../images'
import { ftpOperations } from '../../../../Redux'

import Loader from '../../../ui/Loader/Loader'

import s from './FTPInstructionModal.module.scss'

export default function FTPInstructionModal({ elid, closeFn }) {
  const dispatch = useDispatch()

  const { t } = useTranslation('other')

  const [instruction, setInstruction] = useState('')

  useEffect(() => {
    dispatch(ftpOperations.getServiceInstruction(elid, setInstruction))
  }, [])

  if (!instruction) {
    return <Loader />
  }

  return (
    <>
      <div className={s.instruction_modal}>
        <div className={s.title_wrapper}>
          <div className={s.title}>
            <h3 className={s.modal_title}>{t('FTP storage activation')}</h3>
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
