import React from 'react'
import { useTranslation } from 'react-i18next'
import { Clock, On_Off, CheckCircle, InProgress, Attention } from '../../../images'
import HintWrapper from '../../ui/HintWrapper/HintWrapper'

import s from './ServerState.module.scss'

export default function ServerState({ className, server }) {
  const { t } = useTranslation('vds')

  return (
    <span className={className}>
      {server?.item_status?.$orig === '2' && (
        <HintWrapper label={t('active')}>
          <On_Off className={s.green_icon} />
        </HintWrapper>
      )}
      {server?.item_status?.$orig === '1' && (
        <HintWrapper label={t('ordered')}>
          <CheckCircle className={s.check_icon} />
        </HintWrapper>
      )}
      {server?.item_status?.$orig === '5_open' && (
        <HintWrapper label={t('in_progress')}>
          <InProgress />
        </HintWrapper>
      )}
      {server?.item_status?.$orig === '3_employeesuspend' && (
        <HintWrapper label={t('stopped_by_admin')}>
          <Attention />
        </HintWrapper>
      )}
      {server?.item_status?.$orig === '3_autosuspend' && (
        <HintWrapper label={t('stopped')}>
          <Attention />
        </HintWrapper>
      )}
      {server?.autoprolong?.$ && (
        <HintWrapper label={t('auto_prolong')}>
          <Clock className={s.green_icon} />
        </HintWrapper>
      )}
    </span>
  )
}
