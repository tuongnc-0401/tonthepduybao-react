import { create } from 'zustand'
import { useAuthAPI } from '~/api'
import { useCookie } from '~/composables'
import { COOKIE_PARAM, STORAGE_PARAM } from '~/modules/http'
import { ALL_BRANCH_OPTION, USER_ROLE } from '~/modules/constant'

const authAPI = useAuthAPI()
const cookie = useCookie()

export const useAuthStore = create((set, get) => ({
  isAuth: false,
  currentUser: null,

  // Getters (computed values as functions)
  getCurrentUserRole: () => {
    const { currentUser } = get()
    return currentUser ? currentUser.role : null
  },

  isAdmin: () => {
    const { currentUser } = get()
    if (!currentUser) return false
    return currentUser.role.id === USER_ROLE.ADMIN
  },

  isManager: () => {
    const { currentUser } = get()
    if (!currentUser) return false
    return currentUser.role.id === USER_ROLE.MANAGER
  },

  isStaff: () => {
    const { currentUser } = get()
    if (!currentUser) return false
    return currentUser.role.id === USER_ROLE.STAFF
  },

  // Actions
  checkAuth: () => {
    const userStr = localStorage.getItem(STORAGE_PARAM.USER)
    let currentUser = null
    if (userStr) currentUser = JSON.parse(userStr)
    else cookie.remove(COOKIE_PARAM.TOKEN)

    const isAuth = !!cookie.get(COOKIE_PARAM.TOKEN)
    set({ isAuth, currentUser })
  },

  updateCurrentUser: (payload) => {
    set({ currentUser: payload })
    localStorage.setItem(STORAGE_PARAM.USER, JSON.stringify(payload))
  },

  login: async (payload) => {
    if (!payload.username) return

    const branchId = payload.branchId === ALL_BRANCH_OPTION.value ? null : payload.branchId
    const { data } = await authAPI.login({ ...payload, branchId })

    set({ currentUser: data.user })
    localStorage.setItem(STORAGE_PARAM.USER, JSON.stringify(data.user))
    cookie.set(COOKIE_PARAM.TOKEN, data.accessToken, 1)

    window.location.reload()
  },

  logout: async () => {
    cookie.remove(COOKIE_PARAM.TOKEN)
    window.location.reload()
  }
}))
