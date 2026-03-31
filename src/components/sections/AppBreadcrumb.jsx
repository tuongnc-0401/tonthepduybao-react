import { Breadcrumb } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { MENU } from '~/modules/menu'
import { useCommonStore } from '~/stores/common'

export default function AppBreadcrumb() {
  const location = useLocation()
  const commonStore = useCommonStore()

  // breadcrumbs come from commonStore (set by pages)
  const breadcrumbs = commonStore.breadcrumbs || []

  const items = [
    {
      title: (
        <Link to={MENU.HOME.path} className="flex items-center">
          <Icon icon={MENU.HOME.icon} />
          <span className="ml-1">{MENU.HOME.name}</span>
        </Link>
      )
    },
    ...breadcrumbs.map((item, index) => ({
      title:
        index !== breadcrumbs.length - 1 ? (
          <Link to={item.path}>{item.name}</Link>
        ) : (
          <span>{item.name}</span>
        )
    }))
  ]

  return <Breadcrumb className="flex mb-4 bg-white px-8 py-4" items={items} />
}
