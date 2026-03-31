import { create } from 'zustand'
import { PAGING } from '~/modules/constant'
import { useProductAPI } from '../api'

const productAPI = useProductAPI()

export const useProductStore = create((set, get) => ({
  product: null,
  allProduct: {
    data: [],
    page: PAGING.DEFAULT_PAGE,
    pageSize: PAGING.DEFAULT_PAGE_SIZE,
    totalPages: 0,
    totalItems: 0
  },
  allProductOptions: [],

  create: async (payload) => {
    await productAPI.create(payload)
  },

  createAll: async (payload) => {
    await productAPI.createAll(payload)
  },

  get: async (payload) => {
    const { data } = await productAPI.get(payload)
    set({ product: data })
    return data
  },

  del: async (payload) => {
    await productAPI.del(payload)
  },

  deleteAll: async (payload) => {
    await productAPI.deleteAll(payload)
  },

  getAll: async (payload) => {
    const { data } = await productAPI.getAll(payload)
    set({ allProduct: data })
  },

  getAllOption: async (payload) => {
    const { data } = await productAPI.getAllOption(payload)
    set({ allProductOptions: data })
  }
}))
