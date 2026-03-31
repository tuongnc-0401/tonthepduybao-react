import { useMemo } from 'react'
import { useSiteSettingStore } from '~/stores/siteManagement/siteSetting'
import { SITE_SETTING } from '~/modules/constant'
import Editor from '~/components/common/Editor'

export default function HomeAboutUs() {
  const siteSettingStore = useSiteSettingStore()

  const aboutUs = useMemo(() => {
    return siteSettingStore.allSetting && siteSettingStore.allSetting.aboutUs
      ? siteSettingStore.allSetting.aboutUs
      : null
  }, [siteSettingStore.allSetting])

  const saveAboutUsContent = async (content) => {
    await siteSettingStore.saveSetting({
      settings: [{
        id: aboutUs ? aboutUs.id : null,
        masterKey: SITE_SETTING.MASTER_KEY.ABOUT_US,
        key: null,
        value: content
      }]
    })
  }

  return (
    <div>
      <Editor
        value={aboutUs ? aboutUs.value : ''}
        onSave={saveAboutUsContent}
      />
    </div>
  )
}
