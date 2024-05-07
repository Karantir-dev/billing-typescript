import { FORBIDDEN_TO_ORDER_SERVICES } from '@utils/constants'

export default function checkIfComponentShouldRender(
  rightsList,
  sectionName,
  funcName,
  currentActiveServices,
  serviceID,
) {
  const isCurrentSectionAllowed = rightsList.some(obj => {
    return obj.$name === sectionName
  }) // if includes the name of func, this right is allowed

  const isCurrentPageAllowed = rightsList.some(obj => {
    const res = obj.node.some(el => {
      return funcName ? el.$name === funcName : true
    })

    return res
  })

  /* ID is forbidden and have active service */
  const isSectionHaveActiveServices =
    FORBIDDEN_TO_ORDER_SERVICES.includes(serviceID) &&
    currentActiveServices.some(item => Number(item?.id_itemtype.$) === serviceID)

  const isRenderAllowed =
    isCurrentSectionAllowed &&
    isCurrentPageAllowed &&
    (isSectionHaveActiveServices || !FORBIDDEN_TO_ORDER_SERVICES.includes(serviceID))

  return isRenderAllowed
}
