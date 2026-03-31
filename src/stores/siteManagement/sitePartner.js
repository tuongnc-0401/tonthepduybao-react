import { create } from 'zustand'
import { useMessage } from '~/composables'
import { useSiteManagementAPI } from '~/api'
import { MSG } from '~/modules/constant'

const mc = useMessage()
const siteManagementAPI = useSiteManagementAPI()

export const useSitePartnerStore = create((set, get) => ({
  allPartner: [],

  searchPartner: async (payload) => {
    const res = await siteManagementAPI.searchPartner({ search: payload })
    set({ allPartner: res.data })
  },

  upsertPartner: async (payload) => {
    try {
      await siteManagementAPI.upsertPartner(payload)
      await get().searchPartner('')
      mc.success(MSG.UPDATE_SUCCESS)
    } catch (err) {
      if (err && err.response && err.response.message) mc.error(err.response.message)
      else mc.error(MSG.UPDATE_FAILED)
    }
  },

  deletePartner: async (id) => {
    try {
      await siteManagementAPI.deletePartner(id)
      await get().searchPartner('')
      mc.success(MSG.DELETE_SUCCESS)
    } catch (err) {
      mc.error(MSG.DELETE_FAILED)
    }
  }
}))
