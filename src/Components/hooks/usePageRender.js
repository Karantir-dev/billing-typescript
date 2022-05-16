import { useSelector } from 'react-redux'
import checkIfComponentShouldRender from '../../checkIfComponentShouldRender'
import { userSelectors } from '../../Redux'

export default function usePageRender(sectionName, funcName) {
  const currentSessionRights = useSelector(userSelectors.getCurrentSessionRights)

  return checkIfComponentShouldRender(currentSessionRights, sectionName, funcName)
}
