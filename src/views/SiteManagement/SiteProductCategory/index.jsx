import { useState, useEffect } from 'react'
import { Table, Button, Input } from 'antd'
import { Icon } from '@iconify/react'
import { useSiteCategoryStore } from '~/stores/siteManagement/siteCategory'
import { SITE_CATEGORY_TABLE_COLUMNS } from '~/modules/table'
import Heading from '~/components/common/Heading'
import UpsertSiteCategoryModal from '~/components/modal/UpsertSiteCategoryModal'

export default function SiteProductCategory() {
  const siteCategoryStore = useSiteCategoryStore()
  const [search, setSearch] = useState('')
  const [isShowModal, setIsShowModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    siteCategoryStore.searchCategory('')
  }, [])

  const openModal = (category) => {
    setSelectedCategory(category || null)
    setIsShowModal(true)
  }

  const closeModal = () => {
    setSelectedCategory(null)
    setIsShowModal(false)
    siteCategoryStore.searchCategory('')
  }

  const deleteCategory = async (id) => {
    await siteCategoryStore.deleteCategory(id)
    await siteCategoryStore.searchCategory('')
  }

  const columns = SITE_CATEGORY_TABLE_COLUMNS.map((col) => {
    if (col.key === 'no') return { ...col, render: (_, __, index) => index + 1 }
    if (col.key === 'action') {
      return {
        ...col,
        render: (_, record) => (
          <div>
            <Button type="link" onClick={() => openModal(record)}>Chỉnh sửa</Button>
            {record.totalProduct === 0 && (
              <Button type="text" danger className="ml-4" onClick={() => deleteCategory(record.id)}>Xoá</Button>
            )}
          </div>
        )
      }
    }
    return col
  })

  return (
    <section>
      <Heading title="Danh mục sản phẩm">
        <div className="flex items-center">
          <Input
            placeholder="Tìm kiếm liên hệ"
            className="mr-4 w-[400px]"
            value={search}
            prefix={<Icon icon="ic:outline-search" onClick={() => siteCategoryStore.searchCategory(search)} />}
            onChange={(e) => setSearch(e.target.value)}
            onPressEnter={() => siteCategoryStore.searchCategory(search)}
          />
          <Button type="primary" onClick={() => openModal()}>Thêm Danh Mục</Button>
        </div>
      </Heading>

      <Table columns={columns} dataSource={siteCategoryStore.allCategoryTableData} rowKey="id" />

      {isShowModal && (
        <UpsertSiteCategoryModal category={selectedCategory} onClose={closeModal} />
      )}
    </section>
  )
}
