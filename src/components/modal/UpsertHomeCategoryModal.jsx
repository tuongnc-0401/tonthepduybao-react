import { useState, useEffect } from 'react'
import { Modal, Form, Input, Select } from 'antd'
import { cloneDeep, isNil } from 'lodash'
import { useSiteCategoryStore } from '~/stores/siteManagement/siteCategory'
import { useSiteSettingStore } from '~/stores/siteManagement/siteSetting'
import { useUploadStore } from '~/stores/upload'
import { SITE_SETTING } from '~/modules/constant'
import { S3_URL } from '~/modules/http'

export default function UpsertHomeCategoryModal({ productCategory = null, onClose }) {
  const [form] = Form.useForm()
  const siteCategoryStore = useSiteCategoryStore()
  const siteSettingStore = useSiteSettingStore()
  const uploadStore = useUploadStore()

  const isEdit = !isNil(productCategory)
  const [imageFile, setImageFile] = useState(null)
  const [imageSrc, setImageSrc] = useState('')

  useEffect(() => {
    siteCategoryStore.getCategoryOptions()
    if (isEdit) {
      form.setFieldsValue({ categoryId: productCategory.categoryId })
      setImageSrc(S3_URL + productCategory.image)
    }
  }, [])

  const selectImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setImageSrc(ev.target.result)
    reader.readAsDataURL(file)
  }

  const onFinish = async (values) => {
    let endpoints = []
    if (imageFile) {
      const formData = new FormData()
      formData.append('directory', SITE_SETTING.DIR.PRODUCT_CATEGORY)
      formData.append('files', imageFile)
      endpoints = await uploadStore.upload(formData, false)
    } else if (isEdit) endpoints = [S3_URL + productCategory.image]

    const category = siteCategoryStore.allCategory.find((item) => item.id === values.categoryId)
    const payload = endpoints.map((item) => ({
      id: isEdit ? productCategory.id : null,
      masterKey: SITE_SETTING.MASTER_KEY.HOME,
      key: SITE_SETTING.KEY.PRODUCT_CATEGORY,
      value: JSON.stringify({ category, image: item.replace(S3_URL, '') })
    }))
    await siteSettingStore.saveSetting({ settings: payload }, async () => {
      for (const ep of endpoints) {
        await uploadStore.delete({ path: ep }, false)
      }
    })
    onClose()
  }

  const filterOption = (input, option) => option.label.toLowerCase().includes(input.toLowerCase())

  return (
    <Modal
      open
      centered
      width="40vw"
      title={`${isEdit ? 'Sửa' : 'Thêm'} danh mục sản phẩm kinh doanh`}
      okText="Lưu"
      cancelText="Đóng"
      onOk={() => form.submit()}
      onCancel={onClose}
    >
      <Form form={form} layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} onFinish={onFinish}>
        <Form.Item hasFeedback label="Chọn danh mục" name="categoryId" rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}>
          <Select allowClear showSearch options={siteCategoryStore.parentOptions} filterOption={filterOption} />
        </Form.Item>
        <Form.Item label="Hình ảnh" name="image">
          <div>
            <input type="file" accept="image/*" onChange={selectImage} />
            {imageSrc && <img src={imageSrc} alt="preview" style={{ width: 100, marginTop: 8 }} />}
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
}
