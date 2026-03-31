import { message } from 'antd'

export const useMessage = () => {
  const toast = (content, type, duration = 3) => {
    message[type](content, duration)
  }

  const success = (content, duration = 3) => toast(content, 'success', duration)
  const error = (content, duration = 3) => toast(content, 'error', duration)
  const warning = (content, duration = 3) => toast(content, 'warning', duration)

  return { success, error, warning }
}
