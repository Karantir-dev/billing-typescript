import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'

import s from './HintWrapper.module.scss'
import cn from 'classnames'

export default function HintWrapper({
  label,
  children,
  popupClassName,
  wrapperClassName,
}) {
  const ref = useRef(null)
  const [elemWidth, setElemWidth] = useState(0)
  const [pageWidth, setPageWidth] = useState(0)

  useEffect(() => {
    setElemWidth(ref.current.offsetWidth)
    setPageWidth(window.screen.width)
  }, [children, pageWidth, setElemWidth])

  return (
    <div ref={ref} className={cn(s.hint_wrapper, wrapperClassName)}>
      {children}
      <div
        className={cn(
          s.hint_popup,
          popupClassName,
          elemWidth > 100 && pageWidth >= 1024 ? s.hint_full : s.shint_fit,
        )}
      >
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
