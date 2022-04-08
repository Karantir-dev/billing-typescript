import React, { useState } from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'

import s from './ToggleButton.module.scss'

export default function ToggleButton({ func, initialState }) {
  const [isToggled, setIsToggled] = useState(initialState || false)

  const handleClick = () => {
    func && func()
    setIsToggled(!isToggled)
  }
  return (
    <button
      className={cn({
        [s.btn]: true,
        [s.active]: isToggled,
      })}
      type="button"
      onClick={handleClick}
    >
      <p className={cn({ [s.circle]: true, [s.active]: isToggled })}></p>
    </button>
  )
}

ToggleButton.propTypes = {
  func: PropTypes.func,
  initialState: PropTypes.bool,
}
