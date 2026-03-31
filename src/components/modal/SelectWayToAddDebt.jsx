import { useState, useEffect, useRef } from 'react'
import { Modal, Select, Button, Divider } from 'antd'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'
import { useMessage } from '~/composables'
import { MSG, TYPE, TYPE_KEY } from '~/modules/constant'
import { MENU } from '~/modules/menu'
import { customFilter, downloadFromResponse } from '~/modules/utils'
import { useDebtStore } from '~/stores/debt'
import { usePropertyStore } from '~/stores/property'

export default function SelectWayToAddDebt({ onClose, onCallback }) {
  const navigate = useNavigate()
  const mc = useMessage()
  const debtStore = useDebtStore()
  const propertyStore = usePropertyStore()
  const fileRef = useRef()

  const [isCreateFromFile, setIsCreateFromFile] = useState(false)
  const [templateError, setTemplateError] = useState('')
  const [type, setType] = useState(TYPE_KEY.IRON)
  const [propertyIds, setPropertyIds] = useState([])
  const [errors, setErrors] = useState([])

  useEffect(() => {
    propertyStore.getAll({ type })
  }, [type])

  const validateDownloadTemplate = () => {
    if (!propertyIds || propertyIds.length === 0) {
      setTemplateError('Thuộc tính là các trường bắt buộc.')
      return false
    }
    setTemplateError('')
    return true
  }

  const downloadTemplateDebt = async () => {
    if (!validateDownloadTemplate()) return
    try {
      const { headers, data } = await debtStore.downloadTemplate({
        type,
        propertyIds: propertyIds.join(',')
      })
      downloadFromResponse(headers, data)
      mc.success(MSG.DOWNLOAD_SUCCESS)
    } catch (error) {
      mc.error(MSG.DOWNLOAD_FAILED)
    }
  }

  const uploadDebt = async (e) => {
    const files = e.target.files
    if (!files || files.length === 0) {
      mc.error('Vui lòng chọn file.')
    } else {
      try {
        const formData = new FormData()
        formData.append('file', files[0])
        const { data } = await debtStore.createFromFile(formData)
        setErrors(data)

        if (!data || data.length === 0) {
          mc.success(MSG.SAVE_SUCCESS)
          if (onCallback) onCallback()
          onClose()
        }
      } catch (error) {
        mc.error(MSG.SAVE_FAILED)
      }
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  const cancel = () => {
    setType(TYPE_KEY.IRON)
    setPropertyIds([])
    setIsCreateFromFile(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <Modal open centered width="auto" footer={false} onCancel={onClose}>
      <div className="py-8 px-24">
        <h3 className="text-3xl text-center mb-12">
          {isCreateFromFile ? 'Thêm công nợ từ file' : 'Chọn cách thêm công nợ'}
        </h3>

        {!isCreateFromFile ? (
          <div className="grid grid-cols-2 gap-x-20 justify-center">
            <div
              className="flex flex-col items-center w-[200px] pt-16 pb-12 bg-slate-200 hover:bg-slate-300 cursor-pointer transition-all rounded-lg"
              onClick={() => navigate(MENU.ADD_DEBT.path)}
            >
              <Icon icon="lucide:pen-square" width="72px" />
              <span className="mt-4 font-medium">Trên hệ thống</span>
            </div>
            <div
              className="flex flex-col items-center w-[200px] pt-16 pb-12 bg-slate-200 hover:bg-slate-300 cursor-pointer transition-all rounded-lg"
              onClick={() => setIsCreateFromFile(true)}
            >
              <Icon icon="material-symbols:upload-file" width="72px" />
              <span className="mt-4 font-medium">Từ file</span>
            </div>
          </div>
        ) : (
          <div className="max-w-[640px] min-w-[50vw]">
            <Divider orientation="left" orientationMargin="20px">
              <span className="text-xl font-medium">Tạo file mẫu</span>
            </Divider>
            <div>
              <div className="grid grid-cols-8 gap-x-8">
                <Select
                  value={type}
                  options={Object.values(TYPE)}
                  placeholder="Chọn danh mục"
                  className="col-span-2"
                  filterOption={customFilter}
                  onChange={(val) => setType(val)}
                />
                <Select
                  value={propertyIds}
                  options={propertyStore.getPropertyOptions()}
                  placeholder="Chọn thuộc tính"
                  className="col-span-4"
                  mode="multiple"
                  maxTagCount="responsive"
                  filterOption={customFilter}
                  onChange={setPropertyIds}
                />
                <Button
                  type="primary"
                  ghost
                  className="col-span-2 w-full"
                  onClick={downloadTemplateDebt}
                >
                  Tạo mẫu công nợ
                </Button>
              </div>
              {templateError && <p className="text-red-500 text-xl mt-1">{templateError}</p>}
            </div>

            <Divider orientation="left" orientationMargin="20px">
              <span className="text-xl font-medium">Tải file công nợ lên</span>
            </Divider>

            <div className="flex">
              <label
                htmlFor="debtFile"
                className="w-1/5 flex justify-center items-center border border-dashed rounded-lg min-h-[64px] cursor-pointer"
              >
                <input ref={fileRef} id="debtFile" type="file" hidden onChange={uploadDebt} />
                <Icon icon="octicon:plus-16" width="32px" />
              </label>
              {errors && errors.length !== 0 && (
                <ul className="w-4/5">
                  {errors.map((item, index) => (
                    <li key={index} className="text-red-500">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="w-full flex justify-center mt-8">
              <Button className="px-16" onClick={cancel}>
                Huỷ bỏ
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
