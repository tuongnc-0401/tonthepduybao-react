import { Layout } from 'antd'
import { Outlet, Navigate } from 'react-router-dom'
import AppHeader from '~/components/sections/AppHeader'
import AppSidebar from '~/components/sections/AppSidebar'
import AppBreadcrumb from '~/components/sections/AppBreadcrumb'
import AppLoading from '~/components/sections/AppLoading'
import { useAuthStore } from '~/stores/auth'

export default function AuthLayout() {
  const isAuth = useAuthStore((s) => s.isAuth)
  if (!isAuth) return <Navigate to="/login" replace />

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Layout>
        <AppSidebar />
        <Layout
          className="app-container custom-scroll overflow-y-scroll relative p-8"
          style={{ maxHeight: 'calc(100vh - 64px)' }}
        >
          <AppBreadcrumb />
          <Layout.Content className="p-10 bg-white h-auto min-h-[unset] mb-14">
            <Outlet />
          </Layout.Content>
          <AppLoading />
        </Layout>
      </Layout>
    </Layout>
  )
}
