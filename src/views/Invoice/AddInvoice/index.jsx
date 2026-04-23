import { useState, useEffect } from 'react'
import { Table, Button, Select, Input, DatePicker, Radio, Popconfirm } from 'antd'
import { cloneDeep, isEmpty } from 'lodash'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'
import { useMessage, useMoment } from '~/composables'
import { CUSTOMER_TYPE_KEY, MSG } from '~/modules/constant'
import { MENU } from '~/modules/menu'
import { UPSERT_INVOICE_TABLE_COLUMNS } from '~/modules/table'
import { customFilter, formatCurrency } from '~/modules/utils'
import { useBranchStore } from '~/stores/branch'
import { useCustomerStore } from '~/stores/customer'
import { useInvoiceStore } from '~/stores/invoice'
import { useProductStore } from '~/stores/product'
import { useShippingAddressStore } from '~/stores/shippingAddress'
import Heading from '~/components/common/Heading'
import UpsertShippingAddressModal from '~/components/pages/invoice/UpsertShippingAddressModal'
import dayjs from 'dayjs'

const initFormState = {
  id: '',
  date: '',
  customerId: null,
  branchId: null,
  shippingAddressId: null,
  note: '',
  items: []
}

const emptyProductItem = { product: null, quantity: 0, unitPrice: 0 }

