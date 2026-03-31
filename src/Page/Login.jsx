import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

function Login({setMember}) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.email || !form.password) {
      setError('กรุณากรอกอีเมลและรหัสผ่าน')
      return
    }

    setLoading(true)
    try {
      const res = await api.post("/members/login", {
        loginName: form.email,
        password: form.password
      }, { withCredentials: true })

      if (res.data.login) {
        setMember(res.data.user)

        // เช็ค dutyId → navigate ต่างกัน
        if (res.data.user.dutyId === 'admin') {
          navigate('/admin/dashboard')
        } else {
          navigate('/')
        }
      } else {
        setError(res.data.message)
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-black text-[#C41230]">
            ❁FIORE❁
          </Link>
          <p className="text-sm text-gray-500 mt-1">เข้าสู่ระบบเพื่อช้อปปิ้งเริ่มดอกไม้</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-600 mb-1.5 font-medium">
              อีเมล
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0] transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-600 mb-1.5 font-medium">
              รหัสผ่าน
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="กรอกรหัสผ่าน"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0] transition pr-16"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#1565C0] font-medium hover:underline"
              >
                {showPassword ? 'ซ่อน' : 'แสดง'}
              </button>
            </div>

            {/* Forgot password */}
            <div className="text-right mt-1.5">
              <Link to="/Forgotpassword" className="text-xs text-[#1565C0] hover:underline">
                ลืมรหัสผ่าน?
              </Link>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-[#C41230]">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C41230] hover:bg-green-600 disabled:bg-blue-300 text-white font-semibold rounded-full py-3 text-sm transition-colors duration-200"
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>

        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">หรือ</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Register */}
        <p className="text-center text-sm text-gray-500">
          ยังไม่มีบัญชี?{' '}
          <Link to="/Register" className="text-[#1565C0] font-semibold hover:underline">
            สมัครสมาชิกฟรี
          </Link>
        </p>
        <Link to="/">
          <div className="text-center mt-2 text-[#1565C0] font-semibold">
            ไปสู่หน้าหลัก
          </div>
        </Link>

      </div>
    </div>
  )
}

export default Login