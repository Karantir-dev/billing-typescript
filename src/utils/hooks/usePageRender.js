import { useSelector } from 'react-redux'
import checkIfComponentShouldRender from '../checkIfComponentShouldRender'
import { userSelectors } from '../../Redux'
import { toast } from 'react-toastify'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

export default function usePageRender(sectionName, funcName) {
  const tostId = useRef(null)
  const { t } = useTranslation('trusted_users')

  const currentSessionRights = useSelector(userSelectors.getCurrentSessionRights)

  const shouldComponentRender = checkIfComponentShouldRender(
    currentSessionRights,
    sectionName,
    funcName,
  )

  useEffect(() => {
    if (!shouldComponentRender) {
      if (!toast.isActive(tostId.current)) {
        toast.error(t('insufficient_rights'), {
          position: 'bottom-right',
          toastId: 'customId',
        })
      }
    }
  }, [])

  return shouldComponentRender
}
