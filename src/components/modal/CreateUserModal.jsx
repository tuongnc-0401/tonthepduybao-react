import { useState, useEffect } from 'react'
import { Modal, Form, Input, Select } from 'antd'
import { useBranchStore } from '~/stores/branch'
import { useUserStore } from '~/stores/user'
import {
  defEmptyBranch,
  defEmptyPassword,
  defEmptyRole,
  defEmptyUsername
} from '~/modules/formRule'

export default function CreateUserModal({ onOk, onClose }) {
  const [form] = Form.useForm()
  const userStore = useUserStore()
  const branchStore = useBranchStore()

  useEffect(() => {
    branchStore.getAll()
  }, [])

  const handleFinish = (values) => {
    onOk({
      username: values.username,
      password: values.password,
      branchId: values.branchId,
      roleId: values.roleId
    })
  }

  return (
    <Modal
      open
      centered
      width="32vw"
      title="Tạo tài khoản nhân viên"
      okText="Tạo"
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
          <Input />
        </Form.Item>

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
            <Select placeholder="Chọn chi nhánh" options={branchStore.getBranchOptions()} />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  )
}
