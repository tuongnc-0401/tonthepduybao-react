import { useState, useMemo } from 'react'
import { Table, Button, Image, Popconfirm } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import { useSiteSettingStore } from '~/stores/siteManagement/siteSetting'
import { useUploadStore } from '~/stores/upload'
import { SITE_HOME_PRODUCT_CATEGORY_TABLE_COLUMNS } from '~/modules/table'
import { FALLBACK_IMAGE, SITE_SETTING } from '~/modules/constant'
import { S3_URL } from '~/modules/http'
import UpsertHomeCategoryModal from '~/components/modal/UpsertHomeCategoryModal'

export default function HomeProductCategory() {
  const siteSettingStore = useSiteSettingStore()
  const uploadStore = useUploadStore()
  const [isShowModal, setIsShowModal] = useState(false)
  const [selectProductCategory, setSelectProductCategory] = useState(null)

  const productCategories = useMemo(() => {
    if (!siteSettingStore.allSetting || !siteSettingStore.allSetting.homeProductCategories) return []
    return siteSettingStore.allSetting.homeProductCategories.map((item) => {
      const productCategory = JSON.parse(item.value)
      return {
        ...item,
        ...productCategory,
        categoryId: productCategory.category.id
      }
    })
  }, [siteSettingStore.allSetting])

  const openModal = (productCategory) => {
    setSelectProductCategory(productCategory || null)
    setIsShowModal(true)
  }

  const closeModal = () => {
    setSelectProductCategory(null)
    setIsShowModal(false)
  }

  const deleteProductCategory = async (id, path) => {
    await uploadStore.delete({ path }, false)
    await siteSettingStore.deleteSetting(id)
  }

  const columns = SITE_HOME_PRODUCT_CATEGORY_TABLE_COLUMNS.map((col) => {
    if (col.key === 'no') return { ...col, render: (_, __, index) => index + 1 }
    if (col.key === 'category') {
      return {
        ...col,
        render: (_, record) => (
          <div className="flex items-center">
            <Image width={100} src={S3_URL + record.image} fallback={FALLBACK_IMAGE} preview={false} />
            <span className="ml-2">{record.category?.name}</span>
          </div>
        )
      }
    }
    if (col.key === 'action') {
      return {
        ...col,
        render: (_, record) => (
          <div>
            <Button type="link" onClick={() => openModal(record)}>Chỉnh sửa</Button>
            <Popconfirm
              title="Bạn có chắc muốn xoá danh mục sản phẩm này không?"
              okText="Có"
              cancelText="Không"
              onConfirm={() => deleteProductCategory(record.id, record.image)}
            >
              <Button type="text" danger className="ml-4">Xoá</Button>
            </Popconfirm>
          </div>
        )
      }
    }
    return col
  })

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold mb-0">3. Danh mục sản phẩm kinh doanh</h4>
        <Button type="link" icon={<PlusCircleOutlined />} onClick={() => setIsShowModal(true)}>
          <span>Thêm</span>
        </Button>
      </div>

      <Table columns={columns} dataSource={productCategories} rowKey="id" pagination={false} />

      {isShowModal && (
        <UpsertHomeCategoryModal productCategory={selectProductCategory} onClose={closeModal} />
      )}
    </div>
  )
}
