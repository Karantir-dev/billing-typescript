export default function throwServerError(msg) {
  const error = new Error(msg)
  error.serverResponse = true
  throw error
}
