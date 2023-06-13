import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { Icon } from '@components'
import { ftpOperations } from '@redux'

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
    <div className={s.modalBlock}>
      <div className={s.modalHeader}>
        <span className={s.headerText}>{t('FTP storage activation')}</span>
        <Icon name="Cross" onClick={closeFn} className={s.crossIcon} />
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: instruction?.$ }}
        className={s.whoisBlock}
      />
    </div>
  )
}
