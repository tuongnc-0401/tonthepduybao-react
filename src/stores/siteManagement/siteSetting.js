import { create } from 'zustand'
import { useSiteManagementAPI } from '~/api'
import { useMessage } from '~/composables'
import { MSG } from '~/modules/constant'

const mc = useMessage()
const siteManagementAPI = useSiteManagementAPI()

export const useSiteSettingStore = create((set, get) => ({
  allSetting: null,

  getAllSetting: async () => {
    const res = await siteManagementAPI.getAllSetting()
    set({ allSetting: res.data })
  },

  deleteSetting: async (payload) => {
    try {
      await siteManagementAPI.deleteSetting(payload)
      await get().getAllSetting()
      mc.success(MSG.DELETE_SUCCESS)
    } catch (error) {
      mc.error(MSG.DELETE_FAILED)
    }
  },

  saveSetting: async (payload, rollback) => {
    try {
      await siteManagementAPI.saveSetting(payload)
      await get().getAllSetting()
      mc.success(MSG.SAVE_SUCCESS)
    } catch (error) {
      mc.error(MSG.SAVE_FAILED)
      if (rollback) await rollback()
    }
  }
}))
