import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'

const originAxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})
const fakeAxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})

export const axiosInstance =
  process.env.NODE_ENV === 'test' ? fakeAxiosInstance : originAxiosInstance

export const mockedAxiosInstance = new AxiosMockAdapter(fakeAxiosInstance)
