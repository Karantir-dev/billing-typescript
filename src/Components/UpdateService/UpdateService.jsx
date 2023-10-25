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
import { useNavigate, NavLink } from 'react-router-dom'
import * as route from '@src/routes'
import { useCancelRequest } from '@src/utils'

const usersShouldSee = [
  223794, 63852, 36911, 219929, 54297, 184341, 272533, 173695, 273389, 226462, 173769,
  185469, 275556, 27126, 63612, 53681, 45234, 16460, 247506, 64917, 282368, 283474,
  286337, 273321, 292584, 287390, 216482, 310182, 311383, 310265, 236409, 195196, 172396,
  20637, 172783, 322067, 291655, 25554, 183395, 319027, 330769, 210811, 52166, 313942,
  192404, 216627, 38062, 334840, 342702, 63987, 312263, 37703, 335011, 310434, 259663,
  274113, 294079, 186547, 340239, 232138, 344820, 338355, 316389, 345759, 268206, 237556,
  274583, 324820, 196224, 348507, 272182, 349421, 57917, 350383, 51998, 18660, 65874,
  40119, 294149, 351789, 48926, 265822, 184439, 243327, 308121, 335166, 255822, 357033,
  316073, 358174, 358199, 357954, 359229, 328553, 359441, 288392, 41803, 360706, 360982,
  216377, 183382, 361793, 335326, 361909, 361952, 362236, 34450, 257388, 363389, 356163,
  346720, 252023, 351211, 363975, 364041, 364067, 334169, 36971, 366046, 40520, 367015,
  354039, 365250, 359551, 343138, 368290, 363037, 
  // this is test account id:
  370352,
]

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

  // name below will be changed
  const g7Ticket = tickerList?.find(obj => obj?.name?.$?.includes('G7'))

  const ticketId = g7Ticket?.id?.$

  const isUserIdInList = usersShouldSee?.includes(Number(ownerId))

  // 946977 ticket ID

  return isUserIdInList && g7Ticket ? (
    <button
      className={s.wrapper}
      type="button"
      onClick={() =>
        navigate(`${route.SUPPORT}/requests/${ticketId}`, {
          replace: true,
        })
      }
    >
      <Icon name="Attention" className={s.icon} />
      <p className={s.text}>
        {t('Dear')} {userName} {t('email_trigger')}{' '}
        <NavLink to={`${route.SUPPORT}/requests/${g7Ticket?.id?.$}`} className={s.link}>
          {t('here')}
        </NavLink>
      </p>
    </button>
  ) : null
}
