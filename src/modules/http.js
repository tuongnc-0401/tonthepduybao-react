export const BASE_API_URL = import.meta.env.VITE_BASE_API_URL
export const S3_URL = import.meta.env.VITE_S3_URL
export const LOGIN_URL = '/login'

export const WHITE_LIST_API_URL = ['/auth/login', '/auth/reset-password', '/branch/public/all']

export const DEFAULT_HEADERS = {
  Authorization: '',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Content-Type': 'application/json'
}
export const FORM_DATA_HEADERS = { 'Content-Type': 'multipart/form-data' }

export const HTTP_STATUS = {
  _200: 200,
  _400: 400,
  _401: 401,
  _403: 403,
  _404: 404,
  _500: 500
}

export const HTTP_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
}

export const COOKIE_PARAM = {
  TOKEN: 'token'
}

export const STORAGE_PARAM = {
  USER: 'user'
}
