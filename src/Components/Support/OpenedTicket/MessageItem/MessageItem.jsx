import { useState } from 'react'
import cn from 'classnames'
import dayjs from 'dayjs'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { supportOperations } from '@redux'
import { Backdrop } from '../../..'
import { Download } from '@images'
import { BASE_URL } from '@config/config'
import s from './MessageItem.module.scss'
import MessageRate from './MessageRate'

export default function Component(props) {
  const dispatch = useDispatch()
  const params = useParams()

  const { message } = props

  const downloadFileHandler = (
    fileName,
    fileId,
    setImg = null,
    setImgIsOpened = null,
  ) => {
    dispatch(supportOperations.getFile(fileName, fileId, setImg, setImgIsOpened))
  }

  const [image, setImage] = useState(null)
  const [imageIsOpened, setImageIsOpened] = useState(false)

  const closeImageHandler = () => {
    setImage(null)
    setImageIsOpened(false)
  }

  return (
    <div
      className={cn(
        s.messageContainer,
        message?.$type === 'outcoming' ? s.outcoming : s.incoming,
      )}
    >
      <img
        className={s.avatar}
        src={`${BASE_URL}${message.avatar?.$}`}
        alt={message.avatar?.$name}
      />

      <div
        className={cn(
          s.messageBlock,
          message?.$type === 'outcoming' ? s.outcoming : s.incoming,
        )}
      >
        <div className={s.headerWithPhoto}>
          <img
            className={s.avatarSmall}
            src={`${BASE_URL}${message.avatar?.$}`}
            alt={message.avatar?.$name}
          />
          <div className={s.messageHeader}>
            <div className={s.userInfo}>
              <span>{message?.user?.realname?.$}</span>
            </div>
            <div className={s.datetime}>
              {dayjs(message?.date_post?.$).format('DD MMMM YYYY HH:mm')}
            </div>
          </div>
        </div>
        <div className={s.messageBody}>
          <div className={s.messageText}>{message?.body?.$}</div>
          {message?.file && (
            <div className={s.fileBlock}>
              {message?.file?.map(el => {
                const isOpen = () => {
                  if (
                    el?.name?.$?.includes('png') ||
                    el?.name?.$?.includes('webp') ||
                    el?.name?.$?.includes('jpg') ||
                    el?.name?.$?.includes('jpeg')
                  ) {
                    return downloadFileHandler(
                      el?.name?.$,
                      el?.param?.$,
                      setImage,
                      setImageIsOpened,
                    )
                  }
                  return downloadFileHandler(el?.name?.$, el?.param?.$)
                }
                return (
                  <button onClick={isOpen} className={s.file} key={el?.param?.$}>
                    <span>{el?.name?.$}</span>
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
      <Backdrop isOpened={Boolean(imageIsOpened && image)} onClick={closeImageHandler}>
        <div className={s.modalBlock}>{image && <img src={image} alt="Opened" />}</div>
      </Backdrop>
    </div>
  )
}

Component.propTypes = {
  message: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.object]),
}

Component.defaultProps = {
  message: null,
}
