import instance from '../config/axios'

export default () => {
  const getAll = async (params) => {
    return await instance.get('/product-category/all', { params })
  }
  const upsert = async (payload) => {
    await instance.post('/product-category/upsert', payload)
  }
  return { getAll, upsert }
}
