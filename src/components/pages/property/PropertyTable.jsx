import { Table, Button, Popconfirm } from 'antd'
import { Icon } from '@iconify/react'
import { useMoment } from '~/composables'
import { TYPE } from '~/modules/constant'
import { PROPERTY_TABLE_COLUMNS } from '~/modules/table'

export default function PropertyTable({ data = [], onSort, onEdit, onDelete }) {
  const moment = useMoment()

  const columns = PROPERTY_TABLE_COLUMNS.map((col) => {
    if (['orderBy', 'updatedAt'].includes(col.key)) {
      return {
        ...col,
        title: (
          <div className="flex items-center">
            <Icon
              icon="fa6-solid:sort"
              className="mr-4 cursor-pointer"
              onClick={() => onSort && onSort(col.key)}
            />
            {col.title}
          </div>
        ),
        render: col.key === 'updatedAt'
          ? (_, record) => (
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
          : undefined
      }
    }
    if (col.key === 'type') {
      return {
        ...col,
        render: (_, record) => TYPE[record.type]?.label
      }
    }
    if (col.key === 'properties') {
      return {
        ...col,
        render: (_, record) => `${record.items?.length || 0} thuộc tính`
      }
    }
    if (col.key === 'action') {
      return {
        ...col,
        render: (_, record) => (
          <div>
            <Button type="link" onClick={() => onEdit && onEdit(record.id)}>
              Sửa
            </Button>
            {!record.used && (
              <Popconfirm
                title="Bạn có chắn chắc muốn xoá thuộc tính này không?"
                okText="Có"
                cancelText="Không"
                onConfirm={() => onDelete && onDelete(record.id)}
              >
                <Button type="link" danger>
                  Xoá
                </Button>
              </Popconfirm>
            )}
          </div>
        )
      }
    }
    return col
  })

  return <Table columns={columns} dataSource={data} rowKey="id" pagination={false} />
}
