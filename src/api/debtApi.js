import instance from '../config/axios'

export default () => {
  const get = async (id) => {
    return await instance.get(`/debt/${id}`)
  }
  const getAll = async (params) => {
    return await instance.get('/debt/all', { params })
  }
  const create = async (data) => {
    await instance.post('/debt', data)
  }
  const createFromFile = async (payload) => {
    return await instance.post('/debt/file', payload, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
  const update = async (data) => {
    await instance.put('/debt', data)
  }
  const del = async (id) => {
    await instance.delete(`/debt/${id}`)
  }
  const download = async (params) => {
    return await instance.get('/debt/download', { params, responseType: 'blob' })
  }
  const downloadTemplate = async (params) => {
    return await instance.get('/debt/download/template', { params, responseType: 'blob' })
  }
  return { get, getAll, create, createFromFile, update, del, download, downloadTemplate }
}
