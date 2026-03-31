import { create } from 'zustand'
import { useMessage } from '../composables'
import { useUploadAPI } from '../api'
import { MSG } from '../modules/constant'

const mc = useMessage()
const uploadAPI = useUploadAPI()

export const useUploadStore = create(() => ({
  upload: async (formData, showMsg = true) => {
    try {
      const { data } = await uploadAPI.upload(formData)
      if (showMsg) mc.success(MSG.UPLOAD_SUCCESS)
      return data
    } catch (error) {
      if (showMsg) mc.error(MSG.UPLOAD_FAILED)
    }
  },

  delete: async (payload, showMsg = true) => {
    try {
      await uploadAPI.remove(payload)
      if (showMsg) mc.success(MSG.DELETE_UPLOAD_SUCCESS)
    } catch (error) {
      if (showMsg) mc.error(MSG.DELETE_UPLOAD_FAILED)
    }
  }
}))
