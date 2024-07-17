import axios, { AxiosRequestConfig } from 'axios'
import { refreshToken } from './auth'
import { authStore } from './auth';

export const request = async (url: string, options: AxiosRequestConfig) => {
  try {
    const response = await axios(url, options)
    return response
  } catch (e: any) {
    if (e.response.status === 401) {
      try {
        const newAccessToken = await authStore.dispatch(refreshToken())
        if (newAccessToken) {
          const headers = options.headers || {}
          headers['authorization'] = `Bearer ${newAccessToken.payload}`
          const retryOptions: AxiosRequestConfig = {
            ...options,
            headers,
          }
          const retryResponse = await axios(url, retryOptions)
          return retryResponse
        }
      } catch (refreshError) {
        console.log(refreshError)
        throw refreshError
      }
    }
    console.log(e)
    throw Error
  }
};

