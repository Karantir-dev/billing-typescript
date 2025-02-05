/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'

import s from './HintWrapper.module.scss'
import cn from 'classnames'

/**
 * @param hintDelay - delay in miliseconds
 * @param place - top top-start top-end right right-start right-end bottom bottom-start bottom-end left left-start left-end
 */
export default function HintWrapper({
  label,
  popupClassName,
  hintDelay,
  children,
  wrapperClassName,
  bottom,
  disabled,
}) {
  const ref = useRef(null)
  const [elemWidth, setElemWidth] = useState(0)
  const [pageWidth, setPageWidth] = useState(0)

  useEffect(() => {
    setElemWidth(ref.current?.offsetWidth)
    setPageWidth(window.screen.width)
  }, [children, pageWidth, setElemWidth])

  const handleClick = e => {
    // is it mobile device and width of the screen is less than 1024
    const isMobileDevice =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile Safari/i.test(
        navigator.userAgent,
      ) && pageWidth < 1024

    // Check is it Google Chrome for mobile devices
    const isMobileChrome = /CriOS/i.test(navigator.userAgent)

    if (isMobileDevice || isMobileChrome) {
      e.stopPropagation()
    }
  }

  return (
    <>
      {disabled ? (
        children
      ) : (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
        <div
          ref={ref}
          className={cn(s.hint_wrapper, wrapperClassName)}
          style={{ '--hint_delay': hintDelay + 'ms' }}
          onClick={handleClick}
        >
          {children}
          <div
            className={cn(
              s.hint_popup,
              popupClassName,
              { [s.bottom]: bottom },
              elemWidth > 100 && pageWidth >= 1024 ? s.hint_full : s.hint_fit,
            )}
          >
            <div className={cn(s.hint_pointer_wrapper, { [s.bottom]: bottom })}>
              <div className={cn(s.pointer, { [s.bottom]: bottom })}></div>
            </div>

            {label}
          </div>
        </div>
      )}
    </>
  )
}

HintWrapper.propTypes = {
  label: PropTypes.string.isRequired,
  // content: PropTypes.string.isRequired,
  // children: PropTypes.element.isRequired,
  popupClassName: PropTypes.string,
  wrapperClassName: PropTypes.string,
  bottom: PropTypes.bool,
  disabled: PropTypes.bool,
  hintDelay: PropTypes.number,
}
