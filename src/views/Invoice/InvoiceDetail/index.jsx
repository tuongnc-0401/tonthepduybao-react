import { useState, useEffect, useMemo } from 'react'
import { Table, Button, Input, Modal } from 'antd'
import { Icon } from '@iconify/react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMessage, useMoment } from '~/composables'
import { MSG, NOT_FOUND_PATH } from '~/modules/constant'
import { MENU } from '~/modules/menu'
import { INVOICE_PRODUCTS_TABLE_COLUMNS } from '~/modules/table'
import { formatCurrency, normalize } from '~/modules/utils'
import { useCommonStore } from '~/stores/common'
import { useInvoiceStore } from '~/stores/invoice'
import Heading from '~/components/common/Heading'
import PrintInvoiceModal from '~/components/pages/invoice/PrintInvoiceModal'

export default function InvoiceDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const mc = useMessage()
  const moment = useMoment()
  const commonStore = useCommonStore()
  const invoiceStore = useInvoiceStore()

  const [search, setSearch] = useState('')
  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(undefined)

  const invoice = invoiceStore.invoice

  useEffect(() => {
    if (!id) { navigate(NOT_FOUND_PATH); return }

    const load = async () => {
      try {
        await invoiceStore.get(id)
        const inv = invoiceStore.invoice
        commonStore.setBreadcrumbs([
          MENU.INVOICE,
          { name: inv.id, path: MENU.INVOICE_DETAIL.path + inv.id }
        ])
      } catch {
        navigate(MENU.INVOICE.path)
      }
    }

    load()
    return () => commonStore.setBreadcrumbs([])
  }, [id])

  const invoiceProducts = useMemo(() => {
    if (!invoice) return []
    const searchParam = normalize(search.toLowerCase())
    return invoice.invoiceProducts.filter((item) =>
      normalize(item.product.name.toLowerCase()).includes(searchParam)
    )
  }, [invoice, search])

  const deleteInvoice = async () => {
    try {
      await invoiceStore.delete(invoice.id)
      setIsShowConfirmModal(false)
      mc.success(MSG.DELETE_SUCCESS)
      navigate(MENU.INVOICE.path)
    } catch {
      mc.error(MSG.DELETE_FAILED)
    }
  }

  const columns = INVOICE_PRODUCTS_TABLE_COLUMNS.map((col) => {
    if (col.key === 'no') return { ...col, render: (_, __, index) => index + 1 }
    if (col.key === 'product') {
      return { ...col, render: (_, record) => <span className="font-medium">{record.product.name}</span> }
    }
    if (col.key === 'quantity') return { ...col, render: (_, record) => record.quantity }
    if (col.key === 'unitPrice') {
      return { ...col, render: (_, record) => formatCurrency(record.unitPrice) }
    }
    if (col.key === 'totalPrice') {
      return {
        ...col,
        render: (_, record) => (
          <span className="font-medium text-red-400">{formatCurrency(record.unitPrice * record.quantity)}</span>
        )
      }
    }
    return col
  })

  if (!invoice) return null

  return (
    <section>
      <Heading
        title={`Mã hoá đơn: [${invoice.id}] - ${moment.dFormat(invoice.date)}`}
        subTitle={`Chỉnh sửa gần đây ${moment.mFormat(invoice.updatedAt)} bởi ${invoice.updatedBy}`}
      >
        <div className="flex items-center">
          <Button type="primary" danger className="flex items-center px-8" onClick={() => setIsShowConfirmModal(true)}>
            <Icon icon="mdi:trash-can" />
            <span className="ml-2">Xoá</span>
          </Button>
          <Button type="primary" className="flex items-center px-8 ml-4" onClick={() => setSelectedInvoice(invoice)}>
            <Icon icon="mdi:printer" />
            <span className="ml-2">In hoá đơn</span>
          </Button>
          <Button type="primary" className="flex items-center px-8 ml-4" onClick={() => navigate(MENU.EDIT_INVOICE.path + invoice.id)}>
            <Icon icon="mdi:pencil-box-outline" />
            <span className="ml-2">Sửa</span>
          </Button>
        </div>
      </Heading>

      <div className="grid grid-cols-12 gap-x-8 mt-8">
        <div className="grid grid-cols-12 gap-8 col-span-8 border border-solid border-gray-200 rounded-md p-4">
          <div className="col-span-5 space-y-3">
            <div className="flex items-center">
              <Icon icon="mdi:calendar" className="mr-2" />
              <span className="mr-2">Ngày tạo:</span>
              <span className="font-semibold">{moment.dFormat(invoice.date)}</span>
            </div>
            <div className="flex items-center">
              <Icon icon="mdi:format-list-bulleted-type" className="mr-2" />
              <span className="mr-2">Chi nhánh:</span>
              <span className="font-semibold">{invoice.branch?.name}</span>
            </div>
          </div>
          <div className="col-span-7 space-y-3">
            <div className="flex items-center">
              <Icon icon="mdi:account" className="mr-2" />
              <span className="mr-2">Khách hàng:</span>
              <span className="font-semibold">{invoice.customer?.name}</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center">
                <Icon icon="mdi:address-marker" className="mr-2" />
                <span className="mr-2">Địa chỉ giao hàng:</span>
              </div>
              <ul className="m-0 pl-7 list-none">
                <li>- <span className="font-semibold">Tên:</span> {invoice.shippingAddress?.name}</li>
                <li>- <span className="font-semibold">Số ĐT:</span> {invoice.shippingAddress?.phone}</li>
                <li>- <span className="font-semibold">Địa chỉ:</span> {invoice.shippingAddress?.address}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end col-span-4">
          <table className="summary-table w-full h-full">
            <tbody>
              <tr>
                <td className="font-medium text-4xl">Tổng giá trị</td>
                <td className="text-4xl font-bold">{formatCurrency(invoice.totalPrice)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between mt-8 mb-4">
        <div>
          <b>Danh sách sản phẩm:</b>
          <span className="font-normal ml-2">{invoiceProducts.length} sản phẩm</span>
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
        dataSource={invoiceProducts}
        rowKey="id"
        scroll={{ x: 'max-content' }}
        pagination={false}
      />

      <Modal
        open={isShowConfirmModal}
        okText="Có"
        cancelText="Không"
        centered
        okButtonProps={{ type: 'primary', danger: true, className: 'px-10' }}
        onOk={deleteInvoice}
        onCancel={() => setIsShowConfirmModal(false)}
      >
        <div className="flex items-center">
          <Icon icon="ph:warning-fill" className="text-red-500 mr-4" width="20px" />
          <span>Bạn có chắc muốn xoá hoá đơn này không?</span>
        </div>
      </Modal>

      <PrintInvoiceModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(undefined)} />
    </section>
  )
}
