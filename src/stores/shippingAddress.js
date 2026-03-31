import { create } from 'zustand'
import { useShippingAddressAPI } from '../api'

const shippingAddressAPI = useShippingAddressAPI()

export const useShippingAddressStore = create((set, get) => ({
  allShippingAddress: [],

  getShippingAddresses: () => {
    const all = get().allShippingAddress
    const defaultAddress = all.find((item) => item.defaultAddress)
    if (defaultAddress) {
      const notDefault = all.filter((item) => item.id !== defaultAddress.id)
      return [defaultAddress, ...notDefault]
    }
    return all
  },

  getAll: async (payload) => {
    const { data } = await shippingAddressAPI.getAll(payload)
    set({ allShippingAddress: data })
  },

  upsert: async (payload) => {
    await shippingAddressAPI.upsert(payload)
  },

  updateDefault: async (payload) => {
    await shippingAddressAPI.updateDefault(payload)
  },

  delete: async (payload) => {
    await shippingAddressAPI.del(payload)
  }
}))
