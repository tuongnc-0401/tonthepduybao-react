export const FALLBACK_IMAGE = '/img/fallback.png'
export const NOT_FOUND_PATH = '/404'

export const PAGING = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 15
}

export const ALL_BRANCH_OPTION = {
  value: -1,
  label: 'Tất cả chi nhánh'
}

export const MSG = {
  SYSTEM_ERROR: 'Hệ thống xử lý lỗi, xin thử lại!',
  UNAUTHORIZED: 'Bạn không có quyền truy cập vào hệ thống, xin hãy đăng nhập!',

  SAVE_SUCCESS: 'Lưu dữ liệu thành công!',
  SAVE_FAILED: 'Lưu dữ liệu không thành công!',

  UPDATE_SUCCESS: 'Cập nhật thành công!',
  UPDATE_FAILED: 'Cập nhật không thành công!',

  DELETE_SUCCESS: 'Dữ liệu đã được xoá thành công!',
  DELETE_FAILED: 'Xoá không thành công!',

  UPLOAD_SUCCESS: 'Tải tệp lên thành công!',
  UPLOAD_FAILED: 'Tải tệp lên thất bại!',

  DELETE_UPLOAD_SUCCESS: 'Xoá tệp thành công!',
  DELETE_UPLOAD_FAILED: 'Xoá tệp thất bại!',

  PAGE_RELOAD_CONFIRMATION: 'Bạn có chắc muốn reload lại trang này không?',

  UPDATE_AVATAR_SUCCESS: 'Cập nhật avatar thành công.',
  UPDATE_AVATAR_FAILED: 'Cập nhật avatar thất bại.',

  DOWNLOAD_SUCCESS: 'Tải xuống thành công.',
  DOWNLOAD_FAILED: 'Tải xuống thất bại.'
}

export const BRANCH_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
}

export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  BLOCKED: 'BLOCKED'
}

export const USER_ROLE = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  STAFF: 'STAFF'
}

export const USER_PERMISSION = {
  FULL_ACCESS: [USER_ROLE.ADMIN, USER_ROLE.MANAGER, USER_ROLE.STAFF].join('__'),
  A_ACCESS: [USER_ROLE.ADMIN].join('__'),
  AM_ACCESS: [USER_ROLE.ADMIN, USER_ROLE.MANAGER].join('__')
}

export const TYPE_KEY = {
  IRON: 'IRON',
  STEEL: 'STEEL',
  CORRUGATED: 'CORRUGATED',
  SCREW: 'SCREW'
}

export const TYPE = {
  IRON: { value: 'IRON', label: 'Sắt' },
  STEEL: { value: 'STEEL', label: 'Thép' },
  CORRUGATED: { value: 'CORRUGATED', label: 'Tôn' },
  SCREW: { value: 'SCREW', label: 'Vật liệu khác' }
}

export const CUSTOMER_TYPE = {
  CUSTOMER: { value: 'CUSTOMER', label: 'Khách hàng' },
  SUPPLIER: { value: 'SUPPLIER', label: 'Nhà cung cấp' }
}

export const CUSTOMER_TYPE_KEY = {
  CUSTOMER: 'CUSTOMER',
  SUPPLIER: 'SUPPLIER'
}

export const SYSTEM_LOG_TYPE = {
  LOG: 'LOG',
  TXT: 'TXT',
  CSV: 'CSV'
}

export const SITE_SETTING = {
  MASTER_KEY: {
    HOME: 'HOME',
    ABOUT_US: 'ABOUT_US',
    CONTACT_US: 'CONTACT_US',
    FOOTER: 'FOOTER'
  },
  KEY: {
    BANNER: 'BANNER',
    ABOUT_US: 'ABOUT_US',
    PRODUCT_CATEGORY: 'PRODUCT_CATEGORY',
    PARTNER: 'PARTNER',
    CONTACT_US: 'CONTACT_US'
  },
  DIR: {
    ROOT: 'site/setting',
    BANNER: 'site/setting/banner',
    PRODUCT_CATEGORY: 'site/setting/category'
  }
}
