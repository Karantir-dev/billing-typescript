import React from 'react'
import PropTypes from 'prop-types'

import s from './HintWrapper.module.scss'
import cn from 'classnames'

export default function HintWrapper({
  label,
  children,
  popupClassName,
  wrapperClassName,
}) {
  return (
    <div className={cn(s.hint_wrapper, wrapperClassName)}>
      {children}
      <div className={cn(s.hint_popup, popupClassName)}>
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
  popupClassName: PropTypes.string,
  wrapperClassName: PropTypes.string,
}
