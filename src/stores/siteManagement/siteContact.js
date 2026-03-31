import { create } from 'zustand'
import { useMessage } from '~/composables'
import { useSiteManagementAPI } from '~/api'
import { MSG } from '~/modules/constant'

const mc = useMessage()
const siteManagementAPI = useSiteManagementAPI()

export const useSiteContactStore = create((set) => ({
  allContact: [],

  searchContact: async (payload) => {
    const res = await siteManagementAPI.searchContact({ search: payload })
    set({ allContact: res.data })
  },

  resolveContact: async (id) => {
    try {
      await siteManagementAPI.resolveContact(id)
      mc.success(MSG.UPDATE_SUCCESS)
    } catch (err) {
      mc.error(MSG.UPDATE_FAILED)
    }
  },

  deleteContact: async (id) => {
    try {
      await siteManagementAPI.deleteContact(id)
      mc.success(MSG.DELETE_SUCCESS)
    } catch (err) {
      mc.error(MSG.DELETE_FAILED)
    }
  }
}))
