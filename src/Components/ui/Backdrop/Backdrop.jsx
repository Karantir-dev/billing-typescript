import cn from 'classnames'

import { CSSTransition } from 'react-transition-group'
import PropTypes from 'prop-types'

import s from './Backdrop.module.scss'
import animations from './animations.module.scss'

export default function Backdrop({ children, onClick, isOpened, className }) {
  const onBackdropClick = event => {
    if (event.target === event.currentTarget) {
      onClick()
    }
  }

  return (
    <div
      tabIndex={0}
      onKeyUp={() => {}}
      role="button"
      className={cn(s.backdrop, { [s.opened]: isOpened, [className]: className })}
      onClick={onClick ? onBackdropClick : null}
    >
      <CSSTransition in={isOpened} classNames={animations} timeout={150} unmountOnExit>
        {children}
      </CSSTransition>
    </div>
  )
}

Backdrop.propTypes = {
  isOpened: PropTypes.bool.isRequired,
  children: PropTypes.element.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
}
