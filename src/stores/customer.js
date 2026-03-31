import { create } from 'zustand'
import { PAGING } from '~/modules/constant'
import { useCustomerAPI } from '../api'

const customerAPI = useCustomerAPI()

export const useCustomerStore = create((set, get) => ({
  allCustomer: {
    data: {
      customers: [],
      totalCustomer: 0,
      totalSupplier: 0,
      totalDeleted: 0
    },
    page: PAGING.DEFAULT_PAGE,
    pageSize: PAGING.DEFAULT_PAGE_SIZE,
    totalPages: 0,
    totalItems: 0
  },
  allCustomerOptions: [],

  // Getters
  getCustomerOptions: () => {
    return get().allCustomerOptions.map((item) => ({
      label: item.name,
      value: item.id
    }))
  },

  getAllCustomerTableData: () => {
    return get().allCustomer.data.customers.map((item) => {
      const phone =
        item.phone && item.phone.split(',').length !== 0
          ? item.phone.split(',').map((p) => p)
          : []
      return { ...item, phone }
    })
  },

  // Actions
  getAll: async (payload) => {
    const { data } = await customerAPI.getAll(payload)
    set({ allCustomer: data })
  },

  getAllOption: async (payload) => {
    const { data } = await customerAPI.getAllOption(payload)
    set({ allCustomerOptions: data })
  },

  upsert: async (payload) => {
    await customerAPI.upsert(payload)
  },

  delete: async (payload) => {
    await customerAPI.del(payload)
  },

  undelete: async (payload) => {
    await customerAPI.undel(payload)
  }
}))
