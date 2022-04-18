import React, { useEffect } from 'react'
import dayjs from 'dayjs'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useParams, useNavigate } from 'react-router-dom'
import {
  Container,
  OpenedTicketMessages,
  SendMessageForm,
  Button,
} from '../../../Components'
import { supportSelectors, supportOperations, supportActions } from '../../../Redux'
import * as route from '../../../routes'
import s from './OpenedTicket.module.scss'

export default function Component() {
  const dispatch = useDispatch()
  const { t } = useTranslation(['support', 'other'])
  const params = useParams()
  const navigate = useNavigate()

  const ticket = useSelector(supportSelectors.getTicket)

  useEffect(() => {
    dispatch(supportOperations.getTicketByIdHandler(params?.id))
    return () => dispatch(supportActions.clearTicket())
  }, [params])

  const archivePage = ticket?.closed_ticket_user?.$ === 'on'

  return (
    <Container>
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
        <div>
          <h1 className={s.ticketSubj}>{ticket?.subject?.$}</h1>
          <div className={s.infoContainer}>
            <div className={s.infoBlock}>
              <span>{t('created')}: </span>
              <span>
                {dayjs(ticket?.mlist[0]?.fm_date_post?.$).format('DD MMM YYYY HH:mm')}
              </span>
            </div>
            {ticket?.mlist[0]?.message[0]?.$type === 'info' ? (
              <div className={s.infoBlock}>
                <span>{t('Service related')}: </span>
                <span>{ticket?.mlist[0]?.message[0]?.rowgroup[0]?.row[0]?.$}</span>
              </div>
            ) : null}
            <div className={cn(s.infoBlock, archivePage ? s.red : s.green)}>
              {archivePage ? t('closed') : t('In progress')}
            </div>
          </div>
          <OpenedTicketMessages messages={ticket?.mlist[0]?.message || []} />
          {archivePage ? (
            <Button
              size="large"
              className={s.backBtn}
              label={t('Back', { ns: 'other' })}
              onClick={() => navigate(`${route.SUPPORT}/${params.path}`)}
              type="button"
            />
          ) : (
            <SendMessageForm />
          )}
        </div>
      )}
    </Container>
  )
}
