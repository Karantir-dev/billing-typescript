import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import * as route from '@src/routes'

export default function useCreateTicketOption(id) {
  const { t } = useTranslation(['support'])
  const navigate = useNavigate()

  return {
    label: t('create_ticket', { ns: 'support' }),
    icon: 'Headphone',
    onClick: () =>
      navigate(`${route.SUPPORT}/requests`, {
        state: { id, openModal: true },
      }),
  }
}
