import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, IconButton, HintWrapper } from '../../..'
import * as routes from '../../../../routes'
import s from './DomainFilters.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['domains', 'other', 'vds'])
  const navigate = useNavigate()

  const { selctedItem } = props
  //   const [filterModal, setFilterModal] = useState(false)
  //   const dispatch = useDispatch()

  return (
    <div className={s.filterBlock}>
      <div className={s.formBlock}>
        <div className={s.filterBtnBlock}>
          <IconButton onClick={() => null} icon="filter" className={s.calendarBtn} />
        </div>
        <HintWrapper wrapperClassName={s.archiveBtn} label={t('Transfer')}>
          <IconButton onClick={() => null} icon="transfer" />
        </HintWrapper>
        <HintWrapper wrapperClassName={s.archiveBtn} label={t('edit', { ns: 'other' })}>
          <IconButton disabled={!selctedItem} onClick={() => null} icon="edit" />
        </HintWrapper>
        <HintWrapper wrapperClassName={s.archiveBtn} label={t('prolong', { ns: 'vds' })}>
          <IconButton disabled={!selctedItem} onClick={() => null} icon="clock" />
        </HintWrapper>
        <HintWrapper wrapperClassName={s.archiveBtn} label={t('history', { ns: 'vds' })}>
          <IconButton disabled={!selctedItem} onClick={() => null} icon="refund" />
        </HintWrapper>
        <HintWrapper
          wrapperClassName={s.archiveBtn}
          label={t('Getting information about a domain using the whois protocol')}
        >
          <IconButton disabled={!selctedItem} onClick={() => null} icon="whois" />
        </HintWrapper>

        <HintWrapper
          wrapperClassName={s.archiveBtn}
          label={t('View/change the list of nameservers')}
        >
          <IconButton disabled={!selctedItem} onClick={() => null} icon="server-cloud" />
        </HintWrapper>
      </div>
      <Button
        dataTestid={'new_ticket_btn'}
        className={s.newTicketBtn}
        isShadow
        size="medium"
        label={t('New domain')}
        type="button"
        onClick={() => navigate(routes.DOMAINS_ORDERS)}
      />
    </div>
  )
}

Component.propTypes = {
  selctedTicket: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.object]),
}

Component.defaultProps = {
  selctedTicket: null,
}
