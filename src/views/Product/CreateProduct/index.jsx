import { useState, useEffect } from 'react'
import { Button, Modal, Divider, Select, Input, DatePicker } from 'antd'
import { cloneDeep, isEmpty } from 'lodash'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'
import { useMessage, useMoment } from '~/composables'
import { MSG, TYPE, TYPE_KEY } from '~/modules/constant'
import { MENU } from '~/modules/menu'
import { customFilter } from '~/modules/utils'
import { useBranchStore } from '~/stores/branch'
import { useProductStore } from '~/stores/product'
import { usePropertyStore } from '~/stores/property'
import Heading from '~/components/common/Heading'
import dayjs from 'dayjs'

export default function CreateProduct() {
  const navigate = useNavigate()
  const mc = useMessage()
  const moment = useMoment()
  const productStore = useProductStore()
  const branchStore = useBranchStore()
  const propertyStore = usePropertyStore()

  const initFormState = {
    name: '',
    type: TYPE_KEY.IRON,
    parent: null,
    properties: {},
    date: '',
    branch: null,
    quantity: 0,
    size: 0,
    sizeCalculator: 0
  }

  const [formState, setFormState] = useState(cloneDeep(initFormState))
  const [formErrors, setFormErrors] = useState({})
  const [selectedProperties, setSelectedProperties] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const clearValidate = (errorName) => {
    setFormErrors((prev) => {
      const next = { ...prev }
      delete next[errorName]
      return next
    })
  }

  const changeType = async (type) => {
    const t = type || formState.type
    await propertyStore.getAll({ type: t })
    const sortedProperties = [...propertyStore.allProperty].sort((a, b) => a.orderBy - b.orderBy)
    setSelectedProperties(sortedProperties)
    const props = {}
    sortedProperties.forEach((item) => (props[item.id] = null))
    setFormState((s) => ({ ...s, properties: props }))
    clearValidate('type')
  }

  const calSizeCalculator = (size, quantity, type) => {
    if (TYPE_KEY.CORRUGATED === type && size && quantity) {
      setFormState((s) => ({ ...s, sizeCalculator: (size / 1000) * quantity }))
    }
  }

  const validate = () => {
    const errors = {}
    const { name, type, properties, date, branch, quantity } = formState
    if (!name) errors.name = 'Tên sản phẩm là trường băt buộc'
    if (!type) errors.type = 'Loại sản phẩm là trường băt buộc'
    if (!date) errors.date = 'Ngày nhập là trường băt buộc'
    if (!branch) errors.branch = 'Chi nhánh là trường băt buộc'
    if (!quantity) errors.quantity = 'Số lượng là trường băt buộc'
    if (!properties || Object.values(properties).length === 0)
      errors.properties = 'Thuộc tính là trường băt buộc'
    setFormErrors(errors)
    return isEmpty(errors)
  }

  const submit = async () => {
    setIsSubmitting(true)
    const isValid = validate()
    if (isValid) {
      const { name, type, parent, properties, date, branch, quantity, size, sizeCalculator } = formState
      try {
        await productStore.create({ name: name.trim(), type, properties, parent, date, branch, quantity, size, sizeCalculator })
        setFormState(cloneDeep(initFormState))
        mc.success(MSG.SAVE_SUCCESS)
        navigate(MENU.PRODUCT.path)
      } catch {
        mc.error(MSG.SAVE_FAILED)
        setIsSubmitting(false)
      }
    } else {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    branchStore.getAll()
    changeType(TYPE_KEY.IRON)
  }, [])

  return (
    <section>
      <Heading title={MENU.CREATE_PRODUCT.name} className="items-start">
        <div className="flex items-center mb-4">
          <Button className="w-[120px] flex items-center justify-center" onClick={() => navigate(-1)}>
            Huỷ bỏ
          </Button>
          <Button type="primary" className="w-[120px] ml-4 mr-0 flex items-center justify-center" onClick={submit}>
            <Icon icon="mdi:content-save" />
            <span className="ml-2">Thêm</span>
          </Button>
        </div>
      </Heading>

      <p className="text-right italic mb-0 mt-2 text-xl text-red-500">(*) Là các trường bắt buộc</p>

      <div className="grid grid-cols-12 gap-x-8 mt-2">
        <div className="col-span-6">
          <label><span className="text-red-500">*</span> Tên sản phẩm</label>
          <Input
            value={formState.name}
            placeholder="Nhập tên sản phẩm"
            maxLength={500}
            showCount
            onChange={(e) => { setFormState((s) => ({ ...s, name: e.target.value })); clearValidate('name') }}
          />
          {formErrors.name && <p className="mb-0 text-red-500 mt-0.5 text-[12px]">{formErrors.name}</p>}
        </div>
        <div className="col-span-3">
          <label><span className="text-red-500">*</span> Danh mục</label>
          <Select
            value={formState.type}
            allowClear
            options={Object.values(TYPE)}
            placeholder="Chọn loại sản phẩm"
            className="w-full"
            onChange={(val) => { setFormState((s) => ({ ...s, type: val })); changeType(val) }}
          />
          {formErrors.type && <p className="mb-0 text-red-500 mt-0.5 text-[12px]">{formErrors.type}</p>}
        </div>
        <div className="col-span-3">
          <label>Sản phẩm gốc</label>
          <Select
            value={formState.parent}
            allowClear
            options={[]}
            placeholder="Chọn sản phẩm gốc"
            className="w-full"
            onChange={(val) => setFormState((s) => ({ ...s, parent: val }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-x-8 mt-8">
        <div className="col-span-3">
          <label><span className="text-red-500">*</span> Ngày nhập</label>
          <DatePicker
            placeholder="Chọn ngày"
            format={moment.MOMENT_FORMAT.YYYY_MM_DD}
            value={formState.date ? dayjs(formState.date, moment.MOMENT_FORMAT.YYYYMMDD) : null}
            className="w-full"
            onChange={(_, dateStr) => { setFormState((s) => ({ ...s, date: dateStr })); clearValidate('date') }}
          />
          {formErrors.date && <p className="mb-0 text-red-500 mt-0.5 text-[12px]">{formErrors.date}</p>}
        </div>
        <div className="col-span-3">
          <label><span className="text-red-500">*</span> Chi nhánh</label>
          <Select
            value={formState.branch}
            allowClear
            options={branchStore.getBranchOptions()}
            placeholder="Chọn chi nhánh"
            className="w-full"
            onChange={(val) => { setFormState((s) => ({ ...s, branch: val })); clearValidate('branch') }}
          />
          {formErrors.branch && <p className="mb-0 text-red-500 mt-0.5 text-[12px]">{formErrors.branch}</p>}
        </div>
        <div className="col-span-3">
          <label><span className="text-red-500">*</span> Số lượng</label>
          <Input
            type="number"
            min={0}
            value={formState.quantity}
            onChange={(e) => {
              const q = e.target.value
              setFormState((s) => ({ ...s, quantity: q }))
              calSizeCalculator(formState.size, q, formState.type)
            }}
          />
          {formErrors.quantity && <p className="mb-0 text-red-500 mt-0.5 text-[12px]">{formErrors.quantity}</p>}
        </div>
      </div>

      {formState.type === TYPE_KEY.CORRUGATED && (
        <div className="grid grid-cols-12 gap-x-8 mt-8">
          <div className="col-span-3">
            <label>Khổ/quy cách (mm)</label>
            <Input
              type="number"
              min={0}
              value={formState.size}
              onChange={(e) => {
                const sz = e.target.value
                setFormState((s) => ({ ...s, size: sz }))
                calSizeCalculator(sz, formState.quantity, formState.type)
              }}
            />
          </div>
          <div className="col-span-3">
            <label>Diện tích (m2)</label>
            <Input value={formState.sizeCalculator} disabled />
          </div>
        </div>
      )}

      <Divider orientation="left" className="mt-8 mb-4" orientationMargin="0">
        <span className="text-red-500">*</span>
        <span className="ml-2 text-xl font-medium">Thuộc tính</span>
      </Divider>

      <div>
        <div className="grid grid-cols-12 gap-x-20 gap-y-8 mt-4">
          {selectedProperties.map((prop) => (
            <div key={prop.id} className="col-span-3 flex items-center">
              <span className="mr-4 w-[160px] font-semibold">{prop.name}:</span>
              <Select
                value={formState.properties[prop.id]}
                allowClear
                options={prop.items.map((item) => ({ label: item.name, value: item.id }))}
                placeholder={`Chọn ${prop.name}`}
                showSearch
                filterOption={customFilter}
                className="w-full"
                onChange={(val) => {
                  setFormState((s) => ({ ...s, properties: { ...s.properties, [prop.id]: val } }))
                  clearValidate('properties')
                }}
              />
            </div>
          ))}
        </div>
        {formErrors.properties && (
          <p className="mb-0 text-red-500 mt-0.5 text-[12px]">{formErrors.properties}</p>
        )}
      </div>
    </section>
  )
}
