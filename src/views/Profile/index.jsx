import { useState, useEffect, useRef } from 'react'
import { Form, Input, Button } from 'antd'
import { Icon } from '@iconify/react'
import { useMessage } from '~/composables'
import { MSG } from '~/modules/constant'
import {
  defEmptyFullName,
  defEmptyPhone,
  defEmptyEmail,
  defEmptyAddress
} from '~/modules/formRule'
import { downloadFromResponse } from '~/modules/utils'
import { useAuthStore } from '~/stores/auth'
import { useUserStore } from '~/stores/user'
import { useSystemLogStore } from '~/stores/systemLog'
import ImageViewer from '~/components/ImageViewer'
import SystemLogModal from '~/components/modal/SystemLogModal'

export default function Profile() {
  const mc = useMessage()
  const authStore = useAuthStore()
  const userStore = useUserStore()
  const systemLogStore = useSystemLogStore()
  const [form] = Form.useForm()
  const avatarRef = useRef()

  const [isEdit, setIsEdit] = useState(false)
  const [isShowSystemLogModal, setIsShowSystemLogModal] = useState(false)

  const me = userStore.me

  const initForm = () => {
    if (me) {
      form.setFieldsValue({
        fullName: me.fullName,
        phone: me.phone,
        email: me.email,
        address: me.address
      })
    }
    setIsEdit(false)
  }

  useEffect(() => {
    userStore.getMe().then(initForm)
  }, [])

  useEffect(() => {
    initForm()
  }, [me])

  const updateAvatar = async (event) => {
    const files = event.target.files
    if (files && files.length !== 0) {
      const formData = new FormData()
      formData.append('avatar', files[0])
      await userStore.updateAvatar(formData)
      authStore.updateCurrentUser(userStore.me)
    }
  }

  const formSubmit = async (values) => {
    try {
      await userStore.update(values)
      authStore.updateCurrentUser(userStore.me)
      initForm()
      mc.success(MSG.UPDATE_SUCCESS)
    } catch {
      mc.error(MSG.UPDATE_FAILED)
    }
  }

  const downloadSystemLog = async (payload) => {
    try {
      const { headers, data } = await systemLogStore.download(payload)
      downloadFromResponse(headers, data)
      mc.success(MSG.DOWNLOAD_SUCCESS)
      setIsShowSystemLogModal(false)
    } catch {
      mc.error(MSG.DOWNLOAD_FAILED)
      setIsShowSystemLogModal(false)
    }
  }

  if (!me) return null

  return (
    <section className="px-32">
      <div className="flex">
        <div className="mr-20 min-w-[200px]">
          <ImageViewer scope="avatar" hasPrefix src={me.avatar} />
          <button
            className="outline-none border-none bg-transparent flex items-center mt-8 text-blue-500 cursor-pointer"
            onClick={() => avatarRef.current.click()}
          >
            <Icon icon="material-symbols:upload" width="16px" />
            <span className="ml-2">Cập nhật ảnh đại diện</span>
          </button>
          <input
            ref={avatarRef}
            type="file"
            className="hidden"
            accept=".jpeg,.jpg,.png"
            onChange={updateAvatar}
          />
        </div>

        <div className="border border-solid border-slate-300 w-full rounded-md">
          <div className="flex items-center justify-between py-4 px-8 bg-slate-100">
            <span className="font-semibold text-slate-800">Thông tin tài khoản</span>
            <div className="flex items-center">
              {authStore.isAdmin && (
                <Button
                  type="link"
                  className="w-fit flex items-center px-0"
                  onClick={() => setIsShowSystemLogModal(true)}
                >
                  <Icon icon="material-symbols:download" width="16px" />
                  <span className="ml-2">Tải log</span>
                </Button>
              )}
              {!isEdit && (
                <Button
                  type="link"
                  className="w-fit flex items-center px-0 ml-16"
                  onClick={() => setIsEdit(true)}
                >
                  <Icon icon="lucide:edit" width="14px" />
                  <span className="ml-2">Sửa</span>
                </Button>
              )}
            </div>
          </div>

          <div className="px-8 py-4">
            <Form
              form={form}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 18 }}
              onFinish={formSubmit}
            >
              <Form.Item
                label={
                  <span className="flex items-center">
                    <Icon icon="ic:baseline-login" />
                    <span className="ml-2">Tên đăng nhập</span>
                  </span>
                }
              >
                <span className="font-medium">{me.username}</span>
              </Form.Item>

              <Form.Item
                label={
                  <span className="flex items-center">
                    <Icon icon="solar:key-bold" />
                    <span className="ml-2">Vai trò</span>
                  </span>
                }
              >
                <span className="font-medium">{me.role?.name}</span>
              </Form.Item>

              <Form.Item
                label={
                  <span className="flex items-center">
                    <Icon icon="mdi:store-marker-outline" />
                    <span className="ml-2">Chi nhánh</span>
                  </span>
                }
              >
                <span className="font-medium">{me.branch?.name || 'Tất cả chi nhánh'}</span>
              </Form.Item>

              <Form.Item
                name="fullName"
                label={
                  <span className="flex items-center">
                    <Icon icon="mdi:user" />
                    <span className="ml-2">Họ và tên</span>
                  </span>
                }
                rules={[{ required: true, validator: defEmptyFullName }]}
              >
                {isEdit ? <Input /> : <span className="font-medium">{me.fullName}</span>}
              </Form.Item>

              <Form.Item
                name="phone"
                label={
                  <span className="flex items-center">
                    <Icon icon="mdi:phone" />
                    <span className="ml-2">Số điện thoại</span>
                  </span>
                }
                rules={[
                  { required: true, validator: defEmptyPhone },
                  { pattern: '^[0][0-9]{8,11}$', message: 'Số điện thoại không hợp lệ' }
                ]}
              >
                {isEdit ? (
                  <Input />
                ) : (
                  <span className={me.phone ? 'font-medium' : 'text-gray-400 italic'}>
                    {me.phone || 'Vui lòng thêm số điện thoại'}
                  </span>
                )}
              </Form.Item>

              <Form.Item
                name="email"
                label={
                  <span className="flex items-center">
                    <Icon icon="mdi:email" />
                    <span className="ml-2">Email</span>
                  </span>
                }
                rules={[
                  { required: true, validator: defEmptyEmail },
                  { type: 'email', message: 'Email không hợp lệ' }
                ]}
              >
                {isEdit ? (
                  <Input />
                ) : (
                  <span className={me.email ? 'font-medium' : 'text-gray-400 italic'}>
                    {me.email || 'Vui lòng thêm email'}
                  </span>
                )}
              </Form.Item>

              <Form.Item
                name="address"
                label={
                  <span className="flex items-center">
                    <Icon icon="mdi:address-marker" />
                    <span className="ml-2">Địa chỉ</span>
                  </span>
                }
                rules={[{ required: true, validator: defEmptyAddress }]}
              >
                {isEdit ? (
                  <Input />
                ) : (
                  <span className={me.address ? 'font-medium' : 'text-gray-400 italic'}>
                    {me.address || 'Vui lòng thêm địa chỉ'}
                  </span>
                )}
              </Form.Item>

              {isEdit && (
                <Form.Item wrapperCol={{ span: 18, offset: 4 }}>
                  <div className="mt-8">
                    <Button className="px-20" onClick={initForm}>
                      Huỷ bỏ
                    </Button>
                    <Button type="primary" htmlType="submit" className="px-20 ml-4">
                      Lưu
                    </Button>
                  </div>
                </Form.Item>
              )}
            </Form>
          </div>
        </div>
      </div>

      {isShowSystemLogModal && (
        <SystemLogModal
          onOk={downloadSystemLog}
          onClose={() => setIsShowSystemLogModal(false)}
        />
      )}
    </section>
  )
}
