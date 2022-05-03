import React from 'react'
import MessageItem from '../MessageItem/MessageItem'
import PropTypes from 'prop-types'
import s from './OpenedTicketMessages.module.scss'

export default function Component(props) {
  const { messages } = props

  console.log(messages)
  return (
    <div className={s.messagesBlock}>
      {messages?.map(el => {
        if (el.$type !== 'info') {
          if (el.$type === 'system') {
            return (
              <div key={el?.$id} className={s.archiveTicket}>
                {el?.body?.$}
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
