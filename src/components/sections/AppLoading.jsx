import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { useCommonStore } from '~/stores/common'

const indicator = <LoadingOutlined style={{ fontSize: 56 }} spin />

export default function AppLoading() {
  const isLoading = useCommonStore((s) => s.isLoading)

  if (!isLoading) return null

  return (
    <div
      className="absolute w-full h-full z-[99999] top-0 left-0 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
    >
      <Spin indicator={indicator} />
    </div>
  )
}
