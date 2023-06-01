import { useState } from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { supportOperations } from '@redux'
import { Like, DisLike } from '@images'
import { useTranslation } from 'react-i18next'
import s from './MessageItem.module.scss'

export default function Component(props) {
  const { t } = useTranslation(['support', 'other'])
  const dispatch = useDispatch()
  const { messageId, postId, rateStatus } = props

  const [status, setStatus] = useState(rateStatus)

  const likeHandler = () => {
    dispatch(supportOperations.setRate('good', messageId, postId, setStatus))
  }

  const disLikeHandler = () => {
    dispatch(supportOperations.setRate('bad', messageId, postId, setStatus))
  }

  const renderRateBlock = type => {
    if (type === 'good') {
      return <Like className={s.likeAnsw} />
    } else if (type === 'bad') {
      return <DisLike className={s.disLikeAnsw} />
    } else {
      return (
        <>
          <span className={s.rateAswText}>{t('Rate the answer')}:</span>
          <button onClick={likeHandler} className={cn(s.rateBtn, s.like)}>
            <Like />
          </button>

          <button onClick={disLikeHandler} className={cn(s.rateBtn, s.dislike)}>
            <DisLike />
          </button>
        </>
      )
    }
  }

  return (
    <div className={s.ratesBlock}>
      <div className={s.rateBtnsBlock}>{renderRateBlock(status)}</div>
    </div>
  )
}

Component.propTypes = {
  messageId: PropTypes.string,
  postId: PropTypes.string,
  rateStatus: PropTypes.string,
}

Component.defaultProps = {
  messageId: '',
  postId: '',
  rateStatus: '',
}
