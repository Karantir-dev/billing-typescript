import React, { useState, useRef } from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useOutsideAlerter } from '../../../../utils'
import { Check, Info } from '../../../../images'

import s from './DepartmentSelect.module.scss'

export default function Component(props) {
  const { t } = useTranslation('support')
  const { selected, value, title, setValue, description } = props

  const [isDescrOpen, setIsDescrOpen] = useState(false)

  const dropdownDescription = useRef(null)

  const clickOutside = () => {
    setIsDescrOpen(false)
  }

  useOutsideAlerter(dropdownDescription, isDescrOpen, clickOutside)

  return (
    <div className={cn(s.select, { [s.selected]: selected })}>
      <button type="button" onClick={() => setValue(value)} className={s.checkIcon}>
        <Check />
      </button>
      <div className={s.title}>{t(title)}</div>
      <button onClick={() => setIsDescrOpen(true)} type="button" className={s.infoBtn}>
        <Info />
      </button>
      {isDescrOpen && (
        <div
          dangerouslySetInnerHTML={{ __html: description }}
          ref={dropdownDescription}
          className={s.descriptionBlock}
        />
      )}
    </div>
  )
}

Component.propTypes = {
  selected: PropTypes.bool,
  value: PropTypes.string,
  title: PropTypes.string,
  setValue: PropTypes.func,
  description: PropTypes.string,
}

Component.defaultProps = {
  selected: false,
  value: '',
  title: '',
  setValue: '',
  description: '',
}
