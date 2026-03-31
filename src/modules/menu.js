import { USER_PERMISSION } from './constant'

export const MENU = {
  HOME: {
    id: 'Home',
    path: '/',
    name: 'Trang chủ',
    icon: 'ant-design:home-outlined',
    subMenu: null,
    permission: USER_PERMISSION.FULL_ACCESS,
    implicit: false
  },

  PRODUCT: {
    id: 'Product',
    path: '/product/list',
    name: 'Sản phẩm',
    icon: 'fluent-mdl2:product-variant',
    subMenu: null,
    permission: USER_PERMISSION.FULL_ACCESS,
    implicit: false
  },
  PRODUCT_DETAIL: {
    id: 'Product',
    path: '/product/detail/',
    name: 'Thông tin sản phẩm',
    icon: 'fluent-mdl2:product-variant',
    subMenu: null,
    permission: USER_PERMISSION.FULL_ACCESS,
    implicit: true
  },
  CREATE_PRODUCT: {
    id: 'CreateProduct',
    name: 'Thêm sản phẩm',
    path: '/product/create',
    icon: null,
    subMenu: null,
    permission: USER_PERMISSION.FULL_ACCESS,
    implicit: true
  },
  EDIT_PRODUCT: {
    id: 'EditProduct',
    path: '/product/edit/',
    name: 'Chỉnh sửa sản phẩm',
    permission: USER_PERMISSION.FULL_ACCESS,
    implicit: true
  },

  DEBT: {
    id: 'DebtList',
    path: '/debt/list',
    name: 'Công nợ',
    icon: 'mdi:file-document-multiple',
    subMenu: null,
    permission: USER_PERMISSION.FULL_ACCESS,
    implicit: false
  },
  DEBT_DETAIL: {
    id: 'DebtDetail',
    path: '/debt/detail/',
    name: 'Thông tin công nợ',
    permission: USER_PERMISSION.FULL_ACCESS,
    implicit: true
  },
  ADD_DEBT: {
    id: 'AddDebt',
    path: '/debt/add',
    name: 'Tạo công nợ',
    permission: USER_PERMISSION.AM_ACCESS,
    implicit: true
  },
  EDIT_DEBT: {
    id: 'EditDebt',
    path: '/debt/edit/',
    name: 'Chỉnh sửa công nợ',
    permission: USER_PERMISSION.AM_ACCESS,
    implicit: true
  },

  INVOICE: {
    id: 'InvoiceList',
    path: '/invoice/list',
    name: 'Hoá đơn',
    icon: 'la:file-invoice-dollar',
    subMenu: null,
    permission: USER_PERMISSION.A_ACCESS,
    implicit: false
  },
  INVOICE_DETAIL: {
    id: 'InvoiceDetail',
    path: '/invoice/detail/',
    name: 'Thông tin hoá đơn',
    permission: USER_PERMISSION.FULL_ACCESS,
    implicit: true
  },
  ADD_INVOICE: {
    id: 'AddInvoice',
    path: '/invoice/add',
    name: 'Tạo hoá đơn',
    permission: USER_PERMISSION.AM_ACCESS,
    implicit: true
  },
  EDIT_INVOICE: {
    id: 'EditInvoice',
    path: '/invoice/edit/',
    name: 'Chỉnh sửa hoá đơn',
    permission: USER_PERMISSION.AM_ACCESS,
    implicit: true
  },

  CUSTOMER: {
    id: 'Customer',
    path: '/customer',
    name: 'Khách hàng',
    icon: 'heroicons:user-group-solid',
    subMenu: null,
    permission: USER_PERMISSION.FULL_ACCESS,
    implicit: false
  },
  PROPERTY: {
    id: 'Property',
    path: '/property',
    name: 'Thiết lập thuộc tính',
    icon: 'ic:baseline-settings',
    subMenu: null,
    permission: USER_PERMISSION.AM_ACCESS,
    implicit: false
  },
  BRANCH: {
    id: 'Branch',
    path: '/branch',
    name: 'Chi nhánh',
    icon: 'mdi:store-marker-outline',
    subMenu: null,
    permission: USER_PERMISSION.A_ACCESS,
    implicit: false
  },
  USER: {
    id: 'User',
    path: '/users',
    name: 'Nhân viên',
    icon: 'fluent-mdl2:recruitment-management',
    subMenu: null,
    permission: USER_PERMISSION.A_ACCESS,
    implicit: false
  },
  PROFILE: {
    id: 'profile',
    path: '/profile',
    name: 'Tài khoản',
    icon: 'ant-design:user',
    subMenu: null,
    permission: USER_PERMISSION.FULL_ACCESS,
    implicit: false
  }
}
