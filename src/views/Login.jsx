import { useState, useEffect } from 'react'
import { Input, Select, Button, Row, Col, Image } from 'antd'
import { UserOutlined, KeyOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '~/stores/auth'
import { useBranchStore } from '~/stores/branch'

export default function Login() {
  const navigate = useNavigate()
  const authStore = useAuthStore()
  const branchStore = useBranchStore()

  const [formState, setFormState] = useState({ username: '', password: '', branchId: -1 })

  useEffect(() => {
    branchStore.getAll()
  }, [])

  useEffect(() => {
    if (authStore.isAuth) navigate('/')
  }, [authStore.isAuth])

  const login = async () => {
    const { username, password, branchId } = formState
    await authStore.login({
      username,
      password,
      branchId: branchId === -1 ? null : branchId
    })
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') login()
  }

  return (
    <main className="flex justify-center items-center w-screen h-screen bg-gray-100">
      <Row className="w-full flex justify-center">
        <Col span={6} className="bg-white p-8 rounded-md">
          <div className="w-full flex justify-center mb-10">
            <Image src="/img/logo.png" width={200} preview={false} />
          </div>
          <Input
            prefix={<UserOutlined />}
            placeholder="Tên đăng nhập"
            className="mb-2"
            value={formState.username}
            onChange={(e) => setFormState((s) => ({ ...s, username: e.target.value }))}
            onKeyPress={handleKeyPress}
          />
          <Input.Password
            prefix={<KeyOutlined />}
            placeholder="Mật khẩu"
            className="mb-2"
            value={formState.password}
            onChange={(e) => setFormState((s) => ({ ...s, password: e.target.value }))}
            onKeyPress={handleKeyPress}
          />
          <div className="w-full mb-4">
            <Select
              placeholder="Chọn chi nhánh"
              className="w-full"
              options={branchStore.allBranchOptions}
              value={formState.branchId}
              onChange={(val) => setFormState((s) => ({ ...s, branchId: val }))}
            />
          </div>
          <div className="w-full flex justify-center">
            <Button type="primary" onClick={login}>
              Đăng nhập
            </Button>
          </div>
        </Col>
      </Row>
    </main>
  )
}
