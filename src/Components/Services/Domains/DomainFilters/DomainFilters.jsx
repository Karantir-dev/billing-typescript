import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Button, IconButton } from '../../..'
import s from './DomainFilters.module.scss'

export default function Component() {
  const { t } = useTranslation(['domains', 'other'])
  //   const [filterModal, setFilterModal] = useState(false)
  //   const dispatch = useDispatch()

  return (
    <div className={s.filterBlock}>
      <div className={s.formBlock}>
        <div className={s.filterBtnBlock}>
          <IconButton onClick={() => null} icon="filter" className={s.calendarBtn} />
        </div>
        <IconButton onClick={() => null} icon="edit" className={s.archiveBtn} />
        <IconButton onClick={() => null} icon="clock" className={s.archiveBtn} />
        <IconButton onClick={() => null} icon="refund" className={s.archiveBtn} />
        <IconButton onClick={() => null} icon="transfer" className={s.archiveBtn} />
        <IconButton onClick={() => null} icon="whois" className={s.archiveBtn} />
        <IconButton onClick={() => null} icon="server-cloud" className={s.archiveBtn} />
      </div>
      <Button
        dataTestid={'new_ticket_btn'}
        className={s.newTicketBtn}
        isShadow
        size="medium"
        label={t('New domain')}
        type="button"
        onClick={() => null}
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
