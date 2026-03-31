import { create } from 'zustand'
import { useBranchAPI } from '../api'
import { ALL_BRANCH_OPTION } from '~/modules/constant'

const branchAPI = useBranchAPI()

export const useBranchStore = create((set, get) => ({
  allBranch: [],

  // Getters
  getBranchOptions: () => {
    return get().allBranch.map((item) => ({
      value: item.id,
      label: item.name
    }))
  },

  getAllBranchOptions: () => {
    const options = get().getBranchOptions()
    return [ALL_BRANCH_OPTION, ...options]
  },

  // Actions
  getAll: async () => {
    const { data } = await branchAPI.getAll()
    set({ allBranch: data })
  },

  upsert: async (payload) => {
    await branchAPI.upsert(payload)
    await get().getAll()
  }
}))
