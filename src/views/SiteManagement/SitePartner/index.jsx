import { useState, useEffect } from 'react'
import { Table, Button, Input, Image, Popconfirm } from 'antd'
import { Icon } from '@iconify/react'
import { useSitePartnerStore } from '~/stores/siteManagement/sitePartner'
import { SITE_PARTNER_TABLE_COLUMNS } from '~/modules/table'
import { FALLBACK_IMAGE } from '~/modules/constant'
import { S3_URL } from '~/modules/http'
import Heading from '~/components/common/Heading'
import UpsertSitePartnerModal from '~/components/modal/UpsertSitePartnerModal'

export default function SitePartner() {
  const sitePartnerStore = useSitePartnerStore()
  const [search, setSearch] = useState('')
  const [isShowModal, setIsShowModal] = useState(false)
  const [selectedPartner, setSelectedPartner] = useState(null)

  useEffect(() => {
    sitePartnerStore.searchPartner('')
  }, [])

  const openModal = (partner) => {
    setSelectedPartner(partner || null)
    setIsShowModal(true)
  }

  const closeModal = () => {
    setSelectedPartner(null)
    setIsShowModal(false)
    sitePartnerStore.searchPartner(search)
  }

  const deletePartner = async (id) => {
    await sitePartnerStore.deletePartner(id)
    await sitePartnerStore.searchPartner(search)
  }

  const columns = SITE_PARTNER_TABLE_COLUMNS.map((col) => {
    if (col.key === 'no') return { ...col, render: (_, __, index) => index + 1 }
    if (col.key === 'name') {
      return {
        ...col,
        render: (_, record) => (
          <div className="flex items-center">
            <Image width={48} src={S3_URL + record.logo} fallback={FALLBACK_IMAGE} preview={false} />
            <span className="ml-2">{record.name}</span>
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
            <Popconfirm title="Bạn có chắc muốn xoá đối tác này không?" okText="Có" cancelText="Không" onConfirm={() => deletePartner(record.id)}>
              <Button type="text" danger className="ml-4">Xoá</Button>
            </Popconfirm>
          </div>
        )
      }
    }
    return col
  })

  return (
    <section>
      <Heading title="Danh sách đối tác">
        <div className="flex items-center">
          <Input
            placeholder="Tìm kiếm đối tác"
            className="mr-4 w-[400px]"
            value={search}
            prefix={<Icon icon="ic:outline-search" onClick={() => sitePartnerStore.searchPartner(search)} />}
            onChange={(e) => setSearch(e.target.value)}
            onPressEnter={() => sitePartnerStore.searchPartner(search)}
          />
          <Button type="primary" onClick={() => openModal()}>Thêm đối tác</Button>
        </div>
      </Heading>

      <Table columns={columns} dataSource={sitePartnerStore.allPartner} rowKey="id" />

      {isShowModal && (
        <UpsertSitePartnerModal partner={selectedPartner} onClose={closeModal} />
      )}
    </section>
  )
}
