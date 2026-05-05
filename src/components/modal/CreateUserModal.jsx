import { useState, useEffect } from 'react'
import { Modal, Form, Input, Select } from 'antd'
import { useBranchStore } from '~/stores/branch'
import { useUserStore } from '~/stores/user'
import { useAuthStore } from '~/stores/auth'
import { ALL_BRANCH_OPTION } from '~/modules/constant'
import {
  defEmptyAddress,
  defEmptyBranch,
  defEmptyEmail,
  defEmptyFullName,
  defEmptyPassword,
  defEmptyPhone,
  defEmptyRole,
  defEmptyUsername
} from '~/modules/formRule'

export default function CreateUserModal({ user, onOk, onClose }) {
  const [form] = Form.useForm()
  const userStore = useUserStore()
  const branchStore = useBranchStore()
  const authStore = useAuthStore()
  const isEdit = !!user?.id

  useEffect(() => {
    branchStore.getAll()
  }, [])

  useEffect(() => {
    if (isEdit && user) {
      form.setFieldsValue({
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        roleId: user.role?.id,
        branchId: user.branch ? user.branch.id : ALL_BRANCH_OPTION.value  // Handle admin with all branches
      })
    } else {
      form.resetFields()
    }
  }, [user, isEdit, form])

  const handleFinish = (values) => {
    const payload = {
      username: values.username,
      roleId: values.roleId,
      branchId: values.branchId === ALL_BRANCH_OPTION.value ? null : values.branchId  // Convert -1 to null for backend
    }

    if (!isEdit) {
      payload.password = values.password
    }

    if (isEdit) {
      payload.id = user.id
      payload.fullName = values.fullName
      payload.email = values.email
      payload.phone = values.phone
      payload.address = values.address
    }

    onOk(payload)
  }

  return (
    <Modal
      open
      centered
      width={isEdit ? '40vw' : '32vw'}
      title={isEdit ? 'Cập nhật tài khoản nhân viên' : 'Tạo tài khoản nhân viên'}
      okText={isEdit ? 'Cập nhật' : 'Tạo'}
      cancelText="Đóng"
      onOk={() => form.submit()}
      onCancel={onClose}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Tên đăng nhập"
          name="username"
          rules={[
            { required: true, validator: defEmptyUsername },
            { pattern: /^[a-z0-9]*$/, message: 'Tên đăng nhập chỉ được nhập chữ hoặc số' }
          ]}
          hasFeedback
        >
          <Input disabled={isEdit} />
        </Form.Item>

        {!isEdit && (
          <div className="grid grid-cols-2 gap-x-8 mt-4">
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, validator: defEmptyPassword }]}
              hasFeedback
            >
              <Input type="password" />
            </Form.Item>
            <Form.Item
              label="Xác nhận"
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  validator: async (_, value) => {
                    if (!value) return Promise.reject('Xác nhận mật khẩu là trường bắt buộc.')
                    const password = form.getFieldValue('password')
                    if (password !== value) return Promise.reject('Xác nhận mật khẩu không khớp.')
                    return Promise.resolve()
                  }
                }
              ]}
              hasFeedback
            >
              <Input type="password" />
            </Form.Item>
          </div>
        )}

        {isEdit && (
          <>
            <Form.Item
              label="Họ và tên"
              name="fullName"
              rules={[{ required: true, validator: defEmptyFullName }]}
              hasFeedback
              className="mt-4"
            >
              <Input />
            </Form.Item>

            <div className="grid grid-cols-2 gap-x-8 mt-4">
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, validator: defEmptyEmail },
                  { type: 'email', message: 'Email không hợp lệ' }
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                  { required: true, validator: defEmptyPhone },
                  { pattern: '^[0][0-9]{8,11}$', message: 'Số điện thoại không hợp lệ' }
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
            </div>

            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, validator: defEmptyAddress }]}
              hasFeedback
              className="mt-4"
            >
              <Input />
            </Form.Item>
          </>
        )}

        <div className="grid grid-cols-2 gap-x-8 mt-4">
          <Form.Item
            label="Vai trò"
            name="roleId"
            rules={[{ required: true, validator: defEmptyRole }]}
            hasFeedback
          >
            <Select placeholder="Chọn vai trò" options={userStore.getRoleOptions()} />
          </Form.Item>
          <Form.Item
            label="Chi nhánh"
            name="branchId"
            rules={[{ required: true, validator: defEmptyBranch }]}
            hasFeedback
          >
            <Select
              placeholder="Chọn chi nhánh"
              options={authStore.isAdmin() ? branchStore.getAllBranchOptions() : branchStore.getBranchOptions()}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  )
}
