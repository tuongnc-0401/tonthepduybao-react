import instance from '../config/axios'

export default () => {
  const download = async (params) => {
    return await instance.get('/log/download', { params, responseType: 'blob' })
  }
  return { download }
}
