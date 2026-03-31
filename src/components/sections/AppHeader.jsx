import { Layout, Popover, Avatar } from 'antd'
import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { useAuthStore } from '~/stores/auth'
import { MENU } from '~/modules/menu'
import ImageViewer from '~/components/ImageViewer'

const { Header } = Layout

export default function AppHeader() {
  const authStore = useAuthStore()
  const currentUser = authStore.currentUser

  const popoverContent = (
    <ul className="min-w-[160px] list-none px-4 py-2 m-0">
      <li className="mb-4">
        <Link to={MENU.PROFILE.path} className="text-slate-900">
          Tài khoản
        </Link>
      </li>
      <li className="text-red-500 cursor-pointer" onClick={() => authStore.logout()}>
        Đăng xuất
      </li>
    </ul>
  )

  return (
    <Header className="flex items-center justify-between px-6">
      <Link to="/" className="flex items-center">
        <img src="/img/white-logo.png" width={100} alt="logo" />
      </Link>

      <Popover content={popoverContent} placement="bottomRight">
        <div className="flex items-center cursor-pointer">
          <ImageViewer scope="avatar" avatarSize={40} hasPrefix src={currentUser?.avatar} />
          <span className="text-white ml-4 mr-8 cursor-pointer font-medium">
            {currentUser?.fullName}
          </span>
        </div>
      </Popover>
    </Header>
  )
}
