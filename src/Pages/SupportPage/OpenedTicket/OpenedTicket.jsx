import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useParams, useNavigate } from 'react-router-dom'
import {
  OpenedTicketMessages,
  SendMessageForm,
  Button,
  HintWrapper,
  IconButton,
  Modal,
  Icon,
} from '@components'
import TipsModal from '../TipsModal/TipsModal'
import {
  supportSelectors,
  supportOperations,
  supportActions,
  userSelectors,
} from '@redux'
import * as route from '@src/routes'
import s from './OpenedTicket.module.scss'
import { useMediaQuery } from 'react-responsive'

export default function Component() {
  const dispatch = useDispatch()
  const { t } = useTranslation(['support', 'other'])
  const params = useParams()
  const navigate = useNavigate()
  const desktop = useMediaQuery({ query: '(min-width: 1919px)' })
  const [tipsModal, setTipsModa] = useState(false)
  const [successModal, setSuccessModal] = useState(false)

  const ticket = useSelector(supportSelectors.getTicket)
  const isNewMessage = useSelector(userSelectors.getIsNewMessage)

  const closeTipsModal = () => {
    setTipsModa(!tipsModal)
  }

  useEffect(() => {
    getTicketHandler()
    return () => dispatch(supportActions.clearTicket())
  }, [params])

  useEffect(() => {
    getTicketHandler()
  }, [isNewMessage])

  const getTicketHandler = () => {
    dispatch(supportOperations.getTicketByIdHandler(params?.id))
  }

  const archivePage = ticket?.closed_ticket_user?.$ === 'on'

  return (
    <div>
      <div className={s.breadCrumb}>
        <span className={s.linkText}>
          <NavLink className={s.link} to={`${route.SUPPORT}/${params.path}`}>
            {t(archivePage ? 'request_archive' : 'all_requests')}
          </NavLink>
          {'>'}
        </span>
        <span className={s.tickerId}>#{params?.id}</span>
      </div>
      {ticket && (
        <div className={s.messagesConatiner}>
          <h1 className={s.ticketSubj}>{ticket?.subject?.$}</h1>

          <div className={s.infoContainer}>
            <div className={s.infoBlock}>
              <span className={s.infoitemName}>{t('created')}: </span>
              <span>
                {dayjs(ticket?.mlist[0]?.fm_date_post?.$).format('DD MMM YYYY HH:mm')}
              </span>
            </div>
            {ticket?.mlist[0]?.message[0]?.$type === 'info' ? (
              <div className={s.infoBlock}>
                <span className={s.infoitemName}>{t('Service related')}: </span>
                <span>{ticket?.mlist[0]?.message[0]?.rowgroup[0]?.row[0]?.$}</span>
              </div>
            ) : null}
            <div className={cn(s.infoBlock, archivePage ? s.red : s.green)}>
              {archivePage ? t('closed') : t('In progress')}
            </div>
          </div>

          <div className={s.reloadBtn}>
            {desktop ? (
              <Button
                className={s.tipsBtn}
                dataTestid={'support_tips_btn'}
                size="large"
                isShadow
                label={t('THANK YOU')}
                onClick={() => setTipsModa(true)}
                type="button"
              />
            ) : (
              <HintWrapper label={t('THANK YOU')}>
                <IconButton
                  className={s.tools_icon}
                  onClick={() => setTipsModa(true)}
                  icon="euro"
                />
              </HintWrapper>
            )}

            <HintWrapper label={t('Refresh')}>
              <IconButton
                className={s.tools_icon}
                onClick={getTicketHandler}
                icon="reload"
              />
            </HintWrapper>
          </div>

          <OpenedTicketMessages messages={ticket?.mlist[0]?.message || []} />
          {archivePage ? (
            <Button
              dataTestid={'back_btn'}
              size="large"
              className={s.backBtn}
              label={t('Back', { ns: 'other' })}
              onClick={() =>
                navigate(`${route.SUPPORT}/${params.path}`, {
                  replace: true,
                })
              }
              type="button"
              // isShadow
            />
          ) : (
            <SendMessageForm />
          )}
        </div>
      )}

      {tipsModal && (
        <TipsModal
          closeTipsModal={closeTipsModal}
          elid={params?.id}
          setSuccessModal={setSuccessModal}
        />
      )}

      <Modal
        isOpen={successModal}
        closeModal={() => setSuccessModal(false)}
        className={s.successModal}
        simple
      >
        <Modal.Header />
        <Modal.Body>
          <Icon name="Smile" className={s.smileIcon} />
          <p className={s.thanksText}>{t('Thank you for donation')}</p>
        </Modal.Body>
      </Modal>
    </div>
  )
}
