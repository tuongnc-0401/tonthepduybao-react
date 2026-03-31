import { useState } from 'react'
import { Layout, Menu } from 'antd'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { MENU } from '~/modules/menu'
import { useAuthStore } from '~/stores/auth'

const { Sider } = Layout

export default function AppSidebar() {
  const navigate = useNavigate()
  const authStore = useAuthStore()
  const [collapsed, setCollapsed] = useState(true)
  const [selectedKeys, setSelectedKeys] = useState([])

  const currentUserRole = authStore.getCurrentUserRole()

  const menuItems = Object.values(MENU)
    .filter(
      (item) =>
        !item.implicit && currentUserRole && item.permission.includes(currentUserRole.id)
    )
    .map((item) => ({
      key: item.id,
      icon: item.icon ? <Icon icon={item.icon} width="20px" /> : null,
      label: item.name,
      onClick: () => navigate(item.path)
    }))

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(v) => setCollapsed(v)}
      style={{ background: '#fff' }}
      width={240}
    >
      <Menu
        selectedKeys={selectedKeys}
        mode="inline"
        style={{ height: '100%', borderRight: 0 }}
        items={menuItems}
        onSelect={({ key }) => setSelectedKeys([key])}
      />
    </Sider>
  )
}
