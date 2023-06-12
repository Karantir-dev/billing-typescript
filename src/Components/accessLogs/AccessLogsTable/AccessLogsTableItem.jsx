import s from '../AccessLogsComponents.module.scss'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'

export default function Component(props) {
  const { time, user, ip } = props
  const { t } = useTranslation(['access_log', 'other'])
  const mobile = useMediaQuery({ query: '(max-width: 752px)' })

  const datetimeSeparate = string => {
    const datetime = string?.split(' ')
    let date = datetime[0]
    let time = datetime[1]
    return {
      date,
      time,
    }
  }

  return (
    <div className={s.item}>
      {mobile && <span className={s.item_title}>{t('time', { ns: 'other' })}:</span>}
      <span className={s.item_text}>
        {datetimeSeparate(time)?.date}{' '}
        <span className={s.item_text_time}>{datetimeSeparate(time)?.time}</span>
      </span>
      {mobile && <span className={s.item_title}>{t('user', { ns: 'other' })}:</span>}
      <span className={s.item_text}>{user}</span>
      {mobile && <span className={s.item_title}>{t('remote_ip_address')}:</span>}
      <span className={s.item_text}>{ip}</span>
    </div>
  )
}

Component.propTypes = {
  time: PropTypes.string,
  user: PropTypes.string,
  ip: PropTypes.string,
}

Component.defaultProps = {
  time: '',
  user: '',
  ip: '',
}
