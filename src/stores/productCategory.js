import { create } from 'zustand'
import { useProductCategoryAPI } from '../api'

const productCategoryAPI = useProductCategoryAPI()

export const useProductCategoryStore = create((set, get) => ({
  allProductCategory: [],

  getProductCategoryOptions: () => {
    return get().allProductCategory.map((item) => ({
      value: item.id,
      label: item.name
    }))
  },

  getAll: async (payload) => {
    const { data } = await productCategoryAPI.getAll(payload)
    set({ allProductCategory: data })
  },

  upsert: async (payload) => {
    await productCategoryAPI.upsert(payload)
  }
}))
