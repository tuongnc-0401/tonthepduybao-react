import instance from '../config/axios'

export default () => {
  const getAll = async () => {
    return await instance.get('/branch/public/all')
  }
  const upsert = async (payload) => {
    await instance.post('/branch/upsert', payload)
  }
  return { getAll, upsert }
}
