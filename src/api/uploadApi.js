import instance from '../config/axios'

export default () => {
  const upload = async (payload) => {
    return await instance.post('/upload', payload, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
  const remove = async (params) => {
    return await instance.delete('/upload', { params })
  }
  return { upload, remove }
}
