import React from 'react'
import PropTypes from 'prop-types'

import s from './HintWrapper.module.scss'

export default function HintWrapper({ label, children }) {
  return (
    <div className={s.hint_wrapper}>
      {children}
      <div className={s.hint_popup}>
        <div className={s.hint_pointer_wrapper}>
          <div className={s.pointer}></div>
        </div>
        {label}
      </div>
    </div>
  )
}

HintWrapper.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
}
