import { useState, useEffect } from 'react'
import { Modal, Form, Input } from 'antd'
import { cloneDeep, isNil } from 'lodash'
import { useSitePartnerStore } from '~/stores/siteManagement/sitePartner'
import { S3_URL } from '~/modules/http'

export default function UpsertSitePartnerModal({ partner = null, onClose }) {
  const [form] = Form.useForm()
  const sitePartnerStore = useSitePartnerStore()
  const isEdit = !isNil(partner)
  const [logoFile, setLogoFile] = useState(null)
  const [logoSrc, setLogoSrc] = useState('')

  useEffect(() => {
    if (isEdit) {
      form.setFieldsValue({ name: partner.name })
      setLogoSrc(S3_URL + partner.logo)
    } else {
      form.resetFields()
    }
  }, [])

  const selectImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setLogoFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setLogoSrc(ev.target.result)
    reader.readAsDataURL(file)
  }

  const onFinish = async (values) => {
    const formData = new FormData()
    if (isEdit) formData.append('id', partner.id)
    formData.append('name', values.name)
    if (isEdit && !logoFile) formData.append('logo', partner.logo)
    if (logoFile) formData.append('logoFile', logoFile)
    await sitePartnerStore.upsertPartner(formData)
    onClose()
  }

  return (
    <Modal
      open
      centered
      width="40vw"
      title={`${isEdit ? 'Sửa' : 'Thêm mới'} đối tác`}
      okText="Lưu"
      cancelText="Đóng"
      onOk={() => form.submit()}
      onCancel={onClose}
    >
      <Form form={form} layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} onFinish={onFinish}>
        <Form.Item hasFeedback label="Tên đối tác" name="name" rules={[{ required: true, message: 'Tên đối tác là bắt buộc' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Logo" name="logo">
          <div>
            <input type="file" accept="image/*" onChange={selectImage} />
            {logoSrc && <img src={logoSrc} alt="logo preview" style={{ width: '50%', marginTop: 8 }} />}
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
}
