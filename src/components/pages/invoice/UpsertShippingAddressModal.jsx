import { useState, useEffect } from 'react'
import { Modal, Form, Input, Checkbox } from 'antd'
import { cloneDeep, isNil } from 'lodash'
import { defEmptyAddress, defEmptyCustomerName, defEmptyPhone } from '~/modules/formRule'

export default function UpsertShippingAddressModal({
  customerId,
  shippingAddress = null,
  onSubmit,
  onClose
}) {
  const [form] = Form.useForm()
  const isEdit = !isNil(shippingAddress)

  useEffect(() => {
    if (isEdit) {
      form.setFieldsValue(cloneDeep(shippingAddress))
    } else {
      form.resetFields()
    }
  }, [shippingAddress])

  const handleFinish = (values) => {
    onSubmit(values)
  }

  return (
    <Modal
      open
      centered
      width="30vw"
      title={`${isEdit ? 'Sửa' : 'Thêm'} thông tin giao hàng`}
      okText="Lưu"
      cancelText="Đóng"
      onOk={() => form.submit()}
      onCancel={onClose}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Tên người nhận"
          name="name"
          rules={[{ required: true, validator: defEmptyCustomerName }]}
          hasFeedback
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, validator: defEmptyPhone }]}
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
        <Form.Item name="defaultAddress" valuePropName="checked">
          <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  )
}
