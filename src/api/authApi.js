import instance from '../config/axios'

export default () => {
  const login = async (payload) => {
    return await instance.post('/auth/login', payload)
  }
  return { login }
}
