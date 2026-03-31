import { useRef } from 'react'
import { Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import ImageDeletable from './ImageDeletable'

export default function ImagePicker({
  src = null,
  width = '',
  multiple = false,
  buttonType = 'primary',
  onChange
}) {
  const imagePickerRef = useRef()

  const selectImage = () => {
    imagePickerRef.current.click()
  }

  const deleteImage = () => {
    if (onChange) onChange({ src: '', file: null })
  }

  const renderImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve({ src: reader.result, file })
      reader.readAsDataURL(file)
    })
  }

  const pickImage = async (e) => {
    const files = e.target.files
    if (files && files.length !== 0) {
      if (multiple) {
        const results = []
        for (let i = 0; i < files.length; i++) {
          const fileResult = await renderImage(files[i])
          results.push(fileResult)
        }
        if (onChange) onChange(results)
      } else {
        const result = await renderImage(files[0])
        if (onChange) onChange(result)
      }
    }
  }

  return (
    <div>
      {!src && (
        <Button type={buttonType} icon={<UploadOutlined />} onClick={selectImage}>
          Tải lên
        </Button>
      )}

      <input
        ref={imagePickerRef}
        type="file"
        accept="image/*"
        hidden
        multiple={multiple}
        onChange={pickImage}
      />

      {src && src.length > 0 && (
        <div>
          {multiple ? (
            src.map((item, index) => (
              <ImageDeletable key={index} src={item} width={width} onDelete={deleteImage} />
            ))
          ) : (
            <ImageDeletable src={src[0]} width={width} onDelete={deleteImage} />
          )}
        </div>
      )}
    </div>
  )
}
