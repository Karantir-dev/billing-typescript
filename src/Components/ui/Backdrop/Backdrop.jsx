import cn from 'classnames'
import React from 'react'
import { CSSTransition } from 'react-transition-group'

import s from './Backdrop.module.scss'
import animations from './animations.module.scss'

export default function Backdrop({ children, onClick, isOpened }) {
  return (
    <div
      tabIndex={0}
      onKeyUp={() => {}}
      role="button"
      className={cn(s.backdrop, { [s.opened]: isOpened })}
      onClick={onClick}
    >
      <CSSTransition
        in={Boolean(isOpened)}
        classNames={animations}
        timeout={150}
        unmountOnExit
      >
        {children}
      </CSSTransition>
    </div>
  )
}
