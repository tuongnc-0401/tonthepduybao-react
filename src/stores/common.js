import { create } from 'zustand'

export const useCommonStore = create((set) => ({
  breadcrumbs: [],
  isLoading: false,

  setBreadcrumbs: (payload) => set({ breadcrumbs: payload }),
  setLoading: (payload) => set({ isLoading: payload })
}))
