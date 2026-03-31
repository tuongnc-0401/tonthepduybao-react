import instance from '../config/axios'

export default () => {
  const getAll = async (payload) => {
    return await instance.get('/shipping-address/all', { params: payload })
  }
  const upsert = async (payload) => {
    await instance.post('/shipping-address/upsert', payload)
  }
  const updateDefault = async (payload) => {
    await instance.put(`/shipping-address/default/${payload.id}`, null, {
      params: { customerId: payload.customerId }
    })
  }
  const del = async (id) => {
    await instance.delete(`/shipping-address/${id}`)
  }
  return { getAll, upsert, updateDefault, del }
}
