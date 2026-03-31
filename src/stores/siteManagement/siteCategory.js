import { create } from 'zustand'
import { useMessage } from '~/composables'
import { useSiteManagementAPI } from '~/api'
import { MSG } from '~/modules/constant'

const mc = useMessage()
const siteManagementAPI = useSiteManagementAPI()

export const useSiteCategoryStore = create((set, get) => ({
  allCategory: [],
  parentOptions: [],

  getAllCategoryTableData: () => {
    const all = get().allCategory
    return all.map((item) => {
      const parentCategory = all.find((cateItem) => cateItem.id === item.parent)
      return { ...item, parentName: parentCategory ? parentCategory.name : '' }
    })
  },

  getCategoryOptions: async (excludeId = null) => {
    const res = await siteManagementAPI.searchCategory({ search: '' })
    const parentOptions = res.data
      .filter((item) => item.id !== excludeId)
      .map((item) => ({ value: item.id, label: item.name }))
    set({ allCategory: res.data, parentOptions })
  },

  searchCategory: async (payload) => {
    const res = await siteManagementAPI.searchCategory({ search: payload })
    set({ allCategory: res.data })
  },

  upsertCategory: async (payload) => {
    try {
      await siteManagementAPI.upsertCategory(payload)
      await get().searchCategory('')
      mc.success(MSG.UPDATE_SUCCESS)
    } catch (err) {
      mc.error(MSG.UPDATE_FAILED)
    }
  },

  deleteCategory: async (id) => {
    try {
      await siteManagementAPI.deleteCategory(id)
      await get().searchCategory('')
      mc.success(MSG.DELETE_SUCCESS)
    } catch (err) {
      mc.error(MSG.DELETE_FAILED)
    }
  }
}))
