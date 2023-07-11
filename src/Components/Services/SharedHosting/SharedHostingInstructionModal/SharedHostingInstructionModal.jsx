import { useTranslation } from 'react-i18next'
import { Icon } from '@components'
import s from './SharedHostingInstructionModal.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['domains', 'other'])

  const { name, closeInstructionModalHandler, instructionData } = props

  return (
    <div className={s.modalBlock}>
      <div className={s.modalHeader}>
        <span className={s.headerText}>
          {t('Instruction')} {name}
        </span>
        <Icon name="Cross" onClick={closeInstructionModalHandler} className={s.crossIcon} />
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: instructionData }}
        className={s.whoisBlock}
      />
    </div>
  )
}
