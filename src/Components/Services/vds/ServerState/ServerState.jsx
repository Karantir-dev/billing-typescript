import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { TooltipWrapper, Icon } from '@components'
import PropTypes from 'prop-types'
import s from './ServerState.module.scss'

export default function ServerState({ className, server }) {
  const { t } = useTranslation('vds')

  const statusMapping = {
    '5_open': { id: 'open_5', content: 'in_progress', icon: 'InProgress', className: '' },
    '5_transfer': {
      id: 'transfer_5',
      content: 'in_progress_transfer',
      icon: 'InProgress',
      className: '',
    },
    '5_close': {
      id: 'close_5',
      content: 'deletion_in_progress',
      icon: 'InProgress',
      className: s.delProgress,
    },
    '3_employeesuspend': {
      id: 'employeesuspend_3',
      content: 'stopped_by_admin',
      icon: 'Attention',
      className: '',
    },
    '3_autosuspend': {
      id: 'autosuspend_3',
      content: 'stopped',
      icon: 'Attention',
      className: '',
    },
    '3_abusesuspend': {
      id: 'abusesuspend_3',
      content: 'Suspended due to abuse',
      icon: 'Attention',
      className: '',
    },
  }

  const renderStatusIcon = statusKey => {
    const status = statusMapping[statusKey]

    return (
      status && (
        <TooltipWrapper content={t(status?.content)}>
          <Icon name={status?.icon} className={status?.className} />
        </TooltipWrapper>
      )
    )
  }

  return (
    <span className={cn(s.wrapper, className)}>
      {server?.item_status?.$orig === '1' && (
        <TooltipWrapper content={t('ordered')}>
          <Icon name="CheckCircle" className={s.check_icon} />
        </TooltipWrapper>
      )}
      {server?.item_status?.$orig === '2' && (
        <TooltipWrapper content={t('active')}>
          <Icon name="On_Off" className={s.green_icon} />
        </TooltipWrapper>
      )}

      {renderStatusIcon(server?.item_status?.$orig)}

      {server?.autoprolong?.$ && (
        <TooltipWrapper content={t('auto_prolong')}>
          <Icon name="Clock" className={s.green_icon} />
        </TooltipWrapper>
      )}
      {server?.scheduledclose?.$ === 'on' && (
        <TooltipWrapper
          content={`${t('scheduled_deletion')}${server?.scheduledclose_prop?.$}`}
        >
          <Icon name="InProgress" className={s.delProgress} />
        </TooltipWrapper>
      )}
    </span>
  )
}

ServerState.propTypes = {
  className: PropTypes.string,
  server: PropTypes.object,
}
