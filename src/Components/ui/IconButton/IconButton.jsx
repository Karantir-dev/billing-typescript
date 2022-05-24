import React from 'react'
import s from './IconButton.module.scss'
import PropTypes from 'prop-types'
import cn from 'classnames'
import {
  Calendar,
  CsvDoc,
  Filter,
  SendArchive,
  Pdf,
  Edit,
  Clock,
  Refund,
  Transfer,
  Whois,
  DomainsListName,
} from '../../../images'

export default function Component(props) {
  const { type, onClick, disabled, icon, className, dataTestid } = props

  const renderIcon = name => {
    switch (name) {
      case 'calendar':
        return <Calendar />
      case 'csv':
        return <CsvDoc />
      case 'pdf':
        return <Pdf />
      case 'filter':
        return <Filter />
      case 'archive':
        return <SendArchive />
      case 'edit':
        return <Edit />
      case 'clock':
        return <Clock />
      case 'refund':
        return <Refund />
      case 'transfer':
        return <Transfer />
      case 'whois':
        return <Whois />
      case 'server-cloud':
        return <DomainsListName />

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
  icon: PropTypes.oneOf([
    'calendar',
    'csv',
    'filter',
    'archive',
    'pdf',
    'edit',
    'clock',
    'refund',
    'transfer',
    'whois',
    'server-cloud',
  ]),
  className: PropTypes.string,
  dataTestid: PropTypes.string,
}

Component.defaultProps = {
  type: 'button',
  onClick: () => null,
  disabled: false,
  icon: '',
}
