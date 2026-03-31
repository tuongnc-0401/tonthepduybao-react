import { useState, useEffect, useMemo } from 'react'
import { Table, Button, Input, Modal } from 'antd'
import { cloneDeep } from 'lodash'
import { Icon } from '@iconify/react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMessage, useMoment } from '~/composables'
import { NOT_FOUND_PATH, TYPE, MSG, TYPE_KEY } from '~/modules/constant'
import { MENU } from '~/modules/menu'
import { DEBT_FULL_TABLE_COLUMNS, DEBT_SCREW_TABLE_COLUMNS } from '~/modules/table'
import { downloadFromResponse, formatCurrency, normalize } from '~/modules/utils'
import { useCommonStore } from '~/stores/common'
import { useDebtStore } from '~/stores/debt'
import Heading from '~/components/common/Heading'

export default function DebtDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const mc = useMessage()
  const moment = useMoment()
  const debtStore = useDebtStore()
  const commonStore = useCommonStore()

  const [search, setSearch] = useState('')
  const [isShowConfirm, setIsShowConfirm] = useState(false)

  const debt = debtStore.debt

  useEffect(() => {
    if (!id) { navigate(NOT_FOUND_PATH); return }

    const load = async () => {
      try {
        await debtStore.get(id)
        const d = debtStore.debt
        commonStore.setBreadcrumbs([
          MENU.DEBT,
          { name: d.id, path: MENU.DEBT_DETAIL.path + d.id }
        ])
      } catch {
        navigate(MENU.DEBT.path)
      }
    }

    load()
    return () => commonStore.setBreadcrumbs([])
  }, [id])

  const debtDetails = useMemo(() => {
    if (!debt) return []
    const searchParam = normalize(search.toLowerCase())
    return debt.debtDetails.filter((item) =>
      normalize(item.name.toLowerCase()).includes(searchParam)
    )
  }, [debt, search])

  const columns = useMemo(() => {
    if (!debt) return []
    let cols = debt.type === TYPE_KEY.SCREW
      ? cloneDeep(DEBT_SCREW_TABLE_COLUMNS)
      : cloneDeep(DEBT_FULL_TABLE_COLUMNS)
    cols = cols.filter((item) => item.key !== 'properties' && item.key !== 'action')
    return cols.map((col) => {
      if (col.key === 'no') {
        return { ...col, render: (_, __, index) => index + 1 }
      }
      if (col.key === 'name') {
        return {
          ...col,
          render: (_, record) => (
            <span className="font-medium">
              {record.name + ' ' + record.propertyDetails.map((item) => item.name).join(' ')}
            </span>
          )
        }
      }
      if (col.key === 'branch') {
        return { ...col, render: (_, record) => record.branch.name }
      }
      if (col.key === 'unitPrice') {
        return { ...col, render: (_, record) => formatCurrency(record.unitPrice) }
      }
      if (col.key === 'totalUnitPrice') {
        return {
          ...col,
          render: (_, record) => (
            <span className="font-medium text-red-400">{formatCurrency(record.totalUnitPrice)}</span>
          )
        }
      }
      if (col.key === 'totalPrice') {
        return {
          ...col,
          render: (_, record) => (
            <span className="font-medium text-red-400">{formatCurrency(record.totalPrice)}</span>
          )
        }
      }
      return col
    })
  }, [debt])

  const downloadDebt = async () => {
    try {
      const { headers, data } = await debtStore.download({ ids: debt.id })
      downloadFromResponse(headers, data)
      mc.success(MSG.DOWNLOAD_SUCCESS)
    } catch {
      mc.error(MSG.DOWNLOAD_FAILED)
    }
  }

  const deleteDebt = async () => {
    try {
      await debtStore.delete(debt.id)
      setIsShowConfirm(false)
      mc.success(MSG.DELETE_SUCCESS)
      navigate(MENU.DEBT.path)
    } catch {
      mc.error(MSG.DELETE_FAILED)
    }
  }

  if (!debt) return null

  return (
    <section>
      <Heading title={`Mã công nợ: [${debt.id}]`}>
        <div className="flex items-center">
          <Button type="primary" danger className="flex items-center px-8" onClick={() => setIsShowConfirm(true)}>
            <Icon icon="mdi:trash-can" />
            <span className="ml-2">Xoá</span>
          </Button>
          <Button type="primary" className="flex items-center px-8 ml-4" onClick={() => navigate(MENU.EDIT_DEBT.path + debt.id)}>
            <Icon icon="mdi:pencil-box-outline" />
            <span className="ml-2">Sửa</span>
          </Button>
          <Button type="primary" className="flex items-center ml-4" onClick={downloadDebt}>
            <Icon icon="mdi:file-excel" />
            <span className="ml-2">Tải xuống</span>
          </Button>
        </div>
      </Heading>

      <div className="grid grid-cols-12 gap-x-8 mt-8">
        <div className="grid grid-cols-2 gap-8 col-span-8 border border-solid border-gray-200 rounded-md p-4">
          <div>
            <div className="flex items-center mb-2">
              <Icon icon="mdi:calendar" className="mr-2" />
              <span className="mr-2">Ngày tạo:</span>
              <span className="font-semibold">{moment.dFormat(debt.date)}</span>
            </div>
            <div className="flex items-center mb-2">
              <Icon icon="mdi:format-list-bulleted-type" className="mr-2" />
              <span className="mr-2">Phân loại:</span>
              <span className="font-semibold">{TYPE[debt.type]?.label}</span>
            </div>
            <div className="flex items-center">
              <Icon icon="mdi:account" className="mr-2" />
              <span className="mr-2">Nhà cung cấp:</span>
              <span className="font-semibold">{debt.customer.name}</span>
            </div>
          </div>
          <div className="font-medium">
            <div className="flex mb-2">
              <div className="flex">
                <Icon icon="mdi:calendar" className="mr-2 mt-2" />
                <span className="mr-2">Chỉnh sửa gần đây:</span>
              </div>
              <div className="font-semibold italic">
                {moment.mFormat(debt.updatedAt)} <br /> bởi {debt.updatedBy}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end col-span-4">
          <table className="summary-table w-full h-full">
            <tbody>
              <tr>
                <td className="font-medium">Tổng nhập</td>
                <td>{formatCurrency(debt.totalPrice)}</td>
              </tr>
              {debt.type !== TYPE_KEY.SCREW && (
                <tr>
                  <td className="font-medium">Tổng nhập cây/mét</td>
                  <td>{formatCurrency(debt.totalUnitPrice)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between mt-8 mb-4">
        <div>
          <b>Danh sách sản phẩm:</b>
          <span className="font-normal ml-2">{debtDetails.length} sản phẩm</span>
        </div>
        <Input.Search
          value={search}
          placeholder="Tìm kiếm ..."
          className="mr-4 w-[400px]"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Table
        columns={columns}
        dataSource={debtDetails}
        rowKey="id"
        scroll={{ x: 'max-content' }}
        pagination={false}
        className={`debt-detail__table debt-detail__table--${debt.type.toLowerCase()}`}
      />

      <Modal
        open={isShowConfirm}
        okText="Có"
        cancelText="Không"
        centered
        okButtonProps={{ type: 'primary', danger: true, className: 'px-10' }}
        title={
          <div className="flex items-center">
            <Icon icon="ph:warning-fill" className="text-red-500 mr-4" width="20px" />
            <span>Bạn có chắc muốn xoá công nợ này không?</span>
          </div>
        }
        onOk={deleteDebt}
        onCancel={() => setIsShowConfirm(false)}
      >
        <p className="m-2">Lưu ý, khi xoá công nợ, các dữ liệu liên quan sau đây cũng sẽ bị xoá theo:</p>
        <ul className="mb-0">
          <li>Danh sách sản phẩm nhập vào</li>
          <li>Danh sách sản phẩm xuất đi</li>
        </ul>
      </Modal>
    </section>
  )
}
