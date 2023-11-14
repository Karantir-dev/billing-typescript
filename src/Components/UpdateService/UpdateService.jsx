import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '@components'

import cn from 'classnames'
import s from './UpdateService.module.scss'

import { userSelectors, supportSelectors, supportOperations } from '@redux'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import * as route from '@src/routes'
import { useCancelRequest } from '@src/utils'
import { USERS_WITH_G7, USERS_WITH_G8 } from '@utils/constants'

export default function UpdateService() {
  const { t } = useTranslation('other')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { signal, setIsLoading } = useCancelRequest()

  useEffect(() => {
    dispatch(supportOperations.getTicketsHandler({}, signal, setIsLoading))
  }, [])

  const { $id: ownerId, $realname: userName } = useSelector(userSelectors.getUserInfo)
  const tickerList = useSelector(supportSelectors.getTicketList)

  const isG7TicketOpened = tickerList?.find(obj => {
    const name = obj?.name?.$
    return (
      name?.includes('Config 47') &&
      name?.includes('Config 43') &&
      name?.includes('VDS XL')
    )
  })

  const isG8TicketOpened = tickerList?.find(obj => {
    const name = obj?.name?.$
    return (
      name?.includes('Config 48') &&
      name?.includes('Config 50') &&
      name?.includes('VDS XXL')
    )
  })

  const g7TicketId = isG7TicketOpened?.id?.$
  const g8TicketId = isG8TicketOpened?.id?.$

  const isUserIdInListWithG7 = USERS_WITH_G7?.includes(Number(ownerId))
  const isUserIdInListWithG8 = USERS_WITH_G8?.includes(Number(ownerId))

  const g7Ticket = isUserIdInListWithG7 && isG7TicketOpened
  const g8Ticket = isUserIdInListWithG8 && isG8TicketOpened

  return (
    <>
      {g7Ticket || g8Ticket ? (
        <button
          className={cn(s.wrapper, { [s.wrapper_exception]: g7Ticket && g8Ticket })}
          type="button"
          onClick={() => {
            if (g7Ticket && g8Ticket) {
              return
            }

            if (g7Ticket) {
              return navigate(`${route.SUPPORT}/requests/${g7TicketId}`)
            }

            return navigate(`${route.SUPPORT}/requests/${g8TicketId}`)
          }}
        >
          <Icon name="Attention" className={s.icon} />
          <p className={s.text}>
            {t('Dear')} {userName}
            {'.'} {t('Update your server')}{' '}
            {g7Ticket && (
              <a href={`${route.SUPPORT}/requests/${g7TicketId}`} className={s.link}>
                {'Config 47'}
              </a>
            )}
            {g7Ticket && g8Ticket && ' & '}
            {g8Ticket && (
              <a href={`${route.SUPPORT}/requests/${g8TicketId}`} className={s.link}>
                {'Config 48'}
              </a>
            )}
          </p>
        </button>
      ) : null}
    </>
  )
}
