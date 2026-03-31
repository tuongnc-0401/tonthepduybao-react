import { useState, useEffect, useMemo } from 'react'
import { Table, Button, Popover, Checkbox, DatePicker } from 'antd'
import { cloneDeep } from 'lodash'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'
import { useMessage, useMoment } from '~/composables'
import { CUSTOMER_TYPE_KEY, PAGING, TYPE } from '~/modules/constant'
import { MENU } from '~/modules/menu'
import { LIST_DEBT_TABLE_COLUMNS } from '~/modules/table'
import { downloadFromResponse, formatCurrency } from '~/modules/utils'
import { useCustomerStore } from '~/stores/customer'
import { useDebtStore } from '~/stores/debt'
import Heading from '~/components/common/Heading'
import SelectWayToAddDebt from '~/components/modal/SelectWayToAddDebt'

export default function ListDebt() {
  const navigate = useNavigate()
  const mc = useMessage()
  const moment = useMoment()
  const debtStore = useDebtStore()
  const customerStore = useCustomerStore()

  const initialFilter = { search: '', date: [], customerId: [], type: [], customerSearch: '' }
  const [filter, setFilter] = useState(cloneDeep(initialFilter))
  const [currentPage, setCurrentPage] = useState(PAGING.DEFAULT_PAGE)
  const [selectedKeys, setSelectedKeys] = useState([])
  const [isShowModal, setIsShowModal] = useState(false)

  const debts = debtStore.allDebt?.data || []

  const selectedCustomer = useMemo(
    () =>
      (customerStore.allCustomer?.data || [])
        .filter((item) => filter.customerId.includes(item.id))
        .map((item) => item.name)
        .join(', '),
    [customerStore.allCustomer, filter.customerId]
  )

  const selectedType = useMemo(
    () =>
      Object.values(TYPE)
        .filter((item) => filter.type.includes(item.value))
        .map((item) => item.label)
        .join(', '),
    [filter.type]
  )

  const isFiltering = useMemo(() => {
    const { search, date, customerId, type } = filter
    return search || (date && date.length === 2) || customerId.length !== 0 || type.length !== 0
  }, [filter])

  const init = async (page = PAGING.DEFAULT_PAGE, pageSize = PAGING.DEFAULT_PAGE_SIZE) => {
    setCurrentPage(page)
    const { search, date, customerId, type } = filter
    await debtStore.getAll({
      search,
      fromDate: date && date.length === 2 ? date[0] : '',
      toDate: date && date.length === 2 ? date[1] : '',
      customerId: customerId.join(','),
      type: type.join(','),
      page,
      pageSize
    })
  }

  useEffect(() => {
    init(currentPage)
    customerStore.getAll({ page: 1, pageSize: 1000, type: CUSTOMER_TYPE_KEY.SUPPLIER, search: '' })
  }, [])

  const downloadDebt = async (ids) => {
    try {
      const { headers, data } = await debtStore.download({ ids: ids.join(',') })
      downloadFromResponse(headers, data)
      mc.success('Tải xuống thành công')
    } catch {
      mc.error('Tải xuống thất bại')
    }
  }

  const reset = () => {
    setFilter(cloneDeep(initialFilter))
    init()
  }

  const columns = LIST_DEBT_TABLE_COLUMNS.map((col) => {
    if (col.key === 'customer') {
      return {
        ...col,
        title: (
          <div className="flex items-center">
            <Popover
              trigger="click"
              placement="bottom"
              content={
                <div className="max-h-[320px] overflow-y-auto custom-scroll p-4">
                  <input
                    className="w-full mb-4 border border-gray-300 rounded px-3 py-1"
                    placeholder="Tìm kiếm nhà cung cấp ..."
                    value={filter.customerSearch}
                    onChange={(e) => setFilter((f) => ({ ...f, customerSearch: e.target.value }))}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter')
                        customerStore.getAll({ page: 1, pageSize: 1000, search: filter.customerSearch })
                    }}
                  />
                  {(customerStore.allCustomer?.data || []).length !== 0 ? (
                    <Checkbox.Group
                      options={(customerStore.allCustomer?.data || []).map((item) => ({ label: item.name, value: item.id }))}
                      value={filter.customerId}
                      className="flex flex-col"
                      onChange={(val) => { setFilter((f) => ({ ...f, customerId: val })); init(currentPage) }}
                    />
                  ) : (
                    <p className="text-center my-4">Không có dữ liệu</p>
                  )}
                </div>
              }
            >
              <Icon icon="mdi:filter" className="cursor-pointer outline-none" width="14px" />
            </Popover>
            <span className="ml-4">{col.title}</span>
          </div>
        ),
        render: (_, record) => record.customer?.name
      }
    }
    if (col.key === 'type') {
      return {
        ...col,
        title: (
          <div className="flex items-center">
            <Popover
              trigger="click"
              placement="bottom"
              content={
                <div className="px-4 py-2">
                  <Checkbox.Group
                    options={Object.values(TYPE)}
                    value={filter.type}
                    className="flex flex-col"
                    onChange={(val) => { setFilter((f) => ({ ...f, type: val })); init(currentPage) }}
                  />
                </div>
              }
            >
              <Icon icon="mdi:filter" className="cursor-pointer outline-none" width="14px" />
            </Popover>
            <span className="ml-4">{col.title}</span>
          </div>
        ),
        render: (_, record) => <span>{TYPE[record.type]?.label}</span>
      }
    }
    if (col.key === 'date') {
      return {
        ...col,
        title: (
          <div className="flex items-center">
            <Popover
              trigger="click"
              placement="bottom"
              content={
                <DatePicker.RangePicker
                  format={moment.MOMENT_FORMAT.YYYY_MM_DD}
                  inputReadOnly
                  placeholder={['Từ ngày', 'đến ngày']}
                  onChange={(_, dateStrings) => {
                    setFilter((f) => ({ ...f, date: dateStrings }))
                    init(currentPage)
                  }}
                />
              }
            >
              <Icon icon="mdi:filter" className="cursor-pointer outline-none" width="14px" />
            </Popover>
            <span className="ml-4">{col.title}</span>
          </div>
        ),
        render: (_, record) => moment.dFormat(record.date)
      }
    }
    if (col.key === 'id') {
      return { ...col, render: (_, record) => <span className="font-bold">{record.id}</span> }
    }
    if (col.key === 'totalPrice') {
      return {
        ...col,
        render: (_, record) => (
          <span className="font-semibold text-red-500">{formatCurrency(record.totalPrice)}</span>
        )
      }
    }
    if (col.key === 'lastModified') {
      return {
        ...col,
        render: (_, record) => (
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
      }
    }
    if (col.key === 'action') {
      return {
        ...col,
        render: (_, record) => (
          <div className="flex items-center">
            <Button type="link" onClick={() => navigate(MENU.DEBT_DETAIL.path + record.id)}>
              <Icon icon="mdi:eye" width="24px" />
            </Button>
            <Button type="link" onClick={() => navigate(MENU.EDIT_DEBT.path + record.id)}>
              <Icon icon="mdi:file-document-edit" width="24px" />
            </Button>
            <Button type="link" onClick={() => downloadDebt([record.id])}>
              <Icon icon="material-symbols:download" width="24px" />
            </Button>
          </div>
        )
      }
    }
    return col
  })

  return (
    <section>
      <Heading title={MENU.DEBT.name}>
        <div className="flex items-center">
          <input
            className="mr-4 w-[480px] border border-gray-300 rounded px-3 py-1"
            placeholder="Nhập mã công nợ để tìm kiếm ..."
            value={filter.search}
            onChange={(e) => setFilter((f) => ({ ...f, search: e.target.value }))}
            onKeyPress={(e) => e.key === 'Enter' && init(currentPage)}
          />
          <Button type="primary" className="flex items-center" onClick={() => setIsShowModal(true)}>
            <Icon icon="mdi:plus-circle" width="16px" />
            <span className="ml-2">Tạo công nợ</span>
          </Button>
          {selectedKeys.length !== 0 && (
            <Button type="primary" className="flex items-center ml-4" onClick={() => downloadDebt(selectedKeys)}>
              <Icon icon="mdi:file-excel" />
              <span className="ml-2">Tải xuống</span>
            </Button>
          )}
        </div>
      </Heading>

      <div className="grid grid-cols-12 gap-x-8 my-8">
        <div className={`flex justify-between col-span-8 rounded-md p-4 ${isFiltering ? 'border border-solid border-gray-200' : ''}`}>
          {isFiltering && (
            <div>
              <p className="mb-1">Tiêu chí tìm kiếm:</p>
              <div className="mb-0 pl-8">
                {filter.search && <p className="mb-1">Nội dung: <span className="font-semibold">{filter.search}</span></p>}
                {filter.date && filter.date.length === 2 && filter.date[0] && (
                  <div className="flex items-center mb-1">
                    <Icon icon="mdi:calendar" className="mr-2" />
                    <span>Ngày tạo từ </span>
                    <span className="font-semibold mx-2">{moment.dFormat(filter.date[0])}</span>
                    <span>đến</span>
                    <span className="font-semibold ml-2">{moment.dFormat(filter.date[1])}</span>
                  </div>
                )}
                {filter.type.length !== 0 && (
                  <div className="flex items-center">
                    <Icon icon="mdi:format-list-bulleted-type" className="mr-2" />
                    <span className="mr-2">Phân loại:</span>
                    <span className="font-semibold">{selectedType}</span>
                  </div>
                )}
                {filter.customerId.length !== 0 && (
                  <div className="flex items-center">
                    <Icon icon="mdi:account" className="mr-2" />
                    <span className="mr-2">Nhà cung cấp:</span>
                    <span className="font-semibold">{selectedCustomer}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          {isFiltering && (
            <Button type="primary" className="w-fit flex items-center" onClick={reset}>
              <Icon icon="tabler:zoom-reset" width="16px" />
              <span className="ml-2">Làm mới</span>
            </Button>
          )}
        </div>

        <div className="flex items-end justify-end col-span-4">
          <table className="summary-table w-full h-fit">
            <tbody>
              <tr>
                <td className="font-medium">Tổng số</td>
                <td>{debtStore.allDebt?.totalItems || 0} công nợ</td>
              </tr>
              <tr>
                <td className="font-medium">Tổng giá trị</td>
                <td>{formatCurrency(debtStore.allDebtTotalPrice)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <Table
        rowKey={(record) => record.id}
        columns={columns}
        scroll={{ x: 'max-content' }}
        rowSelection={{ onChange: (keys) => setSelectedKeys(keys) }}
        pagination={{
          current: currentPage,
          total: debtStore.allDebt?.totalItems,
          pageSize: debtStore.allDebt?.pageSize,
          onChange: init
        }}
        dataSource={debts}
      />

      {isShowModal && (
        <SelectWayToAddDebt
          onCallback={init}
          onClose={() => setIsShowModal(false)}
        />
      )}
    </section>
  )
}
