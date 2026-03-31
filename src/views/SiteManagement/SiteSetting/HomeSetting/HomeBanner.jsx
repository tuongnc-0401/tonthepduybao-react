import { useMemo } from 'react'
import { Image } from 'antd'
import { useSiteSettingStore } from '~/stores/siteManagement/siteSetting'
import { useUploadStore } from '~/stores/upload'
import { FALLBACK_IMAGE, SITE_SETTING } from '~/modules/constant'
import { S3_URL } from '~/modules/http'

export default function HomeBanner() {
  const siteSettingStore = useSiteSettingStore()
  const uploadStore = useUploadStore()

  const banners = useMemo(() => {
    if (!siteSettingStore.allSetting) return []
    return siteSettingStore.allSetting.homeBanners || []
  }, [siteSettingStore.allSetting])

  const selectBanner = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return

    const formData = new FormData()
    formData.append('directory', SITE_SETTING.DIR.BANNER)
    files.forEach((file) => formData.append('files', file))

    const endpoints = await uploadStore.upload(formData, false)
    const payload = endpoints.map((item) => ({
      masterKey: SITE_SETTING.MASTER_KEY.HOME,
      key: SITE_SETTING.KEY.BANNER,
      value: item.replace(S3_URL, '')
    }))
    await siteSettingStore.saveSetting({ settings: payload }, async () => {
      for (const ep of endpoints) {
        await uploadStore.delete({ path: ep }, false)
      }
    })
  }

  const deleteBanner = async (id, path) => {
    await uploadStore.delete({ path }, false)
    await siteSettingStore.deleteSetting(id)
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h4 className="font-semibold mb-0">1. Banner</h4>
        <label className="cursor-pointer text-blue-500 hover:text-blue-400">
          <input type="file" accept="image/*" multiple className="hidden" onChange={selectBanner} />
          Thêm banner
        </label>
      </div>

      {banners.length > 0 ? (
        <div className="grid grid-cols-4 gap-x-8 mt-4">
          {banners.map((item, index) => (
            <div key={index} className="relative">
              <Image src={S3_URL + item.value} fallback={FALLBACK_IMAGE} />
              <button
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                onClick={() => deleteBanner(item.id, item.value)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="italic mb-0">Chưa có banners!</p>
      )}
    </div>
  )
}
