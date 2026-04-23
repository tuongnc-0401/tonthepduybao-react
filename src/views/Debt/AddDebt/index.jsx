import { useState, useEffect, useMemo } from 'react'
import { Table, Button, Select, Input, DatePicker, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { cloneDeep, isEmpty } from 'lodash'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'
import { useMessage, useMoment } from '~/composables'
import { CUSTOMER_TYPE_KEY, MSG, TYPE, TYPE_KEY } from '~/modules/constant'
import { MENU } from '~/modules/menu'
import { DEBT_FULL_TABLE_COLUMNS, DEBT_SCREW_TABLE_COLUMNS } from '~/modules/table'
import { customFilter, formatCurrency } from '~/modules/utils'
import { useBranchStore } from '~/stores/branch'
import { useCustomerStore } from '~/stores/customer'
import { useDebtStore } from '~/stores/debt'
import { usePropertyStore } from '~/stores/property'
import Heading from '~/components/common/Heading'
import dayjs from 'dayjs'

const initFormState = {
  id: '',
  date: '',
  type: TYPE_KEY.IRON,
  customerId: null,
  propertyIds: [],
  items: []
}

const emptyDebtItem = {
  name: '',
  note: '',
  branch: null,
  quantity: 0,
  weight: 0,
  avgProportion: 0,
  unitPrice: 0,
  totalUnitPrice: 0,
  totalPrice: 0,
  properties: {}
}

export default function AddDebt() {
  const navigate = useNavigate()
  const mc = useMessage()
  const moment = useMoment()
  const debtStore = useDebtStore()
  const branchStore = useBranchStore()
  const propertyStore = usePropertyStore()
  const customerStore = useCustomerStore()

  const [formState, setFormState] = useState(cloneDeep(initFormState))
  const [formErrors, setFormErrors] = useState({})
  const [selectedProperties, setSelectedProperties] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [totalUnitPrice, setTotalUnitPrice] = useState(0)

  const tableColumns = useMemo(
    () => (formState.type === TYPE_KEY.SCREW ? DEBT_SCREW_TABLE_COLUMNS : DEBT_FULL_TABLE_COLUMNS),
    [formState.type]
  )

  const initFormOptions = async () => {
    await branchStore.getAll()
    await customerStore.getAllOption({ type: CUSTOMER_TYPE_KEY.SUPPLIER })
    await propertyStore.getAll({ type: formState.type })
    clearValidate('type')
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
        next.items = next.items.filter((i) => i !== index)
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

  const changeType = async (type) => {
    const t = type || formState.type
    await propertyStore.getAll({ type: t })
    setFormState((s) => ({ ...s, type: t }))
    clearValidate('type')
  }

  const selectProperty = (propId) => {
    const property = propertyStore.allProperty.find((item) => item.id === propId)
    if (property) setSelectedProperties((prev) => [...prev, property])
  }

  const deselectProperty = (propId) => {
    const newSelectedProperties = selectedProperties.filter((item) => item.id !== propId)
    const isEmptyItems = formState.items.length === 0

    if (!isEmptyItems && newSelectedProperties.length === 0) {
      mc.error('Phải có ít nhất 1 thuộc tính cho danh sách sản phẩm.')
      setFormState((s) => ({ ...s, propertyIds: [...s.propertyIds, propId] }))
    } else if (!isEmptyItems) {
      Modal.confirm({
        title: 'Xác nhận xoá',
        icon: <ExclamationCircleOutlined />,
        content: 'Khi xoá thuộc tính, các thuộc tính của sản phẩm cũng sẽ bị xoá theo, bạn có chắc muốn xoá không?',
        okText: 'Có',
        okType: 'primary',
        cancelText: 'Không',
        onOk() {
          setSelectedProperties(newSelectedProperties)
          setFormState((s) => ({
            ...s,
            items: s.items.map((item) => {
              const props = { ...item.properties }
              delete props[propId]
              return { ...item, properties: props }
            })
          }))
        },
        onCancel() {
          setFormState((s) => ({ ...s, propertyIds: [...s.propertyIds, propId] }))
        }
      })
    } else {
      setSelectedProperties(newSelectedProperties)
    }
  }

  const calPrice = (items) => {
    const tp = items.reduce((a, b) => a + (Number(b.totalPrice) || 0), 0)
    const tup = items.reduce((a, b) => a + (Number(b.totalUnitPrice) || 0), 0)
    setTotalPrice(tp)
    setTotalUnitPrice(tup)
  }

  const updateItem = (index, updater) => {
    setFormState((s) => {
      const items = s.items.map((item, i) => (i === index ? updater(item) : item))
      calPrice(items)
      return { ...s, items }
    })
  }

  const changeAvgProportion = (index, weight, quantity) => {
    setFormState((s) => {
      const items = [...s.items]
      const item = { ...items[index] }
      const w = Number(weight)
      const q = Number(quantity)
      item.weight = weight
      item.quantity = quantity
      item.avgProportion = q > 0 ? parseFloat((w / q).toFixed(2)) : 0
      const up = Number(item.unitPrice)
      item.totalPrice = s.type === TYPE_KEY.SCREW ? q * up : w * up
      item.totalUnitPrice = item.avgProportion * up
      items[index] = item
      calPrice(items)
      return { ...s, items }
    })
  }

  const changeUnitPrice = (index, unitPrice) => {
    setFormState((s) => {
      const items = [...s.items]
      const item = { ...items[index] }
      const up = Number(unitPrice)
      const q = Number(item.quantity)
      const w = Number(item.weight)
      item.unitPrice = unitPrice
      item.totalPrice = s.type === TYPE_KEY.SCREW ? q * up : w * up
      item.totalUnitPrice = Number(item.avgProportion) * up
      items[index] = item
      calPrice(items)
      return { ...s, items }
    })
  }

  const addDebtItem = () => {
    if (selectedProperties.length === 0) {
      mc.error('Vui lòng chọn thuộc tính trước khi thêm công nợ')
    } else {
      const item = cloneDeep(emptyDebtItem)
      setFormState((s) => ({ ...s, items: [...s.items, item] }))
      clearValidate('tableItems')
    }
  }

  const deleteDebtItem = (index) => {
    setFormState((s) => {
      const items = s.items.filter((_, i) => i !== index)
      calPrice(items)
      return { ...s, items }
    })
  }

  const duplicateDebtItem = (index) => {
    setFormState((s) => {
      const items = [...s.items, cloneDeep(s.items[index])]
      calPrice(items)
      return { ...s, items }
    })
  }

  const validateItems = (items) => {
    let newErrors = {}
    if (!items || items.length === 0) {
      newErrors.tableItems = 'Vui lòng thêm sản phẩm cho công nợ'
    } else {
      const errorIndices = items
        .map((item, i) => (!item.name.trim() || !item.branch ? i : -1))
        .filter((i) => i !== -1)
      if (errorIndices.length > 0) newErrors.items = errorIndices
    }
    return newErrors
  }

  const validate = () => {
    const { id, date, type, customerId, propertyIds, items } = formState
    const errors = {}

    if (!id) errors.id = 'Mã công nợ là trường băt buộc'
    else if (!/^[A-Z0-9-_]+$/.test(id)) errors.id = 'Mã công nợ là chỉ được có kí tự A-Z, 0-9, -, _'

    if (!type) errors.type = 'Loại sản phẩm là trường băt buộc'
    if (!date) errors.date = 'Ngày nhập công nợ là trường băt buộc'
    if (!customerId) errors.customerId = 'Nhà cung cấp là trường băt buộc'
    if (!propertyIds || propertyIds.length === 0) errors.propertyIds = 'Thuộc tính là trường băt buộc'

    const itemErrors = validateItems(items)
    Object.assign(errors, itemErrors)

    setFormErrors(errors)
    return isEmpty(errors)
  }

  const submit = async () => {
    const isValid = validate()
    if (!isValid) return

    const { id, date, type, customerId, propertyIds } = formState
    const items = cloneDeep(formState.items).map((item) => ({
      name: item.name.trim(),
      note: item.note.trim(),
      properties: item.properties,
      weight: item.weight || 0,
      quantity: item.quantity || 0,
      unitPrice: item.unitPrice || 0,
      totalPrice: item.totalPrice || 0,
      totalUnitPrice: item.totalUnitPrice || 0,
      avgProportion: item.avgProportion || 0,
      branch: item.branch
    }))

    try {
      await debtStore.create({ id, date, type, customerId, propertyIds, items })
      setFormState(cloneDeep(initFormState))
      mc.success(MSG.SAVE_SUCCESS)
      navigate(MENU.DEBT.path)
    } catch {
      mc.error(MSG.SAVE_FAILED)
    }
  }

  const getRowClassName = (_, index) => {
    return formErrors.items && formErrors.items.includes(index) ? 'add-debt__table--error' : ''
  }

  const columns = tableColumns.map((col) => {
    if (col.key === 'name') {
      return {
        ...col,
        title: <span><span className="text-red-500">* </span>{col.title}</span>,
        render: (_, record, index) => (
          <div className="flex items-center">
            <span className="mr-4">{index + 1}.</span>
            <Input
              value={record.name}
              onChange={(e) => {
                updateItem(index, (item) => ({ ...item, name: e.target.value }))
                clearValidate('items', index)
              }}
            />
          </div>
        )
      }
    }
    if (col.key === 'branch') {
      return {
        ...col,
        title: <span><span className="text-red-500">* </span>{col.title}</span>,
        render: (_, record, index) => (
          <Select
            value={record.branch}
            allowClear
            options={branchStore.getBranchOptions()}
            placeholder="Chọn chi nhánh"
            className="w-full"
            onChange={(val) => {
              updateItem(index, (item) => ({ ...item, branch: val }))
              clearValidate('items', index)
            }}
          />
        )
      }
    }
    if (col.key === 'properties') {
      return {
        ...col,
        render: (_, record, index) => (
          <div>
            {selectedProperties.map((prop, propIndex) => (
              <Select
                key={prop.id}
                value={record.properties[prop.id]}
                options={prop.items.map((item) => ({ label: item.name, value: item.id }))}
                allowClear
                showSearch
                placeholder={`Chọn ${prop.name}`}
                className={`w-full min-w-[120px]${propIndex !== 0 ? ' mt-2' : ''}`}
                onChange={(val) => updateItem(index, (item) => ({ ...item, properties: { ...item.properties, [prop.id]: val } }))}
              />
            ))}
          </div>
        )
      }
    }
    if (col.key === 'weight') {
      return {
        ...col,
        render: (_, record, index) => (
          <Input
            type="number"
            min={0}
            value={record.weight}
            onChange={(e) => changeAvgProportion(index, e.target.value, record.quantity)}
          />
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
            onChange={(e) => changeAvgProportion(index, record.weight, e.target.value)}
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
            onChange={(e) => changeUnitPrice(index, e.target.value)}
          />
        )
      }
    }
    if (col.key === 'totalUnitPrice') {
      return {
        ...col,
        render: (_, record, index) => (
          <Input
            type="number"
            min={0}
            value={record.totalUnitPrice}
            onChange={(e) => updateItem(index, (item) => ({ ...item, totalUnitPrice: e.target.value }))}
          />
        )
      }
    }
    if (col.key === 'totalPrice') {
      return {
        ...col,
        render: (_, record, index) => (
          <Input
            type="number"
            min={0}
            value={record.totalPrice}
            onChange={(e) => updateItem(index, (item) => ({ ...item, totalPrice: e.target.value }))}
          />
        )
      }
    }
    if (col.key === 'action') {
      return {
        ...col,
        render: (_, record, index) => (
          <div className="flex items-center">
            <Button type="link" danger onClick={() => deleteDebtItem(index)}>
              <Icon icon="mdi:trash-can" width="20px" />
            </Button>
            <Button type="link" onClick={() => duplicateDebtItem(index)}>
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
      <Heading title={MENU.ADD_DEBT.name} className="items-start">
        <div className="flex items-center mb-4">
          <Button className="w-[120px] flex items-center justify-center" onClick={() => navigate(-1)}>
            Huỷ bỏ
          </Button>
          <Button type="primary" className="w-[120px] ml-4 mr-0 flex items-center justify-center" onClick={submit}>
            <Icon icon="mdi:content-save" />
            <span className="ml-2">Tạo</span>
          </Button>
        </div>
      </Heading>

      <p className="text-right italic mb-0 mt-2 text-xl text-red-500">(*) Là các trường bắt buộc</p>

      <div className="grid grid-cols-12 gap-x-8 mt-2">
        <div className="col-span-9">
          <label><span className="text-red-500">*</span> Mã công nợ</label>
          <Input
            value={formState.id}
            placeholder="Nhập mã công nợ"
            onChange={changeID}
          />
          {formErrors.id && <p className="mb-0 text-red-500 mt-0.5 text-[12px]">{formErrors.id}</p>}
        </div>
        <div className="col-span-3">
          <label><span className="text-red-500">*</span> Danh mục</label>
          <Select
            value={formState.type}
            allowClear
            options={Object.values(TYPE)}
            placeholder="Chọn loại sản phẩm"
            className="w-full"
            disabled={formState.items.length !== 0}
            onChange={changeType}
          />
          {formErrors.type && <p className="mb-0 text-red-500 mt-0.5 text-[12px]">{formErrors.type}</p>}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-x-8 mt-2">
        <div className="col-span-3 mb-4">
          <label><span className="text-red-500">*</span> Ngày nhập công nợ</label>
          <DatePicker
            placeholder="Chọn ngày"
            format={moment.MOMENT_FORMAT.YYYY_MM_DD}
            value={formState.date ? dayjs(formState.date, moment.MOMENT_FORMAT.YYYYMMDD) : null}
            className="w-full mt-1"
            onChange={(_, dateStr) => { setFormState((s) => ({ ...s, date: dateStr })); clearValidate('date') }}
          />
          {formErrors.date && <p className="mb-0 text-red-500 mt-0.5 text-[12px]">{formErrors.date}</p>}
        </div>

        <div className="col-span-3 mb-4">
          <label><span className="text-red-500">*</span> Nhà cung cấp</label>
          <Select
            value={formState.customerId}
            options={customerStore.customerOptions}
            filterOption={customFilter}
            showSearch
            placeholder="Chọn nhà cung cấp"
            className="w-full mt-1"
            onChange={(val) => { setFormState((s) => ({ ...s, customerId: val })); clearValidate('customerId') }}
          />
          {formErrors.customerId && <p className="mb-0 text-red-500 mt-0.5 text-[12px]">{formErrors.customerId}</p>}
        </div>

        <div className="col-span-3 mb-4">
          <label><span className="text-red-500">*</span> Thuộc tính</label>
          <Select
            value={formState.propertyIds}
            allowClear
            options={propertyStore.propertyOptions}
            placeholder="Chọn thuộc tính"
            maxTagCount="responsive"
            className="w-full mt-1"
            mode="multiple"
            filterOption={customFilter}
            onSelect={selectProperty}
            onDeselect={deselectProperty}
            onChange={(val) => { setFormState((s) => ({ ...s, propertyIds: val })); clearValidate('propertyIds') }}
          />
          {formErrors.propertyIds && <p className="mb-0 text-red-500 mt-0.5 text-[12px]">{formErrors.propertyIds}</p>}
        </div>

        <div className="col-span-3 flex justify-end pt-[24px]">
          <Button type="primary" ghost className="flex items-center" onClick={initFormOptions}>
            <Icon icon="bx:reset" width="16px" />
            <span className="ml-2">Làm mới</span>
          </Button>
          <Button type="primary" ghost className="min-w-[120px] flex items-center ml-4" onClick={addDebtItem}>
            <Icon icon="mdi:plus-circle" width="16px" />
            <span className="ml-2">Thêm sản phẩm</span>
          </Button>
        </div>
      </div>

      <div className="flex justify-between my-8">
        <div>
          <b>Danh sách sản phẩm:</b>
          <span className="font-normal ml-2">{formState.items.length} sản phẩm</span>
          {formErrors.tableItems && <p className="mb-0 text-red-500 mt-0.5 text-[12px]">{formErrors.tableItems}</p>}
          {formErrors.items && formErrors.items.length !== 0 && (
            <p className="mb-0 text-red-500 mt-0.5 text-[12px]">Một trong số các trường bắt buộc của sản phẩm chưa được nhập</p>
          )}
        </div>
        <table className="summary-table">
          <tbody>
            <tr>
              <td>Tổng nhập cây/mét</td>
              <td>{formatCurrency(totalUnitPrice)}</td>
            </tr>
            <tr>
              <td>Tổng nhập</td>
              <td>{formatCurrency(totalPrice)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Table
        columns={columns}
        dataSource={formState.items}
        rowKey={(_, index) => index}
        scroll={{ x: 'max-content' }}
        pagination={false}
        rowClassName={getRowClassName}
        className={`add-debt__table${formState.type ? ` add-debt__table--${formState.type.toLowerCase()}` : ''}`}
        locale={{ emptyText: 'Dữ liệu trống' }}
      />
    </section>
  )
}
