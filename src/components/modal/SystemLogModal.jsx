import { useState } from 'react'
import { Modal, Select } from 'antd'
import { SYSTEM_LOG_TYPE } from '~/modules/constant'

export default function SystemLogModal({ onOk, onClose }) {
  const [type, setType] = useState(SYSTEM_LOG_TYPE.LOG)
  const [day, setDay] = useState(7)

  const typeOptions = [
    { label: '.log', value: SYSTEM_LOG_TYPE.LOG },
    { label: '.txt', value: SYSTEM_LOG_TYPE.TXT },
    { label: '.csv', value: SYSTEM_LOG_TYPE.CSV }
  ]
  const dayOptions = [
    { label: '7 ngày', value: 7 },
    { label: '30 ngày', value: 30 },
    { label: '60 ngày', value: 60 },
    { label: '90 ngày', value: 90 }
  ]

  return (
    <Modal
      open
      centered
      width="auto"
      title="Tải log hệ thống"
      okText="Tải xuống"
      cancelText="Đóng"
      onOk={() => onOk({ day, type })}
      onCancel={onClose}
    >
      <div className="grid grid-cols-2 gap-x-8">
        <div className="flex flex-col min-w-[160px]">
          <label>Số ngày xem log</label>
          <Select value={day} options={dayOptions} onChange={setDay} />
        </div>
        <div className="flex flex-col min-w-[160px]">
          <label>Chọn kiểu</label>
          <Select value={type} options={typeOptions} onChange={setType} />
        </div>
      </div>
    </Modal>
  )
}
