import React from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { Check, Info } from '../../../../images'

import s from './DepartmentSelect.module.scss'

export default function Component(props) {
  const { t } = useTranslation('support')
  const { selected, value, title, setValue } = props
  return (
    <div className={cn(s.select, { [s.selected]: selected })}>
      <button type="button" onClick={() => setValue(value)} className={s.checkIcon}>
        <Check />
      </button>
      <div className={s.title}>{t(title)}</div>
      <button type="button" className={s.infoBtn}>
        <Info />
      </button>
    </div>
  )
}
