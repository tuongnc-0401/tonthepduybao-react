import instance from '../config/axios'

export default () => {
  const getMe = async () => {
    return await instance.get('/user/me')
  }
  const get = async (id) => {
    return await instance.get(`/user/${id}`)
  }
  const getAll = async (params) => {
    return await instance.get('/user/all', { params })
  }
  const create = async (data) => {
    await instance.post('/user', data)
  }
  const update = async (data) => {
    await instance.put('/user', data)
  }
  const updateAvatar = async (formData) => {
    await instance.post('/user/update/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
  const getAllRole = async () => {
    return await instance.get('/user/roles')
  }
  const del = async (id) => {
    await instance.delete(`/user/${id}`)
  }
  return { getMe, get, getAll, create, update, updateAvatar, getAllRole, del }
}
