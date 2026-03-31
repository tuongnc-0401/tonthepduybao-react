import instance from '../config/axios'

export default () => {
  const create = async (payload) => {
    await instance.post('/product/create', payload)
  }
  const createAll = async (payload) => {
    await instance.post('/product/create-all', payload)
  }
  const get = async (id) => {
    return await instance.get(`/product/${id}`)
  }
  const del = async (id) => {
    await instance.delete(`/product/${id}`)
  }
  const deleteAll = async (params) => {
    await instance.delete(`/product/delete-all`, { params })
  }
  const getAll = async (params) => {
    return await instance.get('/product/all', { params })
  }
  const getAllOption = async (params) => {
    return await instance.get('/product/all-option', { params })
  }
  return { create, createAll, get, del, deleteAll, getAll, getAllOption }
}
