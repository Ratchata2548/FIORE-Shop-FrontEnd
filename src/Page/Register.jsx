import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
 
  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'กรุณากรอกชื่อ'
    if (!form.email.trim()) newErrors.email = 'กรุณากรอกอีเมล'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง'
    if (!form.password) newErrors.password = 'กรุณากรอกรหัสผ่าน'
    else if (form.password.length < 6)
      newErrors.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'
    if (!form.confirmPassword) newErrors.confirmPassword = 'กรุณายืนยันรหัสผ่าน'
    else if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = 'รหัสผ่านไม่ตรงกัน'
    return newErrors
  }
 
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }
 
  const handleSubmit = async (e) => {
  e.preventDefault()
  const newErrors = validate()
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors)
    return
  }

  setLoading(true)
  try {
    const res = await api.post("/members/register", {
      memEmail: form.email,      // Backend ใช้ชื่อ memEmail
      memName: form.name,        // Backend ใช้ชื่อ memName
      password: form.password
    })

    if (res.data.regist) {
      navigate("/Login")
    } else {
      setErrors({ email: res.data.message })
    }
  } catch (err) {
    setErrors({ email: "เกิดข้อผิดพลาด กรุณาลองใหม่" })
  } finally {
    setLoading(false)
  }
}
 
  const fields = [
    {
      name: 'name',
      label: 'ชื่อ-นามสกุล',
      type: 'text',
      placeholder: 'กรอกชื่อ-นามสกุล',
    },
    {
      name: 'email',
      label: 'อีเมล',
      type: 'email',
      placeholder: 'example@email.com',
    },
    {
      name: 'password',
      label: 'รหัสผ่าน',
      type: showPassword ? 'text' : 'password',
      placeholder: 'อย่างน้อย 6 ตัวอักษร',
      toggle: () => setShowPassword(!showPassword),
      toggleLabel: showPassword ? 'ซ่อน' : 'แสดง',
    },
    {
      name: 'confirmPassword',
      label: 'ยืนยันรหัสผ่าน',
      type: showConfirm ? 'text' : 'password',
      placeholder: 'กรอกรหัสผ่านอีกครั้ง',
      toggle: () => setShowConfirm(!showConfirm),
      toggleLabel: showConfirm ? 'ซ่อน' : 'แสดง',
    },
  ]
 
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 w-full max-w-md">
 
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-black text-[#C41230]">
            ❁FIORE❁
          </Link>
          <p className="text-sm text-gray-500 mt-1">สร้างบัญชีใหม่เพื่อเริ่มช้อปปิ้งดอกไม้</p>
        </div>
 
        <form onSubmit={handleSubmit} className="space-y-5">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm text-gray-600 mb-1.5 font-medium">
                {field.label}
              </label>
              <div className="relative">
                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-1 transition pr-16
                    ${errors[field.name]
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-300'
                      : 'border-gray-300 focus:border-[#1565C0] focus:ring-[#1565C0]'
                    }`}
                />
                {field.toggle && (
                  <button
                    type="button"
                    onClick={field.toggle}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#1565C0] font-medium hover:underline"
                  >
                    {field.toggleLabel}
                  </button>
                )}
              </div>
              {errors[field.name] && (
                <p className="text-xs text-red-500 mt-1">{errors[field.name]}</p>
              )}
            </div>
          ))}
 
          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C41230] hover:bg-green-600 disabled:bg-blue-300 text-white font-semibold rounded-full py-3 text-sm transition-colors duration-200 mt-2"
          >
            {loading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
          </button>
        </form>
 
        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">หรือ</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
 
        {/* Login link */}
        <p className="text-center text-sm text-gray-500">
          มีบัญชีอยู่แล้ว?{' '}
          <Link to="/Login" className="text-[#1565C0] font-semibold hover:underline">
            เข้าสู่ระบบ
          </Link>
        </p>
 
      </div>
    </div>
  )
}

export default Register
