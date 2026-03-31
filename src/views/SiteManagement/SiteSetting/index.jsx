import { useState, useEffect } from 'react'
import { Tabs } from 'antd'
import { useSiteSettingStore } from '~/stores/siteManagement/siteSetting'
import Heading from '~/components/common/Heading'
import HomeSetting from './HomeSetting/index'
import HomeAboutUs from './HomeAboutUs/index'

export default function SiteSetting() {
  const siteSettingStore = useSiteSettingStore()
  const [activeTab, setActiveTab] = useState('home')

  useEffect(() => {
    siteSettingStore.getAllSetting()
  }, [])

  const tabItems = [
    {
      key: 'home',
      label: 'Trang chủ',
      children: <HomeSetting />
    },
    {
      key: 'aboutUs',
      label: 'Về chúng tôi',
      children: <HomeAboutUs />
    }
  ]

  return (
    <section>
      <Heading title="Cài đặt chung" />
      <Tabs
        activeKey={activeTab}
        type="card"
        items={tabItems}
        onChange={setActiveTab}
      />
    </section>
  )
}
