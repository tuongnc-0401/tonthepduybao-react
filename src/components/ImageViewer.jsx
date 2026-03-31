import { Avatar } from 'antd'
import { Icon } from '@iconify/react'
import { FALLBACK_IMAGE } from '~/modules/constant'
import { S3_URL } from '~/modules/http'

export default function ImageViewer({
  hasPrefix = false,
  scope = 'image',
  src = null,
  avatarSize = 160
}) {
  const prefix = hasPrefix ? S3_URL : ''
  const imageSrc = src ? `${prefix}${src}` : null

  if (scope === 'avatar') {
    return (
      <Avatar
        size={avatarSize}
        src={imageSrc}
        icon={
          <Icon
            icon="carbon:user-avatar-filled"
            className="text-white"
            width={`${avatarSize}px`}
          />
        }
      />
    )
  }

  return <img src={imageSrc || FALLBACK_IMAGE} alt="" />
}
