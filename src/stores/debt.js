import { create } from 'zustand'
import { useDebtAPI } from '../api'
import { PAGING } from '~/modules/constant'

const debtAPI = useDebtAPI()

export const useDebtStore = create((set, get) => ({
  debt: null,
  allDebt: {
    data: [],
    page: PAGING.DEFAULT_PAGE,
    pageSize: PAGING.DEFAULT_PAGE_SIZE,
    totalPages: 0,
    totalItems: 0
  },
  allDebtTotalPrice: 0,

  get: async (payload) => {
    const { data } = await debtAPI.get(payload)
    set({ debt: data, allDebtTotalPrice: data.totalPrice })
  },

  getAll: async (payload) => {
    const { data } = await debtAPI.getAll(payload)
    set({ allDebt: data.allDebt, allDebtTotalPrice: data.totalPrice })
  },

  create: async (payload) => {
    await debtAPI.create(payload)
  },

  createFromFile: async (payload) => {
    return await debtAPI.createFromFile(payload)
  },

  update: async (payload) => {
    await debtAPI.update(payload)
  },

  delete: async (payload) => {
    await debtAPI.del(payload)
  },

  download: async (payload) => {
    return await debtAPI.download(payload)
  },

  downloadTemplate: async (payload) => {
    return await debtAPI.downloadTemplate(payload)
  }
}))
