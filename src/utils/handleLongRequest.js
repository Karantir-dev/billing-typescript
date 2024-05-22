import { axiosInstance } from '@config/axiosInstance'

export default async function handleLongRequest(data, errorHandler, successCallback) {
  if (typeof data === 'string' && data.trim() !== '') {
    const longUrl = data.match(/long.+billmgr/)?.[0]

    try {
      const response = await axiosInstance.get(longUrl)
      const responseData = response.data

      if (responseData) {
        handleLongRequest(responseData, errorHandler, successCallback)
      } else {
        errorHandler('No data received from the server')
      }
    } catch (error) {
      errorHandler(error.message)
    }
  } else if (data.doc.error) {
    errorHandler(data)
  } else {
    successCallback()
  }
}
