import { useState, useEffect } from 'react'
import { Table, Button, Form, Input, Popconfirm } from 'antd'
import { Icon } from '@iconify/react'
import { useMessage, useMoment } from '~/composables'
import { MSG } from '~/modules/constant'
import { defEmptyCategoryName } from '~/modules/formRule'
import { PRODUCT_CATEGORY_TABLE_COLUMNS } from '~/modules/table'
import { useProductCategoryStore } from '~/stores/productCategory'
import Heading from '~/components/common/Heading'

export default function ProductCategory() {
  const mc = useMessage()
  const moment = useMoment()
  const productCategoryStore = useProductCategoryStore()
  const [form] = Form.useForm()
  const [search, setSearch] = useState('')

  const init = async () => {
    await productCategoryStore.getAll({ search })
  }

  useEffect(() => {
    init()
  }, [])

  const selectCategory = (record) => {
    form.setFieldsValue({ id: record.id, name: record.name })
  }

  const createCategory = async (values) => {
    try {
      await productCategoryStore.upsert(values)
      await init()
      form.resetFields()
      mc.success(MSG.SAVE_SUCCESS)
    } catch {
      mc.error(MSG.SAVE_FAILED)
    }
  }

  const columns = PRODUCT_CATEGORY_TABLE_COLUMNS.map((col) => {
    if (col.key === 'lastModified') {
      return {
        ...col,
        render: (_, record) => (
          <div>
            <div className="mb-1 flex items-center">
              <Icon icon="mdi:account" />
              <span className="ml-2">{record.updatedBy}</span>
            </div>
            <div className="mb-0 text-base text-gray-600 italic flex items-center">
              <Icon icon="mdi:clock-time-four" width="13px" />
              <span className="ml-2">{moment.mFormat(record.updatedAt)}</span>
            </div>
          </div>
        )
      }
    }
    if (col.key === 'action') {
      return {
        ...col,
        render: (_, record) => (
          <div>
            <Button type="link" onClick={() => selectCategory(record)}>Sửa</Button>
            <Popconfirm title="Bạn có chắc muốn xoá danh mục này không?" okText="Có" cancelText="Không">
              <Button type="text" danger className="ml-4">Xoá</Button>
            </Popconfirm>
          </div>
        )
      }
    }
    return col
  })

  return (
    <main>
      <section className="grid grid-cols-12 gap-x-20">
        <div className="col-span-4">
          <Heading title="Thêm danh mục" />
          <Form form={form} layout="vertical" onFinish={createCategory}>
            <Form.Item name="id" className="hidden">
              <Input disabled />
            </Form.Item>
            <Form.Item
              hasFeedback
              label="Tên danh mục"
              name="name"
              rules={[{ required: true, validator: defEmptyCategoryName }]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="px-20">Lưu</Button>
            </Form.Item>
          </Form>
        </div>

        <div className="col-span-8">
          <Heading title="Danh sách danh mục">
            <Input.Search
              placeholder="Tìm kiếm ..."
              className="mr-4 w-[400px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onPressEnter={init}
            />
          </Heading>
          <Table
            columns={columns}
            dataSource={productCategoryStore.allProductCategory}
            rowKey="id"
            className="mt-8"
            pagination={false}
          />
        </div>
      </section>
    </main>
  )
}
