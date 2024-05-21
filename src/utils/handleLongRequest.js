import { axiosInstance } from '@config/axiosInstance'

export default async function handleLongRequest(data, errorHandler, successCallback) {
  if (typeof data === 'string' && data.trim() !== '') {
    const longUrl = data.match(/long.+billmgr/)?.[0]

    const response = await axiosInstance.get(longUrl)
    const responseData = response.data

    if (responseData) {
      handleLongRequest(responseData, errorHandler, successCallback)
    } else {
      errorHandler('No data received from the server')
    }
  } else {
    if (typeof errorHandler === 'function') {
      errorHandler(data)
    } else {
      console.error('Invalid errorHandler function')
    }

    successCallback()
  }
}
