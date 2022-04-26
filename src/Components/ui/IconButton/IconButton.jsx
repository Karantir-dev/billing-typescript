import React from 'react'
import s from './IconButton.module.scss'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { Calendar, CsvDoc, Filter, SendArchive } from '../../../images'

export default function Component(props) {
  const { type, onClick, disabled, icon, className, dataTestid } = props

  const renderIcon = name => {
    switch (name) {
      case 'calendar':
        return <Calendar />
      case 'csv':
        return <CsvDoc />
      case 'filter':
        return <Filter />
      case 'archive':
        return <SendArchive />
      default:
        return null
    }
  }

  return (
    <button
      data-testid={dataTestid}
      disabled={disabled}
      className={cn({
        [s.icon_btn]: true,
        [className]: className,
      })}
      type={type}
      onClick={onClick}
    >
      {renderIcon(icon)}
    </button>
  )
}

Component.propTypes = {
  type: PropTypes.oneOf(['button', 'reset', 'submit']),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  icon: PropTypes.oneOf(['calendar', 'csv', 'filter', 'archive']),
  className: PropTypes.string,
  dataTestid: PropTypes.string,
}

Component.defaultProps = {
  type: 'button',
  onClick: () => null,
  disabled: false,
  icon: '',
}
