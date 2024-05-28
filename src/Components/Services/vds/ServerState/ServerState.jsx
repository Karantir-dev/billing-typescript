import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { TooltipWrapper, Icon } from '@components'
import PropTypes from 'prop-types'
import s from './ServerState.module.scss'

export default function ServerState({ className, server }) {
  const { t } = useTranslation('vds')

  const statusMapping = {
    '5_open': { content: 'in_progress', icon: 'InProgress', className: '' },
    '5_transfer': { content: 'in_progress_transfer', icon: 'InProgress', className: '' },
    '5_close': {
      content: 'deletion_in_progress',
      icon: 'InProgress',
      className: s.delProgress,
    },
    '3_employeesuspend': {
      content: 'stopped_by_admin',
      icon: 'Attention',
      className: '',
    },
    '3_autosuspend': { content: 'stopped', icon: 'Attention', className: '' },
    '3_abusesuspend': {
      content: 'Suspended due to abuse',
      icon: 'Attention',
      className: '',
    },
  }

  const renderStatusIcon = statusKey => {
    const status = statusMapping[statusKey]

    return (
      status && (
        <TooltipWrapper content={t(status?.content)} id={statusKey}>
          <Icon name={status?.icon} className={status?.className} id={statusKey} />
        </TooltipWrapper>
      )
    )
  }

  return (
    <span className={cn(s.wrapper, className)}>
      {server?.item_status?.$orig === '1' && (
        <TooltipWrapper content={t('ordered')} id="status_ordered">
          <Icon name="CheckCircle" className={s.check_icon} id="status_ordered" />
        </TooltipWrapper>
      )}
      {server?.item_status?.$orig === '2' && (
        <TooltipWrapper content={t('active')} id="status_active">
          <Icon name="On_Off" className={s.green_icon} id="status_active" />
        </TooltipWrapper>
      )}

      {renderStatusIcon(server?.item_status?.$orig)}

      {server?.autoprolong?.$ && (
        <TooltipWrapper content={t('auto_prolong')} id="autoprolong">
          <Icon name="Clock" className={s.green_icon} id="autoprolong" />
        </TooltipWrapper>
      )}
      {server?.scheduledclose?.$ === 'on' && (
        <TooltipWrapper
          content={`${t('scheduled_deletion')}${server?.scheduledclose_prop?.$}`}
          id="scheduledclose"
        >
          <Icon name="InProgress" className={s.delProgress} id="scheduledclose" />
        </TooltipWrapper>
      )}
    </span>
  )
}

ServerState.propTypes = {
  className: PropTypes.string,
  server: PropTypes.object,
}
