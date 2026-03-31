import { create } from 'zustand'
import { useUserAPI } from '~/api'

const userAPI = useUserAPI()

export const useUserStore = create((set, get) => ({
  me: null,
  user: null,
  allUser: [],
  allRole: [],

  getRoleOptions: () => {
    return get().allRole.map((role) => ({
      label: role.name,
      value: role.id
    }))
  },

  getMe: async () => {
    const { data } = await userAPI.getMe()
    set({ me: data })
  },

  getUser: async (id) => {
    const { data } = await userAPI.get(id)
    set({ user: data })
  },

  getAll: async (payload) => {
    const { data } = await userAPI.getAll(payload)
    set({ allUser: data })
  },

  create: async (payload) => {
    await userAPI.create(payload)
  },

  update: async (payload) => {
    await userAPI.update(payload)
    await get().getMe()
  },

  updateAvatar: async (payload) => {
    await userAPI.updateAvatar(payload)
    await get().getMe()
  },

  getAllRole: async (payload) => {
    const { data } = await userAPI.getAllRole(payload)
    set({ allRole: data })
  },

  del: async (payload) => {
    await userAPI.del(payload)
  }
}))
