import { useState, useEffect } from 'react'
import { Table, Button, Tag } from 'antd'
import { useMessage } from '~/composables'
import { BRANCH_STATUS, MSG } from '~/modules/constant'
import { BRANCH_TABLE_COLUMNS } from '~/modules/table'
import { useBranchStore } from '~/stores/branch'
import Heading from '~/components/common/Heading'
import EditBranchModal from '~/components/modal/EditBranchModal'

export default function Branch() {
  const mc = useMessage()
  const branchStore = useBranchStore()
  const [selectedBranch, setSelectedBranch] = useState(null)

  useEffect(() => {
    branchStore.getAll()
  }, [])

  const updateBranchStatus = async (branch) => {
    try {
      if (!branch) return
      const updatedBranch = {
        ...branch,
        status:
          branch.status === BRANCH_STATUS.ACTIVE ? BRANCH_STATUS.INACTIVE : BRANCH_STATUS.ACTIVE
      }
      await branchStore.upsert(updatedBranch)
      mc.success(MSG.UPDATE_SUCCESS)
      await branchStore.getAll()
    } catch {
      mc.error(MSG.UPDATE_FAILED)
    }
  }

  const columns = BRANCH_TABLE_COLUMNS.map((col) => {
    if (col.key === 'name') {
      return {
        ...col,
        render: (_, record) => (
          <div>
            <h3 className="mb-1">{record.name}</h3>
            <a href={record.mapUrl} target="_blank" rel="noopener noreferrer">
              {record.address}
            </a>
          </div>
        )
      }
    }
    if (col.key === 'phone' || col.key === 'zalo') {
      return {
        ...col,
        render: (_, record) => (
          <a href={`tel:${record.phone}`} target="_blank" rel="noopener noreferrer">
            {record.phone}
          </a>
        )
      }
    }
    if (col.key === 'status') {
      return {
        ...col,
        render: (_, record) => (
          <Tag color={record.status === BRANCH_STATUS.ACTIVE ? 'green' : 'error'}>
            {record.status === BRANCH_STATUS.ACTIVE ? 'Đang hoạt động' : 'Ngưng hoạt động'}
          </Tag>
        )
      }
    }
    if (col.key === 'action') {
      return {
        ...col,
        render: (_, record) => (
          <div>
            {!record.resolvedFlag && (
              <Button type="link" onClick={() => setSelectedBranch(record)}>
                Sửa
              </Button>
            )}
            <Button
              type={record.status === BRANCH_STATUS.ACTIVE ? 'text' : 'link'}
              danger={record.status === BRANCH_STATUS.ACTIVE}
              className="ml-4"
              onClick={() => updateBranchStatus(record)}
            >
              {record.status === 'ACTIVE' ? 'Tạm ngưng' : 'Kích hoạt'}
            </Button>
          </div>
        )
      }
    }
    return col
  })

  return (
    <section>
      <Heading title="Danh sách chi nhánh" />
      <Table columns={columns} dataSource={branchStore.allBranch} rowKey="id" pagination={false} />
      <EditBranchModal
        branch={selectedBranch}
        onClose={() => {
          setSelectedBranch(null)
          branchStore.getAll()
        }}
      />
    </section>
  )
}
