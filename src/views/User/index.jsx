import { useState, useEffect } from 'react'
import { Table, Button, Popconfirm, Tag, Popover, Checkbox } from 'antd'
import { Icon } from '@iconify/react'
import { useMessage, useMoment } from '~/composables'
import { MSG, USER_STATUS } from '~/modules/constant'
import { USER_TABLE_COLUMNS } from '~/modules/table'
import { useUserStore } from '~/stores/user'
import Heading from '~/components/common/Heading'
import CreateUserModal from '~/components/modal/CreateUserModal'
import ImageViewer from '~/components/ImageViewer'

export default function User() {
  const mc = useMessage()
  const moment = useMoment()
  const userStore = useUserStore()

  const statusOptions = [
    { label: 'Đã kích hoạt', value: USER_STATUS.ACTIVE },
    { label: 'Đã bị khoá', value: USER_STATUS.BLOCKED }
  ]

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState([])
  const [role, setRole] = useState([])
  const [isShowCreateUserModal, setIsShowCreateUserModal] = useState(false)

  const init = async () => {
    await userStore.getAll({
      search,
      status: status.join(','),
      role: role.join(',')
    })
  }

  useEffect(() => {
    init()
    userStore.getAllRole()
  }, [])

  useEffect(() => {
    init()
  }, [status, role])

  const createUser = async (payload) => {
    try {
      await userStore.create(payload)
      await init()
      setIsShowCreateUserModal(false)
      mc.success(MSG.SAVE_SUCCESS)
    } catch {
      mc.error(MSG.SAVE_FAILED)
    }
  }

  const deleteUser = async (id) => {
    try {
      await userStore.del(id)
      await init()
      mc.success(MSG.DELETE_SUCCESS)
    } catch {
      mc.error(MSG.DELETE_FAILED)
    }
  }

  const columns = USER_TABLE_COLUMNS.map((col) => {
    if (col.key === 'role') {
      return {
        ...col,
        title: (
          <div className="flex items-center">
            <Popover
              trigger="click"
              placement="bottom"
              content={
                <Checkbox.Group
                  options={userStore.roleOptions}
                  value={role}
                  className="flex flex-col"
                  onChange={setRole}
                />
              }
            >
              <Icon icon="mdi:filter" className="cursor-pointer outline-none" width="14px" />
            </Popover>
            <span className="ml-4">{col.title}</span>
          </div>
        ),
        render: (_, record) => <span>{record.role?.name}</span>
      }
    }
    if (col.key === 'status') {
      return {
        ...col,
        title: (
          <div className="flex items-center">
            <Popover
              trigger="click"
              placement="bottom"
              content={
                <Checkbox.Group
                  options={statusOptions}
                  value={status}
                  className="flex flex-col"
                  onChange={setStatus}
                />
              }
            >
              <Icon icon="mdi:filter" className="cursor-pointer outline-none" width="14px" />
            </Popover>
            <span className="ml-4">{col.title}</span>
          </div>
        ),
        render: (_, record) => (
          <>
            {record.status === USER_STATUS.ACTIVE && <Tag color="success">Đã kích hoạt</Tag>}
            {record.status === USER_STATUS.BLOCKED && <Tag color="error">Đã bị khoá</Tag>}
          </>
        )
      }
    }
    if (col.key === 'no') {
      return { ...col, render: (_, __, index) => index + 1 }
    }
    if (col.key === 'fullName') {
      return {
        ...col,
        render: (_, record) => (
          <div className="flex items-center">
            <ImageViewer scope="avatar" avatarSize={32} src={record.avatar} />
            <span className="ml-2 font-medium">{record.fullName}</span>
          </div>
        )
      }
    }
    if (col.key === 'branch') {
      return {
        ...col,
        render: (_, record) => record.branch ? record.branch.name : 'Tất cả chi nhánh'
      }
    }
    if (col.key === 'createdBy') {
      return {
        ...col,
        render: (_, record) => (
          <div>
            {record.createdBy && (
              <div className="mb-1 flex items-center">
                <Icon icon="mdi:account" />
                <span className="ml-2">{record.createdBy}</span>
              </div>
            )}
            <div className="mb-0 text-base text-gray-600 italic flex items-center">
              <Icon icon="mdi:clock-time-four" width="13px" />
              <span className="ml-2">{moment.mFormat(record.createdAt)}</span>
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
            <Button type="link" onClick={() => openModal(record)}>
              Cập nhật
            </Button>
            <Popconfirm
              title="Bạn có chắc muốn xoá khách hàng này không?"
              okText="Có"
              cancelText="Không"
              onConfirm={() => deleteUser(record.id)}
            >
              <Button type="text" danger className="ml-4">
                Xoá
              </Button>
            </Popconfirm>
          </div>
        )
      }
    }
    return col
  })

  return (
    <section>
      <Heading title="Danh sách nhân viên">
        <div className="flex items-center">
          <input
            className="mr-4 w-[400px] border border-gray-300 rounded px-3 py-1"
            placeholder="Tìm kiếm ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && init()}
          />
          <Button
            type="primary"
            className="flex items-center"
            onClick={() => setIsShowCreateUserModal(true)}
          >
            <Icon icon="mdi:plus-circle" width="16px" />
            <span className="ml-2">Tạo tài khoản</span>
          </Button>
        </div>
      </Heading>

      <Table
        columns={columns}
        dataSource={userStore.allUser}
        rowKey="id"
        className="mt-8"
        pagination={false}
      />

      {isShowCreateUserModal && (
        <CreateUserModal
          onOk={createUser}
          onClose={() => setIsShowCreateUserModal(false)}
        />
      )}
    </section>
  )
}
