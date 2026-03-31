import { Image } from 'antd'
import { CloseCircleFilled } from '@ant-design/icons'
import { FALLBACK_IMAGE } from '~/modules/constant'

export default function ImageDeletable({ src, width = null, onDelete }) {
  return (
    <div className="relative" style={{ width: width || 'auto' }}>
      <Image src={src} className="shadow-md w-full h-full" fallback={FALLBACK_IMAGE} />
      <span
        className="absolute -top-4 -right-4 text-5xl bg-white rounded-full text-red-500 z-10 cursor-pointer"
        onClick={onDelete}
      >
        <CloseCircleFilled />
      </span>
    </div>
  )
}
