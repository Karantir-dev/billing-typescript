import { actions } from '@src/Redux'

export default function handleLoadersOpen(setIsLoading, dispatch) {
  setIsLoading ? setIsLoading(true) : dispatch(actions.showLoader())
}