export default function AddInvoice() {
  const navigate = useNavigate()
  const mc = useMessage()
  const moment = useMoment()
  const branchStore = useBranchStore()
  const customerStore = useCustomerStore()
  const productStore = useProductStore()
  const invoiceStore = useInvoiceStore()
  const shippingAddressStore = useShippingAddressStore()

  const [formState, setFormState] = useState(cloneDeep(initFormState))
  const [formErrors, setFormErrors] = useState({})
  const [totalPrice, setTotalPrice] = useState(0)
  const [isShowAddCustomerModal, setIsShowAddCustomerModal] = useState(false)
  const [isShowAddShippingAddressModal, setIsShowAddShippingAddressModal] = useState(false)

  const initFormOptions = async () => {
    await branchStore.getAll()
    await customerStore.getAllOption({ type: CUSTOMER_TYPE_KEY.CUSTOMER })
  }

  useEffect(() => {
    initFormOptions()
  }, [])

  const clearValidate = (errorName, index = -1) => {
    setFormErrors((prev) => {
      const next = { ...prev }
      if (index === -1) {
        delete next[errorName]
      } else if (next.items && next.items.length !== 0) {
        next.items = next.items.filter((e) => e.index !== index)
        if (next.items.length === 0) delete next.items
      }
      return next
    })
  }

  const changeID = (e) => {
    const val = e.target.value.trim().toUpperCase()
    setFormState((s) => ({ ...s, id: val }))
    clearValidate('id')
  }

  const calPrice = (items) => {
    const tp = (items || formState.items).reduce((a, item) => {
      return a + (Number(item.unitPrice) || 0) * (Number(item.quantity) || 0)
    }, 0)
    setTotalPrice(tp)
  }

  const addProductItem = async () => {
    if (!formState.branchId) {
      mc.error('Vui lòng chọn chi nhánh trước khi thêm sản phẩm')
    } else {
      if (formState.items.length === 0 || productStore.allProductOptions.length === 0) {
        await productStore.getAllOption({ branchId: formState.branchId })
      }
      setFormState((s) => ({ ...s, items: [...s.items, cloneDeep(emptyProductItem)] }))
      clearValidate('items')
    }
  }

  const deleteProductItem = (index) => {
    setFormState((s) => {
      const items = s.items.filter((_, i) => i !== index)
      calPrice(items)
      return { ...s, items }
    })
  }

  const selectProduct = (value, index) => {
    const product = productStore.allProductOptions.find((p) => p.id === value)
    setFormState((s) => {
      const items = s.items.map((item, i) => (i === index ? { ...item, product } : item))
      return { ...s, items }
    })
    clearValidate('items', index)
  }

  const duplicateProductItem = (index) => {
    setFormState((s) => {
      const items = [...s.items, cloneDeep(s.items[index])]
      calPrice(items)
      return { ...s, items }
    })
  }

  const updateItem = (index, field, value) => {
    setFormState((s) => {
      const items = s.items.map((item, i) => (i === index ? { ...item, [field]: value } : item))
      calPrice(items)
      return { ...s, items }
    })
  }

  const validateItems = (items) => {
    if (!items || isEmpty(items) || items.length === 0) {
      return { items: [{ index: -1, msg: 'Vui lòng thêm sản phẩm cho hoá đơn' }] }
    }
    const errs = items
      .map((item, index) => {
        if (!item.product || !item.quantity || !item.unitPrice)
          return { index, msg: `Sản phẩm STT=[${index + 1}] có giá trị không hợp lệ` }
        if (item.quantity > item.product.quantity)
          return { index, msg: `Số lượng sản phẩm STT=[${index + 1}] vượt quá số lượng tồn kho` }
        return null
      })
      .filter(Boolean)
    return errs.length > 0 ? { items: errs } : {}
  }

  const validate = () => {
    const { id, date, branchId, customerId, shippingAddressId, items } = formState
    const errors = {}
    if (!id) errors.id = 'Số hoá đơn là trường bắt buộc'
    if (!date) errors.date = 'Ngày nhập hoá đơn là trường băt buộc'
    if (!customerId) errors.customerId = 'Nhà cung cấp là trường băt buộc'
    if (!branchId) errors.branchId = 'Chi nhánh là trường băt buộc'
    if (!shippingAddressId) errors.shippingAddressId = 'Địa chỉ giao hàng là bắt buộc'
    Object.assign(errors, validateItems(items))
    setFormErrors(errors)
    return isEmpty(errors)
  }

  const submit = async () => {
    if (!validate()) return
    const { id, date, branchId, customerId, shippingAddressId, note } = formState
    const items = cloneDeep(formState.items).map((item) => ({
      productId: item.product.id,
      quantity: Number(item.quantity) || 0,
      unitPrice: Number(item.unitPrice) || 0
    }))
    try {
      await invoiceStore.create({ id, date, branchId, customerId, shippingAddressId, note, items })
      setFormState(cloneDeep(initFormState))
      mc.success(MSG.SAVE_SUCCESS)
      navigate(MENU.INVOICE.path)
    } catch {
      mc.error(MSG.SAVE_FAILED)
    }
  }

  const upsertCustomer = async (payload) => {
    try {
      await customerStore.upsert(payload)
      await customerStore.getAllOption({ type: CUSTOMER_TYPE_KEY.CUSTOMER })
      setIsShowAddCustomerModal(false)
      mc.success(MSG.UPDATE_SUCCESS)
    } catch {
      mc.error(MSG.UPDATE_FAILED)
    }
  }

  const initShippingAddress = async (customerId) => {
    await shippingAddressStore.getAll({ customerId })
    const defaultAddress = shippingAddressStore.shippingAddresses.find((item) => item.defaultAddress)
    setFormState((s) => ({ ...s, shippingAddressId: defaultAddress ? defaultAddress.id : null }))
  }

  const changeCustomer = async (id) => {
    setFormState((s) => ({ ...s, customerId: id }))
    clearValidate('customerId')
    await initShippingAddress(id)
  }

  const openShippingAddressModal = () => {
    if (!formState.customerId) mc.error('Vui lòng chọn khách hàng để thêm địa chỉ giao hàng!')
    else setIsShowAddShippingAddressModal(true)
  }

  const upsertShippingAddress = async (payload) => {
    try {
      await shippingAddressStore.upsert({ ...payload, customerId: formState.customerId })
      await initShippingAddress(formState.customerId)
      setIsShowAddShippingAddressModal(false)
      mc.success(MSG.SAVE_SUCCESS)
    } catch {
      mc.error(MSG.SAVE_FAILED)
    }
  }

  const deleteShippingAddress = async (id) => {
    try {
      await shippingAddressStore.delete(id)
      await initShippingAddress(formState.customerId)
      mc.success(MSG.DELETE_SUCCESS)
    } catch {
      mc.error(MSG.DELETE_FAILED)
    }
  }

  const updateDefaultShippingAddress = async (id) => {
    if (!formState.customerId) { mc.error('Vui lòng chọn khách hàng để thêm địa chỉ giao hàng!'); return }
    try {
      await shippingAddressStore.updateDefault({ id, customerId: formState.customerId })
      await initShippingAddress(formState.customerId)
      mc.success(MSG.UPDATE_SUCCESS)
    } catch {
      mc.error(MSG.UPDATE_FAILED)
    }
  }

  const getRowClassName = (_, index) => {
    return formErrors.items && formErrors.items.find((e) => e.index === index)
      ? 'add-invoice__table--error' : ''
  }

  const columns = UPSERT_INVOICE_TABLE_COLUMNS.map((col) => {
    if (col.key === 'no') {
      return { ...col, render: (_, __, index) => <div className="flex items-center h-full"><span className="font-bold">{index + 1}</span></div> }
    }
    if (col.key === 'product') {
      return {
        ...col,
        render: (_, record, index) => (
          <Select
            allowClear
            options={(productStore.allProductOptions || []).map((item) => ({ value: item.id, label: item.name }))}
            placeholder="Chọn sản phẩm"
            className="w-full"
            showSearch
            filterOption={customFilter}
            onChange={(value) => selectProduct(value, index)}
          />
        )
      }
    }
    if (col.key === 'productQuantity') {
      return {
        ...col,
        render: (_, record, index) => (
          <div className="flex items-center h-full">
            <span className="font-bold">{formState.items[index]?.product?.quantity ?? ''}</span>
          </div>
        )
      }
    }
    if (col.key === 'quantity') {
      return {
        ...col,
        render: (_, record, index) => (
          <Input
            type="number"
            min={0}
            value={record.quantity}
            disabled={!record.product}
            onChange={(e) => { updateItem(index, 'quantity', e.target.value); calPrice() }}
          />
        )
      }
    }
    if (col.key === 'unitPrice') {
      return {
        ...col,
        render: (_, record, index) => (
          <Input
            type="number"
            min={0}
            value={record.unitPrice}
            disabled={!record.product}
            onChange={(e) => { updateItem(index, 'unitPrice', e.target.value); calPrice() }}
          />
        )
      }
    }
    if (col.key === 'action') {
      return {
        ...col,
        render: (_, record, index) => (
          <div className="flex items-center">
            <Button type="link" danger onClick={() => deleteProductItem(index)}>
              <Icon icon="mdi:trash-can" width="20px" />
            </Button>
            <Button type="link" onClick={() => duplicateProductItem(index)}>
              <Icon icon="mdi:content-duplicate" width="20px" />
            </Button>
          </div>
        )
      }
    }
    return col
  })

  return (
    <section>
      <Heading title={MENU.ADD_INVOICE.name} className="items-start">
        <div className="flex items-center mb-4">
          <Button className="w-[120px] flex items-center justify-center" onClick={() => navigate(-1)}>Huỷ bỏ</Button>
          <Button type="primary" className="w-[120px] ml-4 mr-0 flex items-center justify-center" onClick={submit}>
            <Icon icon="mdi:content-save" />
            <span className="ml-2">Tạo</span>
          </Button>
        </div>
      </Heading>

      <p className="text-right italic mb-0 mt-2 text-xl text-red-500">(*) Là các trường bắt buộc</p>

      <div className="w-9/12 mx-auto">
        <div className="grid grid-cols-12 gap-x-8 mt-2 mb-4">
          <div className="col-span-4">
            <label><span className="text-red-500">*</span> Số hoá đơn</label>
            <Input value={formState.id} placeholder="Nhập số hoá đơn" maxLength={100} onChange={changeID} />
            {formErrors.id && <p className="mb-0 text-red-500 mt-0.5 text-[12px]">{formErrors.id}</p>}
          </div>
          <div className="col-span-4">
            <label><span className="text-red-500">*</span> Ngày nhập hoá đơn</label>
            <DatePicker
              placeholder="Chọn ngày"
              format={moment.MOMENT_FORMAT.YYYY_MM_DD}
              value={formState.date ? dayjs(formState.date, moment.MOMENT_FORMAT.YYYYMMDD) : null}
              className="w-full"
              onChange={(_, dateStr) => { setFormState((s) => ({ ...s, date: dateStr })); clearValidate('date') }}
            />
            {formErrors.date && <p className="mb-0 text-red-500 mt-0.5 text-[12px]">{formErrors.date}</p>}
          </div>
          <div className="col-span-4">
            <label><span className="text-red-500">*</span> Chi nhánh</label>
            <Select
              value={formState.branchId}
              options={branchStore.getBranchOptions()}
              placeholder="Chọn chi nhánh"
              className="w-full"
              onChange={(val) => { setFormState((s) => ({ ...s, branchId: val })); clearValidate('branchId') }}
            />
            {formErrors.branchId && <p className="mb-0 text-red-500 mt-0.5 text-[12px]">{formErrors.branchId}</p>}
          </div>
        </div>

        <div className="mt-6">
          <label>Ghi chú</label>
          <Input.TextArea
            value={formState.note}
            placeholder="Nhập ghi chú"
            onChange={(e) => setFormState((s) => ({ ...s, note: e.target.value }))}
          />
        </div>

        <div className="mt-6 mb-16 grid grid-cols-12 gap-x-28">
          <div className="col-span-4">
            <div className="flex items-center justify-between">
              <label><span className="text-red-500">*</span> Khách hàng</label>
              <Button type="link" size="small" className="px-0" onClick={() => setIsShowAddCustomerModal(true)}>Thêm khách hàng?</Button>
            </div>
            <Select
              value={formState.customerId}
              allowClear
              options={customerStore.customerOptions}
              filterOption={customFilter}
              showSearch
              placeholder="Chọn khách hàng"
              className="w-full mt-1"
              onChange={changeCustomer}
            />
            {formErrors.customerId && <p className="mb-0 text-red-500 mt-0.5 text-[12px]">{formErrors.customerId}</p>}
          </div>

          <div className="col-span-8">
            <div className="flex items-center justify-between">
              <label><span className="text-red-500">*</span> Địa chỉ giao</label>
              <Button type="link" size="small" className="px-0" onClick={openShippingAddressModal}>Thêm địa chỉ giao hàng?</Button>
            </div>
            {shippingAddressStore.shippingAddresses.length === 0 ? (
              <p className="text-right w-full text-gray-400 italic mt-2 text-lg">Chưa có địa chỉ giao hàng!</p>
            ) : (
              <div className="mt-1 max-h-[320px] overflow-y-auto">
                <Radio.Group
                  value={formState.shippingAddressId}
                  className="grid grid-cols-1 gap-4"
                  onChange={(e) => { setFormState((s) => ({ ...s, shippingAddressId: e.target.value })); clearValidate('shippingAddressId') }}
                >
                  {shippingAddressStore.shippingAddresses.map((item) => (
                    <Radio key={item.id} value={item.id} className="border border-slate-300 border-solid px-4 py-2">
                      <div className="w-full grid grid-cols-12 gap-x-8">
                        <div className="col-span-8">
                          <p className="font-semibold mb-0">{item.name}</p>
                          <p className="mb-0">{item.phone}</p>
                          <p className="mb-0">{item.address}</p>
                        </div>
                        <div className="col-span-4 flex flex-col items-end">
                          <Popconfirm title="Bạn có chắc muốn xoá địa chỉ giao hàng này không?" okText="Có" cancelText="Không" onConfirm={() => deleteShippingAddress(item.id)}>
                            <Button type="link" danger className="px-0">Xoá</Button>
                          </Popconfirm>
                          {!item.defaultAddress ? (
                            <Button type="link" className="px-0" onClick={() => updateDefaultShippingAddress(item.id)}>Đặt làm mặc định</Button>
                          ) : (
                            <span className="text-gray-400">Địa chỉ mặc định</span>
                          )}
                        </div>
                      </div>
                    </Radio>
                  ))}
                </Radio.Group>
              </div>
            )}
            {formErrors.shippingAddressId && <p className="mb-0 text-red-500 mt-2 text-[12px]">{formErrors.shippingAddressId}</p>}
          </div>
        </div>

        <div className="flex justify-between mb-4">
          <table className="summary-table">
            <tbody>
              <tr>
                <td>Tổng giá trị hoá đơn</td>
                <td>{formatCurrency(totalPrice)}</td>
              </tr>
            </tbody>
          </table>
          <div className="flex items-center">
            <Button type="primary" ghost className="flex items-center" onClick={initFormOptions}>
              <Icon icon="bx:reset" width="16px" />
              <span className="ml-2">Làm mới</span>
            </Button>
            <Button type="primary" ghost className="min-w-[120px] flex items-center ml-4" onClick={addProductItem}>
              <Icon icon="mdi:plus-circle" width="16px" />
              <span className="ml-2">Thêm sản phẩm</span>
            </Button>
          </div>
        </div>

        {formErrors.items && formErrors.items.length !== 0 && (
          <div className="mb-1">
            {formErrors.items.map((eItem, i) => (
              <p key={i} className="mb-0 text-red-500 mt-0.5 text-[12px]">{eItem.msg}</p>
            ))}
          </div>
        )}

        <Table
          columns={columns}
          dataSource={formState.items}
          rowKey={(_, index) => index}
          scroll={{ x: 'max-content' }}
          pagination={false}
          rowClassName={getRowClassName}
          className="add-invoice__table"
          locale={{ emptyText: 'Dữ liệu trống' }}
        />
      </div>

      {isShowAddShippingAddressModal && (
        <UpsertShippingAddressModal
          customerId={formState.customerId}
          onSubmit={upsertShippingAddress}
          onClose={() => setIsShowAddShippingAddressModal(false)}
        />
      )}
    </section>
  )
}
