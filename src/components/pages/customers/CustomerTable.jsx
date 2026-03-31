import { Table, Button, Popconfirm, Tag } from 'antd'
import { Icon } from '@iconify/react'
import { CUSTOMER_TABLE_COLUMNS } from '~/modules/table'
import { CUSTOMER_TYPE } from '~/modules/constant'

export default function CustomerTable({
  data = [],
  total = 0,
  pageSize = 15,
  isDelete = false,
  isUndelete = false,
  onInit,
  onEdit,
  onDelete,
  onUndelete
}) {
  const columns = CUSTOMER_TABLE_COLUMNS.map((col) => {
    if (col.key === 'contact') {
      return {
        ...col,
        render: (_, record) => (
          <div>
            {record.email && (
              <div className="flex items-center mb-2">
                <Icon icon="mdi:email" width="16px" />
                <a href={`mailto:${record.email}`} target="_blank" className="ml-2" rel="noreferrer">
                  {record.email}
                </a>
              </div>
            )}
            {record.phone && record.phone.length !== 0 && (
              <div className="flex items-center">
                <Icon icon="mdi:phone" width="16px" />
                <div className="flex ml-2">
                  {record.phone.map((item, phoneIndex) => (
                    <a
                      key={phoneIndex}
                      href={`tel:${item}`}
                      className="underline mr-2"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>{item}</span>
                      {phoneIndex !== record.phone.length - 1 && <span>,</span>}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      }
    }
    if (col.key === 'type') {
      return {
        ...col,
        render: (_, record) => CUSTOMER_TYPE[record.type]?.label
      }
    }
    if (col.key === 'action') {
      return {
        ...col,
        render: (_, record) => (
          <div>
            <Button type="link" onClick={() => onEdit && onEdit(record)}>
              Sửa
            </Button>
            {isDelete && (
              <Popconfirm
                title="Bạn có chắc muốn xoá khách hàng này không?"
                okText="Có"
                cancelText="Không"
                onConfirm={() => onDelete && onDelete(record.id)}
              >
                <Button type="text" danger className="ml-4">
                  Xoá
                </Button>
              </Popconfirm>
            )}
            {isUndelete && (
              <Popconfirm
                title="Bạn có chắc muốn gỡ bỏ việc xoá khách hàng này không?"
                okText="Có"
                cancelText="Không"
                onConfirm={() => onUndelete && onUndelete(record.id)}
              >
                <Button type="text" danger className="ml-4">
                  Gỡ xoá
                </Button>
              </Popconfirm>
            )}
          </div>
        )
      }
    }
    return col
  })

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      pagination={{
        showSizeChanger: false,
        total,
        pageSize,
        onChange: (page) => onInit && onInit(page)
      }}
    />
  )
}
