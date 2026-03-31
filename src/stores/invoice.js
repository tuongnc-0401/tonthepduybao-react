import { create } from 'zustand'
import { PAGING } from '~/modules/constant'
import { useInvoiceAPI } from '../api'

const invoiceAPI = useInvoiceAPI()

export const useInvoiceStore = create((set) => ({
  invoice: null,
  allInvoice: {
    data: [],
    page: PAGING.DEFAULT_PAGE,
    pageSize: PAGING.DEFAULT_PAGE_SIZE,
    totalPages: 0,
    totalItems: 0
  },
  allInvoiceTotalPrice: 0,

  create: async (payload) => {
    await invoiceAPI.create(payload)
  },

  get: async (payload) => {
    const { data } = await invoiceAPI.get(payload)
    set({ invoice: data })
  },

  delete: async (payload) => {
    await invoiceAPI.del(payload)
  },

  getAll: async (payload) => {
    const { data } = await invoiceAPI.getAll(payload)
    set({ allInvoice: data.allInvoice, allInvoiceTotalPrice: data.totalPrice })
  }
}))
