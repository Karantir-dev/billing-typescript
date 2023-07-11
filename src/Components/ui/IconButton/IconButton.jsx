import s from './IconButton.module.scss'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { Icon } from '@components'

export default function Component(props) {
  const { type, onClick, disabled, icon, className, dataTestid } = props

  const renderIcon = name => {
    switch (name) {
      case 'calendar':
        return <Icon name="Calendar" />
      case 'csv':
        return <Icon name="CsvDoc" />
      case 'pdf':
        return <Icon name="Pdf" />
      case 'filter':
        return <Icon name="Filter" />
      case 'archive':
        return <Icon name="SendArchive" />
      case 'edit':
        return <Icon name="Edit" />
      case 'clock':
        return <Icon name="Clock" />
      case 'refund':
        return <Icon name="Refund" />
      case 'transfer':
        return <Icon name="Transfer" />
      case 'whois':
        return <Icon name="Whois" />
      case 'server-cloud':
        return <Icon name="DomainsListName" />
      case 'print':
        return <Icon name="Print" />
      case 'delete':
        return <Icon name="Delete" />
      case 'passChange':
        return <Icon name="PassChange" />
      case 'reload':
        return <Icon name="Reload" />
      case 'ip':
        return <Icon name="IP" />
      case 'info':
        return <Icon name="Info" />
      case 'exitSign':
        return <Icon name="ExitSign" />
      case 'attention':
        return <Icon name="Attention" />
      case 'exchange':
        return <Icon name="Exchange" />
      case 'change-tariff':
        return <Icon name="ChangeTariff" />
      case 'download-folder':
        return <Icon name="DownloadWithFolder" />
      case 'euro':
        return <Icon name="Euro" />
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
    'print',
    'delete',
    'passChange',
    'reload',
    'ip',
    'clock',
    'refund',
    'info',
    'exitSign',
    'exchange',
    'change-tariff',
    'euro',
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
