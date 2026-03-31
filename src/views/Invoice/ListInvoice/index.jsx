import { useState, useEffect } from 'react'
import { Table, Button, Input, DatePicker, Popover } from 'antd'
import { cloneDeep } from 'lodash'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'
import { useMessage, useMoment } from '~/composables'
import { PAGING } from '~/modules/constant'
import { MENU } from '~/modules/menu'
import { LIST_INVOICE_TABLE_COLUMNS } from '~/modules/table'
import { formatCurrency } from '~/modules/utils'
import { useInvoiceStore } from '~/stores/invoice'
import Heading from '~/components/common/Heading'

export default function ListInvoice() {
  const navigate = useNavigate()
  const mc = useMessage()
  const moment = useMoment()
  const invoiceStore = useInvoiceStore()

  const [filter, setFilter] = useState({ search: '', date: [] })
  const [currentPage, setCurrentPage] = useState(PAGING.DEFAULT_PAGE)

  const invoices = invoiceStore.allInvoice?.data || []

  const init = async (page = PAGING.DEFAULT_PAGE, pageSize = PAGING.DEFAULT_PAGE_SIZE) => {
    setCurrentPage(page)
    const { search, date } = filter
    await invoiceStore.getAll({
      search,
      fromDate: date && date.length === 2 ? date[0] : '',
      toDate: date && date.length === 2 ? date[1] : '',
      customerId: '',
      branchId: '',
      page,
      pageSize
    })
  }

  useEffect(() => {
    init(currentPage)
  }, [])

  const columns = LIST_INVOICE_TABLE_COLUMNS.map((col) => {
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
    if (col.key === 'customer') {
      return { ...col, render: (_, record) => record.customer?.name }
    }
    if (col.key === 'branch') {
      return { ...col, render: (_, record) => record.branch?.name }
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
            <Button type="link" onClick={() => navigate(MENU.INVOICE_DETAIL.path + record.id)}>
              <Icon icon="mdi:eye" width="24px" />
            </Button>
            <Button type="link" onClick={() => navigate(MENU.EDIT_INVOICE.path + record.id)}>
              <Icon icon="mdi:file-document-edit" width="24px" />
            </Button>
          </div>
        )
      }
    }
    return col
  })

  return (
    <section>
      <Heading title={MENU.INVOICE.name}>
        <div className="flex items-center">
          <Input.Search
            type="number"
            placeholder="Nhập ID hoá đơn để tìm kiếm ..."
            className="mr-4 w-[480px]"
            value={filter.search}
            onChange={(e) => setFilter((f) => ({ ...f, search: e.target.value }))}
            onPressEnter={() => init(currentPage)}
          />
          <Button type="primary" className="flex items-center" onClick={() => navigate(MENU.ADD_INVOICE.path)}>
            <Icon icon="mdi:plus-circle" width="16px" />
            <span className="ml-2">Tạo hoá đơn</span>
          </Button>
        </div>
      </Heading>

      <div className="grid grid-cols-12 gap-x-8 my-8">
        <div className="col-span-8" />
        <div className="flex items-end justify-end col-span-4">
          <table className="summary-table w-full h-fit">
            <tbody>
              <tr>
                <td className="font-medium">Tổng số</td>
                <td>{invoiceStore.allInvoice?.totalItems || 0} hoá đơn</td>
              </tr>
              <tr>
                <td className="font-medium">Tổng giá trị</td>
                <td>{formatCurrency(invoiceStore.allInvoiceTotalPrice)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <Table
        rowKey={(record) => record.id}
        columns={columns}
        scroll={{ x: 'max-content' }}
        rowSelection={{ onChange: () => {} }}
        pagination={{
          current: currentPage,
          total: invoiceStore.allInvoice?.totalItems,
          pageSize: invoiceStore.allInvoice?.pageSize,
          onChange: init
        }}
        dataSource={invoices}
        rowClassName="cursor-pointer"
      />
    </section>
  )
}
