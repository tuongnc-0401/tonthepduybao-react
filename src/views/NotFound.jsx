import { Empty } from 'antd'

export default function NotFound() {
  return (
    <section
      className="h-full w-full flex items-center justify-center"
      style={{ minHeight: '100vh' }}
    >
      <Empty
        image="/img/notfound.png"
        imageStyle={{ height: 'auto' }}
        description={
          <p className="mt-2 mb-0 italic text-gray-600">
            Oops! Có vẻ như trang bạn đang tìm kiếm không tồn tại!
          </p>
        }
      />
    </section>
  )
}
