import MessageItem from '../MessageItem/MessageItem'
import PropTypes from 'prop-types'
import s from './OpenedTicketMessages.module.scss'
import { systemNotificationsTranslate } from '@utils'
import { useTranslation } from 'react-i18next'

export default function Component(props) {
  const { messages } = props
  const { t } = useTranslation('support')

  return (
    <div className={s.messagesBlock}>
      {messages?.map(el => {
        if (el.$type !== 'info') {
          if (el.$type === 'system') {
            return (
              <div key={el?.$id} className={s.archiveTicket}>
                {systemNotificationsTranslate(el?.body?.$, t)}
              </div>
            )
          }
          return <MessageItem key={el?.$id} message={el} />
        }
      })}
    </div>
  )
}

Component.propTypes = {
  messages: PropTypes.array,
}

Component.defaultProps = {
  messages: [],
}
