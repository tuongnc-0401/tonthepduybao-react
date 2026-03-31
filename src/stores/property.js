import { create } from 'zustand'
import { usePropertyAPI } from '../api'

const propertyAPI = usePropertyAPI()

export const usePropertyStore = create((set, get) => ({
  allProperty: [],

  getPropertyOptions: () => {
    return get().allProperty.map((item) => ({
      value: item.id,
      label: item.name
    }))
  },

  getAll: async (payload) => {
    const { data } = await propertyAPI.getAll(payload)
    set({ allProperty: data })
  },

  getAllByType: async (payload) => {
    const { data } = await propertyAPI.getAllByType(payload)
    set({ allProperty: data })
  },

  delete: async (payload) => {
    await propertyAPI.del(payload)
  },

  create: async (payload) => {
    await propertyAPI.create(payload)
  },

  update: async (payload) => {
    await propertyAPI.update(payload)
  }
}))
