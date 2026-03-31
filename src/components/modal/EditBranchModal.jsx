import { useState, useEffect } from 'react'
import { Modal, Form, Input } from 'antd'
import { cloneDeep, isNil } from 'lodash'
import { useBranchStore } from '~/stores/branch'
import { useMessage, useMoment } from '~/composables'
import { MSG } from '~/modules/constant'
import {
  defEmptyBranchName,
  defEmptyAddress,
  defEmptyPhone,
  defEmptyManager
} from '~/modules/formRule'

export default function EditBranchModal({ branch, onClose }) {
  const [form] = Form.useForm()
  const mc = useMessage()
  const moment = useMoment()
  const branchStore = useBranchStore()
  const [formState, setFormState] = useState({})

  useEffect(() => {
    if (branch) {
      const cloned = cloneDeep(branch)
      setFormState(cloned)
      form.setFieldsValue(cloned)
    }
  }, [branch])

  const formSubmit = async (values) => {
    try {
      await branchStore.upsert({ ...formState, ...values })
      form.resetFields()
      mc.success(MSG.UPDATE_SUCCESS)
      onClose()
    } catch (error) {
      mc.error(MSG.UPDATE_FAILED)
    }
  }

  if (!branch) return null

  return (
    <Modal
      open={!isNil(branch)}
      centered
      width="50vw"
      title={`Sửa thông tin chi nhánh - Cập nhật lúc: ${moment.mFormat(formState.updatedAt)}`}
      okText="Chỉnh sửa"
      cancelText="Đóng"
      onOk={() => form.submit()}
      onCancel={onClose}
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        onFinish={formSubmit}
      >
        <Form.Item
          label="Tên chi nhánh"
          name="name"
          rules={[{ required: true, validator: defEmptyBranchName }]}
          hasFeedback
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, validator: defEmptyPhone }]}
          hasFeedback
          wrapperCol={{ span: 10 }}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Zalo"
          name="zalo"
          wrapperCol={{ span: 10 }}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Người đại diện"
          name="manager"
          rules={[{ required: true, validator: defEmptyManager }]}
          hasFeedback
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, validator: defEmptyAddress }]}
          hasFeedback
        >
          <Input />
        </Form.Item>
        <Form.Item label="Google Map URL" name="mapUrl">
          <Input />
        </Form.Item>
        <Form.Item label="Google Map Embed" name="mapEmbedUrl">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}
