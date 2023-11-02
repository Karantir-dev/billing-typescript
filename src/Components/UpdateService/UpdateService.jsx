import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '@components'

import s from './UpdateService.module.scss'

import {
  userSelectors,
  supportSelectors,
  supportOperations,
} from '@redux'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import * as route from '@src/routes'
import { useCancelRequest } from '@src/utils'
import { USERS_WITH_G7 } from '@utils/constants'

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

  const g7Ticket = tickerList?.find(obj => {
    const name = obj?.name?.$
    return name?.includes('Config 47') && name?.includes('Config 43') && name?.includes('VDS XL')
  })

  const ticketId = g7Ticket?.id?.$

  const isUserIdInList = USERS_WITH_G7?.includes(Number(ownerId))

  return isUserIdInList && g7Ticket ? (
    <button
      className={s.wrapper}
      type="button"
      onClick={() =>
        navigate(`${route.SUPPORT}/requests/${ticketId}`)
      }
    >
      <Icon name="Attention" className={s.icon} />
      <p className={s.text}>
        {t('Dear')} {userName}{'.'} {t('Update your server')}{' '}
        <span to={`${route.SUPPORT}/requests/${g7Ticket?.id?.$}`} className={s.link}>
          {t('here')}
        </span>
      </p>
    </button>
  ) : null
}
