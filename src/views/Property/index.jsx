import { useState, useEffect } from 'react'
import { Tabs, Button, Input } from 'antd'
import { Icon } from '@iconify/react'
import { useMessage } from '~/composables'
import { MSG, TYPE, TYPE_KEY } from '~/modules/constant'
import { usePropertyStore } from '~/stores/property'
import PropertyTable from '~/components/pages/property/PropertyTable'
import UpsertPropertyModal from '~/components/pages/property/UpsertPropertyModal'
import Heading from '~/components/common/Heading'

export default function Property() {
  const mc = useMessage()
  const propertyStore = usePropertyStore()

  const [isShowModal, setIsShowModal] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('')
  const [type, setType] = useState(TYPE_KEY.IRON)

  const init = async (sortField = '') => {
    setSort(sortField)
    await propertyStore.getAll({ search, sort: sortField, type })
  }

  useEffect(() => {
    init()
  }, [type])

  useEffect(() => {
    init()
  }, [])

  const openModal = (id = null) => {
    if (id) {
      setSelectedProperty(propertyStore.allProperty.find((item) => item.id == id) || null)
    } else {
      setSelectedProperty(null)
    }
    setIsShowModal(true)
  }

  const closeModal = () => {
    setIsShowModal(false)
    setSelectedProperty(null)
  }

  const deleteProperty = async (id) => {
    try {
      await propertyStore.delete(id)
      await init(sort)
      mc.success(MSG.DELETE_SUCCESS)
    } catch {
      mc.error(MSG.DELETE_FAILED)
    }
  }

  const tooltipContent = (
    <div className="pt-2 pl-2">
      <p className="mb-2 text-[12px] font-medium">Lưu ý, chức năng xoá sẽ bị ẩn trong các TH sau:</p>
      <ul className="pl-2 ml-8 text-base">
        <li>Thuộc tính đang được sử dụng trong công nợ</li>
        <li>Giá trị của thuộc tính đang được sử dụng trong công nợ/sản phẩm</li>
      </ul>
    </div>
  )

  const tabItems = Object.values(TYPE).map((item) => ({
    key: item.value,
    label: item.label,
    children: (
      <PropertyTable
        data={propertyStore.allProperty}
        onSort={(sortField) => init(sortField)}
        onEdit={(id) => openModal(id)}
        onDelete={deleteProperty}
      />
    )
  }))

  return (
    <section>
      <Heading title="Danh sách thuộc tính" tooltip tooltipContent={tooltipContent} className="mb-8">
        <div className="flex items-center">
          <Input.Search
            placeholder="Tìm kiếm thuộc tính..."
            className="w-[320px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onPressEnter={() => init(sort)}
          />
          <Button
            type="primary"
            className="flex items-center ml-4"
            onClick={() => openModal()}
          >
            <Icon icon="mdi:plus-circle" className="mr-1" />
            <span>Thêm</span>
          </Button>
        </div>
      </Heading>

      <Tabs
        activeKey={type}
        items={tabItems}
        onChange={(key) => setType(key)}
      />

      {isShowModal && (
        <UpsertPropertyModal
          property={selectedProperty}
          onCallback={() => init()}
          onClose={closeModal}
        />
      )}
    </section>
  )
}
