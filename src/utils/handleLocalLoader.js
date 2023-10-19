export default function handleLocalLoader(errMsg, closeLocalLoader) {
  if (errMsg === 'canceled' && closeLocalLoader) {
    closeLocalLoader()
  }
}
