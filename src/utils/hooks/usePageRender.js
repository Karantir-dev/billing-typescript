import { useSelector } from 'react-redux'
import checkIfComponentShouldRender from '../checkIfComponentShouldRender'
import { userSelectors } from '../../Redux'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function usePageRender(sectionName, funcName, hasToaster = true) {
  const { t } = useTranslation('trusted_users')

  const currentSessionRights = useSelector(userSelectors.getCurrentSessionRights)

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
