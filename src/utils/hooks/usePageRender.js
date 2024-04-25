import { useSelector } from 'react-redux'
import checkIfComponentShouldRender from '../checkIfComponentShouldRender'
import { userSelectors } from '@redux'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function usePageRender(sectionName, funcName, hasToaster = true) {
  const { t } = useTranslation('trusted_users')

  const currentSessionRights = useSelector(userSelectors.getCurrentSessionRights)

  /* Here should add condition to render VPS, Site care, FTP, VPN only for users whose have ordered service.
  Don't forget to delete this comment later */

  const shouldComponentRender = checkIfComponentShouldRender(
    currentSessionRights,
    sectionName,
    funcName,
  )

  useEffect(() => {
    if (!shouldComponentRender) {
      if (hasToaster) {
        if (!toast.isActive()) {
          toast.error(t('insufficient_rights'), {
            position: 'bottom-right',
            toastId: 'customId',
          })
        }
      }
    }
  }, [])

  return shouldComponentRender
}
