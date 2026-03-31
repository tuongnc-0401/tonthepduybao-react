import { useState, useEffect } from 'react'
import { Modal, Form, Input, Select } from 'antd'
import { cloneDeep, isNil } from 'lodash'
import { useSiteCategoryStore } from '~/stores/siteManagement/siteCategory'

export default function UpsertSiteCategoryModal({ category = null, onClose }) {
  const [form] = Form.useForm()
  const siteCategoryStore = useSiteCategoryStore()
  const isEdit = !isNil(category)

  useEffect(() => {
    if (isEdit) {
      siteCategoryStore.getCategoryOptions(category.id)
      form.setFieldsValue(cloneDeep(category))
    } else {
      siteCategoryStore.getCategoryOptions()
      form.resetFields()
    }
  }, [])

  const onFinish = async (values) => {
    await siteCategoryStore.upsertCategory({ ...values, id: isEdit ? category.id : null })
    onClose()
  }

  const filterOption = (input, option) => option.label.toLowerCase().includes(input.toLowerCase())

  return (
    <Modal
      open
      centered
      width="40vw"
      title={`${isEdit ? 'Sửa' : 'Thêm mới'} danh mục`}
      okText="Lưu"
      cancelText="Đóng"
      onOk={() => form.submit()}
      onCancel={onClose}
    >
      <Form form={form} layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} onFinish={onFinish}>
        <Form.Item hasFeedback label="Tên danh mục" name="name" rules={[{ required: true, message: 'Tên danh mục là bắt buộc' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Chọn thư mục cha" name="parent">
          <Select
            showSearch
            placeholder="Chọn thư mục cha"
            options={siteCategoryStore.parentOptions}
            filterOption={filterOption}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
