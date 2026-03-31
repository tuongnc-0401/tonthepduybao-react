import { isNil, isEmpty, isNumber } from 'lodash'

export const defRule = async (_rule, value, label = '', max = null, min = null) => {
  const strValue = value !== null && value !== undefined ? value.toString().trim() : ''
  if (isNil(value) || isEmpty(strValue))
    return Promise.reject(`${label} là trường bắt buộc`)
  else if (!isNil(max) && isNumber(max) && strValue.length > max)
    return Promise.reject(`${label} là trường bắt buộc và không được vượt quá ${max} kí tự`)
  else if (!isNil(min) && isNumber(min) && strValue.length < min)
    return Promise.reject(`${label} là trường bắt buộc và có ít nhất ${min} kí tự`)

  return Promise.resolve()
}

export const defEmptyBranchName = (_, value) => defRule(_, value, 'Tên chi nhánh', 255)
export const defEmptyBranch = (_, value) => defRule(_, value, 'Chi nhánh')
export const defEmptyRole = (_, value) => defRule(_, value, 'Vai trò')
export const defEmptyCategoryName = (_, value) => defRule(_, value, 'Tên danh mục', 500)
export const defEmptyPartnerName = (_, value) => defRule(_, value, 'Tên đối tác', 500)
export const defEmptyAddress = (_, value) => defRule(_, value, 'Địa chỉ', 1000)
export const defEmptyPhone = (_, value) => defRule(_, value, 'Số điện thoại', 20)
export const defEmptyManager = (_, value) => defRule(_, value, 'Tên người đại diện', 255)
export const defEmptyPartnerLogo = (_, value) => defRule(_, value, 'Logo đối tác chưa được chọn')
export const defEmptyCategory = (_, value) => defRule(_, value, 'Danh mục chưa được chọn')
export const defEmptyCategoryImage = (_, value) => defRule(_, value, 'Hình ảnh cho danh mục sản phẩm chưa được chọn')
export const defEmptyPropertyName = (_, value) => defRule(_, value, 'Tên thuộc tính', 500)
export const defEmptyPropertyDetailName = (_, value) => defRule(_, value, 'Tên giá trị thuộc tính', 500)
export const defEmptyCustomerName = (_, value) => defRule(_, value, 'Tên khách hàng', 500)
export const defEmptyCustomerType = (_, value) => defRule(_, value, 'Phân loại khách hàng')
export const defEmptyFullName = (_, value) => defRule(_, value, 'Họ và tên')
export const defEmptyUsername = (_, value) => defRule(_, value, 'Tên đăng nhập', 50, 6)
export const defEmptyPassword = (_, value) => defRule(_, value, 'Mật khẩu', 100, 8)
export const defEmptyEmail = (_, value) => defRule(_, value, 'Email')
