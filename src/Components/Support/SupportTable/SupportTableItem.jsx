import s from './SupportTable.module.scss'
import PropTypes from 'prop-types'
import cn from 'classnames'
import dayjs from 'dayjs'
import { Button, CheckBox, Icon } from '@components'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import * as route from '@src/routes'

export default function Component(props) {
  const { id, theme, date, status, unread, setSelectedTickets, selected } = props
  const { t } = useTranslation(['support', 'other'])
  const navigate = useNavigate()
  const mobile = useMediaQuery({ query: '(max-width: 767px)' })

  const datetimeSeparate = string => {
    let date = dayjs(string).format('DD MMM YYYY')
    let time = dayjs(string).format('HH:mm')
    return {
      date,
      time,
    }
  }

  return (
    <div className={s.item_wrapper}>
      <CheckBox onClick={setSelectedTickets} value={selected} className={s.checkbox} />
      <div
        data-testid="request_item"
        role="button"
        tabIndex={0}
        onKeyDown={() => null}
        onClick={() =>
          navigate(`${route.SUPPORT}/requests/${id}`, {
            replace: true,
          })
        }
        className={cn(s.item, { [s.selected]: selected })}
      >
        <span className={s.tableBlockFirst}>
          {mobile && <div className={s.item_title}>{t('request_id')}:</div>}
          <span className={cn(s.item_text, s.first_item)}>{id}</span>
        </span>
        <span className={s.tableBlockSecond}>
          {mobile && <div className={s.item_title}>{t('theme', { ns: 'other' })}:</div>}
          <span className={cn(s.item_text, s.second_item)}>{theme}</span>
        </span>
        <span className={s.tableBlockThird}>
          {mobile && <div className={s.item_title}>{t('date', { ns: 'other' })}:</div>}
          <span className={cn(s.item_text, s.third_item)}>
            {datetimeSeparate(date)?.date}{' '}
            <span className={s.item_text_time}>{datetimeSeparate(date)?.time}</span>
          </span>
        </span>
        <span className={s.tableBlockFourth}>
          {mobile && <div className={s.item_title}>{t('status', { ns: 'other' })}:</div>}
          <span className={cn(s.item_text, s.fourth_item)}>{t(status)}</span>
        </span>
        <div className={s.tableBlockFifth}>
          {mobile && <div className={s.line} />}
          <button
            onClick={() =>
              navigate(`${route.SUPPORT}/requests/${id}`, {
                replace: true,
              })
            }
            className={cn(s.item_text, s.fifth_item)}
          >
            <Icon
              name="Chats"
              className={cn({ [s.unread]: unread, [s.chat_icon]: true })}
            />
          </button>
          <Button
            className={s.openTicket}
            isShadow
            size="medium"
            label={t('Open', { ns: 'other' })}
            type="button"
            onClick={() =>
              navigate(`${route.SUPPORT}/requests/${id}`, {
                replace: true,
              })
            }
          />
        </div>
      </div>
    </div>
  )
}
Component.propTypes = {
  id: PropTypes.string,
  theme: PropTypes.string,
  date: PropTypes.string,
  status: PropTypes.string,
  unread: PropTypes.bool,
  setSelectedTickets: PropTypes.func,
  selected: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.bool]),
}

Component.defaultProps = {
  id: '',
  theme: '',
  date: '',
  status: '',
  unread: false,
  setSelectedTickets: () => null,
  selected: null,
}
