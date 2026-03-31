import axios from 'axios'
import { useCommonStore } from '~/stores/common'
import { useMessage, useCookie } from '~/composables'
import {
  BASE_API_URL,
  COOKIE_PARAM,
  DEFAULT_HEADERS,
  HTTP_STATUS,
  LOGIN_URL,
  WHITE_LIST_API_URL
} from '~/modules/http'
import { MSG } from '~/modules/constant'

const mc = useMessage()
const cookie = useCookie()

const instance = axios.create({
  baseURL: BASE_API_URL,
  data: {},
  params: {},
  headers: DEFAULT_HEADERS
})

// Request interceptor
instance.interceptors.request.use(
  function (config) {
    const { setLoading } = useCommonStore.getState()
    setLoading(true)

    if (!WHITE_LIST_API_URL.includes(config.url)) {
      const token = cookie.get(COOKIE_PARAM.TOKEN)
      config.headers.Authorization = 'Bearer ' + token
    } else {
      config.headers.Authorization = ''
    }

    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// Response interceptor
instance.interceptors.response.use(
  function (response) {
    const { setLoading } = useCommonStore.getState()

    if (response) {
      switch (response.status) {
        case HTTP_STATUS._200:
          setLoading(false)
          break
      }
    }
    return response
  },
  function (error) {
    const { setLoading } = useCommonStore.getState()
    setLoading(false)

    if (error && error.response) {
      const { _400, _401, _403, _404, _500 } = HTTP_STATUS
      const { UNAUTHORIZED, SYSTEM_ERROR } = MSG
      const { data, status } = error.response

      switch (status) {
        case _401:
        case _403:
          mc.error(UNAUTHORIZED)
          cookie.remove(COOKIE_PARAM.TOKEN)
          if (window.location.pathname !== LOGIN_URL) window.location.reload()
          break
        case _400:
        case _404:
          mc.error(data.message)
          break
        case _500:
          mc.error(SYSTEM_ERROR)
          break
      }
    }
    return Promise.reject(error)
  }
)

export default instance
