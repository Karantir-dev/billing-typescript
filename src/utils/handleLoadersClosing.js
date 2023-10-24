import { actions } from '@src/Redux'

export default function handleLoadersClosing(errMsg, dispatch, setIsLoading) {
  if (errMsg === 'closeLoader') {
    dispatch && dispatch(actions.hideLoader())
    setIsLoading && setIsLoading(false)
  } else if (errMsg !== 'canceled' && setIsLoading) {
    setIsLoading(false)
  } else {
    dispatch && dispatch(actions.hideLoader())
  }
}
