import { useState, useEffect, useMemo } from 'react'
import { Table, Button, Popover, Checkbox } from 'antd'
import { cloneDeep } from 'lodash'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'
import { useMessage, useMoment } from '~/composables'
import { MSG, PAGING, TYPE } from '~/modules/constant'
import { MENU } from '~/modules/menu'
import { LIST_PRODUCT_TABLE_COLUMNS } from '~/modules/table'
import { downloadFromResponse } from '~/modules/utils'
import { useBranchStore } from '~/stores/branch'
import { useProductStore } from '~/stores/product'
import Heading from '~/components/common/Heading'

export default function ListProduct() {
  const navigate = useNavigate()
  const mc = useMessage()
  const moment = useMoment()
  const productStore = useProductStore()
  const branchStore = useBranchStore()

  const initialFilter = { search: '', type: [], branchId: [] }
  const [filter, setFilter] = useState(cloneDeep(initialFilter))
  const [currentPage, setCurrentPage] = useState(PAGING.DEFAULT_PAGE)
  const [selectedKeys, setSelectedKeys] = useState([])

  const products = productStore.allProduct?.data || []

  const isFiltering = useMemo(() => {
    const { search, branchId, type } = filter
    return search || branchId.length !== 0 || type.length !== 0
  }, [filter])

  const selectedBranch = useMemo(
    () =>
      branchStore.allBranch
        .filter((item) => filter.branchId.includes(item.id))
        .map((item) => item.name)
        .join(', '),
    [branchStore.allBranch, filter.branchId]
  )

  const selectedType = useMemo(
    () =>
      Object.values(TYPE)
        .filter((item) => filter.type.includes(item.value))
        .map((item) => item.label)
        .join(', '),
    [filter.type]
  )

  const init = async (page = PAGING.DEFAULT_PAGE, pageSize = PAGING.DEFAULT_PAGE_SIZE) => {
    setCurrentPage(page)
    const { search, branchId, type } = filter
    await productStore.getAll({
      search,
      branchId: branchId.join(','),
      type: type.join(','),
      page,
      pageSize
    })
  }

  useEffect(() => {
    init(currentPage)
    branchStore.getAll()
  }, [])

  const downloadProduct = async (ids) => {
    try {
      const { headers, data } = await productStore.download({ ids: ids.join(',') })
      downloadFromResponse(headers, data)
      mc.success(MSG.DOWNLOAD_SUCCESS)
    } catch {
      mc.error(MSG.DOWNLOAD_FAILED)
    }
  }

  const reset = () => {
    setFilter(cloneDeep(initialFilter))
    init()
  }

  const columns = LIST_PRODUCT_TABLE_COLUMNS.map((col) => {
    if (col.key === 'branch') {
      return {
        ...col,
        title: (
          <div className="flex items-center">
            <Popover
              trigger="click"
              placement="bottom"
              content={
                branchStore.branchOptions.length !== 0 && (
                  <Checkbox.Group
                    options={branchStore.branchOptions}
                    value={filter.branchId}
                    className="flex flex-col"
                    onChange={(val) => {
                      setFilter((f) => ({ ...f, branchId: val }))
                      init(currentPage)
                    }}
                  />
                )
              }
            >
              <Icon icon="mdi:filter" className="cursor-pointer outline-none" width="14px" />
            </Popover>
            <span className="ml-4">{col.title}</span>
          </div>
        ),
        render: (_, record) => <span>{record.branch?.name}</span>
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
                    onChange={(val) => {
                      setFilter((f) => ({ ...f, type: val }))
                      init(currentPage)
                    }}
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
    if (col.key === 'id') {
      return { ...col, render: (_, record) => <span className="font-bold">{record.id}</span> }
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
            <Button
              type="link"
              onClick={() => navigate(MENU.PRODUCT_DETAIL.path + record.id)}
            >
              <Icon icon="mdi:eye" width="24px" />
            </Button>
          </div>
        )
      }
    }
    return col
  })

  return (
    <section>
      <Heading title={MENU.PRODUCT.name}>
        <div className="flex items-center">
          <input
            placeholder="Tìm kiếm sản phẩm ..."
            className="mr-4 w-[400px] border border-gray-300 rounded px-3 py-1"
            value={filter.search}
            onChange={(e) => setFilter((f) => ({ ...f, search: e.target.value }))}
            onKeyPress={(e) => e.key === 'Enter' && init(currentPage)}
          />
          <Button
            type="primary"
            className="flex items-center"
            onClick={() => navigate(MENU.CREATE_PRODUCT.path)}
          >
            <Icon icon="mdi:plus-circle" width="16px" />
            <span className="ml-2">Thêm sản phẩm</span>
          </Button>
          {selectedKeys.length !== 0 && (
            <Button
              type="primary"
              className="flex items-center ml-4"
              onClick={() => downloadProduct(selectedKeys)}
            >
              <Icon icon="mdi:file-excel" />
              <span className="ml-2">Tải xuống</span>
            </Button>
          )}
        </div>
      </Heading>

      {isFiltering && (
        <div className="mt-8 mb-4 flex border border-solid border-neutral-200 rounded-md justify-between p-4">
          <div>
            <p className="mb-1">Tiêu chí tìm kiếm:</p>
            <div className="mb-0 pl-8">
              {filter.search && (
                <p className="mb-1">
                  Nội dung: <span className="font-semibold">{filter.search}</span>
                </p>
              )}
              {filter.type.length !== 0 && (
                <div className="flex items-center">
                  <Icon icon="mdi:format-list-bulleted-type" className="mr-2" />
                  <span className="mr-2">Phân loại:</span>
                  <span className="font-semibold">{selectedType}</span>
                </div>
              )}
              {filter.branchId.length !== 0 && (
                <div className="flex items-center">
                  <Icon icon="mdi:account" className="mr-2" />
                  <span className="mr-2">Chi nhánh:</span>
                  <span className="font-semibold">{selectedBranch}</span>
                </div>
              )}
            </div>
          </div>
          <Button type="primary" className="flex items-center" onClick={reset}>
            <Icon icon="tabler:zoom-reset" width="16px" />
            <span className="ml-2">Làm mới</span>
          </Button>
        </div>
      )}

      <p className="text-red-500 font-semibold mb-2 mt-4">
        Tổng số: {productStore.allProduct?.totalItems || 0} sản phẩm
      </p>

      <Table
        rowKey={(record) => record.id}
        columns={columns}
        scroll={{ x: 'max-content' }}
        rowSelection={{
          onChange: (selectedRowKeys) => setSelectedKeys(selectedRowKeys)
        }}
        pagination={{
          current: currentPage,
          total: productStore.allProduct?.totalItems,
          pageSize: productStore.allProduct?.pageSize,
          onChange: init
        }}
        dataSource={products}
      />
    </section>
  )
}
