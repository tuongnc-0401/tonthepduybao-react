import { useState, useEffect } from 'react'
import { Button, Modal } from 'antd'
import { Icon } from '@iconify/react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMessage, useMoment } from '~/composables'
import { MSG, NOT_FOUND_PATH, TYPE, TYPE_KEY } from '~/modules/constant'
import { MENU } from '~/modules/menu'
import { useCommonStore } from '~/stores/common'
import { useProductStore } from '~/stores/product'
import Heading from '~/components/common/Heading'

export default function ProductDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const mc = useMessage()
  const moment = useMoment()
  const productStore = useProductStore()
  const commonStore = useCommonStore()
  const [isShowConfirm, setIsShowConfirm] = useState(false)

  const product = productStore.product

  useEffect(() => {
    if (!id) { navigate(NOT_FOUND_PATH); return }
    const load = async () => {
      try {
        await productStore.get(id)
        const p = productStore.product
        commonStore.setBreadcrumbs([
          MENU.PRODUCT,
          { name: p.name, path: MENU.PRODUCT_DETAIL.path + p.id }
        ])
      } catch {
        navigate(MENU.PRODUCT.path)
      }
    }
    load()
    return () => commonStore.setBreadcrumbs([])
  }, [id])

  const deleteProduct = async () => {
    try {
      await productStore.del(product.id)
      setIsShowConfirm(false)
      mc.success(MSG.DELETE_SUCCESS)
      navigate(MENU.PRODUCT.path)
    } catch {
      mc.error(MSG.DELETE_FAILED)
    }
  }

  if (!product) return null

  return (
    <section>
      <Heading title={`Sản phẩm: ${product.name}`}>
        <div className="flex items-center">
          <Button type="primary" danger className="flex items-center px-8" onClick={() => setIsShowConfirm(true)}>
            <Icon icon="mdi:trash-can" />
            <span className="ml-2">Xoá</span>
          </Button>
          <Button type="primary" className="flex items-center px-8 ml-4" onClick={() => navigate(MENU.EDIT_PRODUCT.path + product.id)}>
            <Icon icon="mdi:pencil-box-outline" />
            <span className="ml-2">Sửa</span>
          </Button>
        </div>
      </Heading>

      <div className="grid grid-cols-12 gap-x-8 mt-8">
        <div className="grid grid-cols-2 gap-8 col-span-8 border border-solid border-gray-200 rounded-md p-4">
          <div>
            <div className="flex items-center mb-2">
              <Icon icon="mdi:calendar" className="mr-2" />
              <span className="mr-2">Ngày tạo:</span>
              <span className="font-semibold">{moment.dFormat(product.date)}</span>
            </div>
            <div className="flex items-center mb-2">
              <Icon icon="mdi:format-list-bulleted-type" className="mr-2" />
              <span className="mr-2">Phân loại:</span>
              <span className="font-semibold">{TYPE[product.type]?.label}</span>
            </div>
            <div className="flex items-center">
              <Icon icon="mdi:store-marker-outline" className="mr-2" />
              <span className="mr-2">Chi nhánh:</span>
              <span className="font-semibold">{product.branch?.name}</span>
            </div>
          </div>
          <div className="font-medium">
            <div className="flex mb-2">
              <div className="flex">
                <Icon icon="mdi:calendar" className="mr-2 mt-2" />
                <span className="mr-2">Chỉnh sửa gần đây:</span>
              </div>
              <div className="font-semibold italic">
                {moment.mFormat(product.updatedAt)} <br /> bởi {product.updatedBy}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end col-span-4">
          <table className="summary-table w-full h-full">
            <tbody>
              <tr>
                <td className="font-medium">Số lượng</td>
                <td>{product.quantity}</td>
              </tr>
              <tr>
                <td className="font-medium">Thuộc tính</td>
                <td>{product.properties?.map((p) => p.name).join(', ')}</td>
              </tr>
              {product.type === TYPE_KEY.CORRUGATED && (
                <>
                  <tr>
                    <td className="font-medium">Khổ/quy cách (mm)</td>
                    <td>{product.size}</td>
                  </tr>
                  <tr>
                    <td className="font-medium">Diện tích (m2)</td>
                    <td>{product.sizeCalculator}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={isShowConfirm}
        okText="Có"
        cancelText="Không"
        centered
        okButtonProps={{ type: 'primary', danger: true, className: 'px-10' }}
        onOk={deleteProduct}
        onCancel={() => setIsShowConfirm(false)}
      >
        <div className="flex items-center">
          <Icon icon="ph:warning-fill" className="text-red-500 mr-4" width="20px" />
          <span>Bạn có chắc muốn xoá sản phẩm này không?</span>
        </div>
      </Modal>
    </section>
  )
}
