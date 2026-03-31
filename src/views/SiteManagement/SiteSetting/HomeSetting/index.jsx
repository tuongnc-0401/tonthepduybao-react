import { useMemo } from 'react'
import { useSiteSettingStore } from '~/stores/siteManagement/siteSetting'
import { SITE_SETTING } from '~/modules/constant'
import Editor from '~/components/common/Editor'
import HomeBanner from './HomeBanner'
import HomeProductCategory from './HomeProductCategory'

export default function HomeSetting() {
  const siteSettingStore = useSiteSettingStore()

  const homeSetting = useMemo(() => {
    if (!siteSettingStore.allSetting) return { aboutUs: null, partner: null, contactUs: null }
    const { allSetting } = siteSettingStore
    return {
      aboutUs: allSetting.homeAboutUs || null,
      partner: allSetting.homePartner || null,
      contactUs: allSetting.homeContactUs || null
    }
  }, [siteSettingStore.allSetting])

  const saveContent = async (setting, content, key) => {
    await siteSettingStore.saveSetting({
      settings: [{
        id: setting ? setting.id : null,
        masterKey: SITE_SETTING.MASTER_KEY.HOME,
        key,
        value: content
      }]
    })
  }

  return (
    <section>
      <HomeBanner />

      <Editor
        title="2. Về chúng tôi"
        className="mt-8"
        value={homeSetting.aboutUs ? homeSetting.aboutUs.value : ''}
        editor={false}
        onSave={(content) => saveContent(homeSetting.aboutUs, content, SITE_SETTING.KEY.ABOUT_US)}
      />

      <HomeProductCategory />

      <Editor
        title="4. Đối tác"
        className="mt-8"
        editor={false}
        value={homeSetting.partner ? homeSetting.partner.value : ''}
        onSave={(content) => saveContent(homeSetting.partner, content, SITE_SETTING.KEY.PARTNER)}
      />

      <Editor
        title="5. Liên hệ"
        className="mt-8"
        editor={false}
        value={homeSetting.contactUs ? homeSetting.contactUs.value : ''}
        onSave={(content) => saveContent(homeSetting.contactUs, content, SITE_SETTING.KEY.CONTACT_US)}
      />
    </section>
  )
}
