import { useState, useEffect } from 'react'
import { Button, Input } from 'antd'
import { SaveFilled } from '@ant-design/icons'

export default function Editor({ title = '', value = '', editor = true, onSave }) {
  const [content, setContent] = useState(value)

  useEffect(() => {
    setContent(value)
  }, [value])

  return (
    <div>
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">{title}</h4>
        <Button type="link" onClick={() => onSave && onSave(content)}>
          <SaveFilled />
          <span>Lưu</span>
        </Button>
      </div>
      <Input.TextArea
        value={content}
        rows={5}
        onChange={(e) => setContent(e.target.value)}
      />
    </div>
  )
}
