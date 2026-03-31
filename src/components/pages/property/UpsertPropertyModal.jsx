import { useState, useEffect } from 'react'
import { Modal, Form, Input, Select, Button } from 'antd'
import { cloneDeep, isNil } from 'lodash'
import { Icon } from '@iconify/react'
import { useMessage } from '~/composables'
import { MSG, TYPE_KEY, TYPE } from '~/modules/constant'
import {
  defEmptyCategory,
  defEmptyPropertyDetailName,
  defEmptyPropertyName
} from '~/modules/formRule'
import { usePropertyStore } from '~/stores/property'

export default function UpsertPropertyModal({ property = null, onCallback, onClose }) {
  const [form] = Form.useForm()
  const mc = useMessage()
  const propertyStore = usePropertyStore()
  const isEdit = !isNil(property)

  const initialFormState = {
    id: null,
    name: null,
    type: TYPE_KEY.IRON,
    properties: []
  }

  useEffect(() => {
    if (isEdit) {
      const formValue = {
        id: property.id,
        type: property.type,
        name: property.name,
        properties: property.items.map((item) => ({ ...item, deleted: false }))
      }
      form.setFieldsValue(formValue)
    } else {
      form.setFieldsValue(cloneDeep(initialFormState))
    }
  }, [property])

  const handleFinish = async (values) => {
    const { id, name, type, properties } = values

    if (isEdit) {
      try {
        await propertyStore.update({
          id: property.id,
          name,
          type,
          properties: properties.map((item) => ({
            id: item.id,
            name: item.name,
            deleted: item.deleted
          }))
        })
        mc.success(MSG.UPDATE_SUCCESS)
      } catch (error) {
        mc.error(MSG.UPDATE_FAILED)
      }
    } else {
      try {
        await propertyStore.create({
          name,
          type,
          properties: properties.map((item) => item.name)
        })
        mc.success(MSG.SAVE_SUCCESS)
      } catch (error) {
        mc.error(MSG.SAVE_FAILED)
      }
    }

    form.resetFields()
    if (onCallback) onCallback()
    onClose()
  }

  return (
    <Modal
      open
      centered
      width="40vw"
      title={`${isEdit ? 'Sửa' : 'Thêm'} thuộc tính`}
      okText="Lưu"
      cancelText="Đóng"
      onOk={() => form.submit()}
      onCancel={onClose}
    >
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onFinish={handleFinish}
      >
        <Form.Item
          label="Tên thuộc tính"
          name="name"
          rules={[{ required: true, validator: defEmptyPropertyName }]}
          hasFeedback
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Danh mục"
          name="type"
          rules={[{ required: true, validator: defEmptyCategory }]}
          hasFeedback
        >
          <Select allowClear options={Object.values(TYPE)} />
        </Form.Item>

        <Form.List name="properties">
          {(fields, { add, remove }) => (
            <div className="max-h-[400px] overflow-y-auto custom-scroll">
              {fields
                .filter((_, i) => {
                  const props = form.getFieldValue('properties')
                  return props && props[i] && !props[i].deleted
                })
                .map((field, index) => (
                  <Form.Item
                    key={field.key}
                    label={`Giá trị ${index + 1}`}
                    name={[field.name, 'name']}
                    rules={[{ required: true, validator: defEmptyPropertyDetailName }]}
                  >
                    <div className="flex items-center">
                      <Form.Item name={[field.name, 'name']} noStyle>
                        <Input />
                      </Form.Item>
                      <Button
                        type="link"
                        danger
                        className="flex items-center"
                        onClick={() => remove(field.name)}
                      >
                        <Icon icon="mdi:trash-can" width="20px" />
                      </Button>
                    </div>
                  </Form.Item>
                ))}
              <Form.Item wrapperCol={{ span: 8, offset: 6 }}>
                <Button
                  type="dashed"
                  block
                  className="flex items-center justify-center"
                  onClick={() => add({ id: null, name: '', used: false, deleted: false })}
                >
                  <Icon icon="ic:round-plus" width="24px" />
                  Thêm giá trị thuộc tính
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>
      </Form>
    </Modal>
  )
}
