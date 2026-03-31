import moment from 'moment'

export const useMoment = () => {
  const MOMENT_FORMAT = {
    YYYYMMDD: 'YYYYMMDD',
    YYYYMMDDHHmmss: 'YYYYMMDDHHmmss',
    YYYY_MM_DD: 'DD/MM/YYYY',
    YYYY_MM_DD_HH_mm_ss: 'DD/MM/YYYY HH:mm:ss'
  }

  const dFormat = (value) => {
    return moment(value, MOMENT_FORMAT.YYYYMMDD).format(MOMENT_FORMAT.YYYY_MM_DD)
  }

  const mFormat = (value) => {
    return moment(value, MOMENT_FORMAT.YYYYMMDDHHmmss).format(MOMENT_FORMAT.YYYY_MM_DD_HH_mm_ss)
  }

  const mBuild = (value) => {
    return moment(value, MOMENT_FORMAT.YYYY_MM_DD_HH_mm_ss).format(MOMENT_FORMAT.YYYYMMDDHHmmss)
  }

  return {
    moment,
    MOMENT_FORMAT,
    dFormat,
    mFormat,
    mBuild
  }
}
