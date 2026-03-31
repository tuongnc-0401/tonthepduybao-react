import { useState, useEffect } from 'react'
import { Table, Button, Tag, Input } from 'antd'
import { Icon } from '@iconify/react'
import { useSiteContactStore } from '~/stores/siteManagement/siteContact'
import { SITE_CONTACT_TABLE_COLUMNS } from '~/modules/table'
import Heading from '~/components/common/Heading'

export default function SiteContact() {
  const siteContactStore = useSiteContactStore()
  const [search, setSearch] = useState('')

  useEffect(() => {
    siteContactStore.searchContact('')
  }, [])

  const resolveContact = async (id) => {
    await siteContactStore.resolveContact(id)
    await siteContactStore.searchContact(search)
  }

  const deleteContact = async (id) => {
    await siteContactStore.deleteContact(id)
    await siteContactStore.searchContact(search)
  }

  const columns = SITE_CONTACT_TABLE_COLUMNS.map((col) => {
    if (col.key === 'no') return { ...col, render: (_, __, index) => index + 1 }
    if (col.key === 'email') {
      return {
        ...col,
        render: (_, record) => (
          <a href={`mailto:${record.email}`} target="_blank" rel="noopener noreferrer">
            {record.email}
          </a>
        )
      }
    }
    if (col.key === 'resolvedFlag') {
      return {
        ...col,
        render: (_, record) => (
          <Tag color={record.resolvedFlag ? 'green' : 'blue'}>
            {record.resolvedFlag ? 'Đã xử lý' : 'Liên hệ mới'}
          </Tag>
        )
      }
    }
    if (col.key === 'action') {
      return {
        ...col,
        render: (_, record) => (
          <div>
            <a href={`mailto:${record.email}`} target="_blank" rel="noopener noreferrer">Tư vấn</a>
            {!record.resolvedFlag && (
              <Button type="link" className="ml-4" onClick={() => resolveContact(record.id)}>Đã xử lý</Button>
            )}
            <Button type="text" danger className="ml-4" onClick={() => deleteContact(record.id)}>Xoá</Button>
          </div>
        )
      }
    }
    return col
  })

  return (
    <section>
      <Heading title="Danh sách liên hệ">
        <Input
          placeholder="Tìm kiếm liên hệ"
          className="mb-2 w-[400px]"
          value={search}
          prefix={<Icon icon="ic:outline-search" onClick={() => siteContactStore.searchContact(search)} />}
          onChange={(e) => setSearch(e.target.value)}
          onPressEnter={() => siteContactStore.searchContact(search)}
        />
      </Heading>
      <Table columns={columns} dataSource={siteContactStore.allContact} rowKey="id" />
    </section>
  )
}
