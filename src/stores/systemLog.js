import { create } from 'zustand'
import { useSystemLogAPI } from '~/api'

const systemLogAPI = useSystemLogAPI()

export const useSystemLogStore = create(() => ({
  download: async (payload) => {
    return await systemLogAPI.download(payload)
  }
}))
