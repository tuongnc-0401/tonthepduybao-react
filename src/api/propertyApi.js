import instance from '../config/axios'

export default () => {
  const getAll = async (params) => {
    return await instance.get('/property/all', { params })
  }
  const getAllByType = async (params) => {
    return await instance.get('/property/all-by-type', { params })
  }
  const create = async (data) => {
    await instance.post('/property', data)
  }
  const update = async (data) => {
    await instance.put('/property', data)
  }
  const del = async (id) => {
    await instance.delete(`/property/${id}`)
  }
  return { getAll, getAllByType, create, update, del }
}
