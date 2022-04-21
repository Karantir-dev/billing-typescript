import React from 'react'
import cn from 'classnames'
import dayjs from 'dayjs'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { supportOperations } from '../../../../Redux'
import { Download } from '../../../../images'
import { BASE_URL } from '../../../../config/config'
import s from './MessageItem.module.scss'
import MessageRate from './MessageRate'

export default function Component(props) {
  const dispatch = useDispatch()
  const params = useParams()

  const { message } = props

  const downloadFileHandler = (fileName, fileId) => {
    dispatch(supportOperations.getFile(fileName, fileId))
  }

  return (
    <div
      className={cn(
        s.messageBlock,
        message?.$type === 'outcoming' ? s.outcoming : s.incoming,
      )}
    >
      <div className={s.messageHeader}>
        <div className={s.userInfo}>
          <img
            className={s.avatar}
            src={`${BASE_URL}${message.avatar?.$}`}
            alt={message.avatar?.$name}
          />
          <span>{message?.user?.realname?.$}</span>
        </div>
        <div className={s.datetime}>
          {dayjs(message?.date_post?.$).format('DD MMMM YYYY HH:mm')}
        </div>
      </div>
      <div className={s.messageBody}>
        <div className={s.messageText}>{message?.body?.$}</div>
        {message?.file && (
          <div className={s.fileBlock}>
            {message?.file?.map(el => {
              return (
                <button
                  onClick={() => downloadFileHandler(el?.name?.$, el?.param?.$)}
                  className={s.file}
                  key={el?.param?.$}
                >
                  {el?.name?.$}
                  <Download />
                </button>
              )
            })}
          </div>
        )}
      </div>
      {message?.rates && (
        <MessageRate
          postId={params?.id}
          messageId={message?.$id}
          rateStatus={message?.rates?.rate?.$name}
        />
      )}
    </div>
  )
}

Component.propTypes = {
  message: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.object]),
}

Component.defaultProps = {
  message: null,
}
