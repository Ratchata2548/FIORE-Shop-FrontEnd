import { useState } from 'react'
import { Link } from 'react-router-dom'

function ForgotPassword() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [loading, setLoading] = useState(false)

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)

  const handleSendEmail = (e) => {
    e.preventDefault()
    if (!email) {
      setEmailError('กรุณากรอกอีเมล')
      return
    }
    if (!validateEmail(email)) {
      setEmailError('รูปแบบอีเมลไม่ถูกต้อง')
      return
    }
    setEmailError('')
    setLoading(true)
    // จำลอง API ส่ง email
    setTimeout(() => {
      setLoading(false)
      setStep(2)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-black text-[#C41230]">
            ❁FIORE❁
          </Link>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors
                ${step >= s ? 'bg-[#1565C0] text-white' : 'bg-gray-200 text-gray-400'}`}>
                {s}
              </div>
              {s < 2 && (
                <div className={`w-10 h-0.5 transition-colors ${step > s ? 'bg-[#1565C0]' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1 — กรอกอีเมล */}
        {step === 1 && (
          <form onSubmit={handleSendEmail} className="space-y-5">
            <div className="text-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">ลืมรหัสผ่านใช่ไหม?</h2>
              <p className="text-sm text-gray-500 mt-1">
                กรอกอีเมลที่ลงทะเบียนไว้ เราจะส่งลิงก์รีเซ็ตให้คุณ
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1.5 font-medium">
                อีเมล
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setEmailError('')
                }}
                placeholder="example@email.com"
                className={`w-full border rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-1 transition
                  ${emailError
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-300'
                    : 'border-gray-300 focus:border-[#1565C0] focus:ring-[#1565C0]'
                  }`}
              />
              {emailError && (
                <p className="text-xs text-red-500 mt-1">{emailError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C41230] hover:bg-green-600 disabled:bg-blue-300 text-white font-semibold rounded-full py-3 text-sm transition-colors duration-200"
            >
              {loading ? 'กำลังส่ง...' : 'ส่งลิงก์รีเซ็ต'}
            </button>

            <div className="text-center">
              <Link to="/Login" className="text-sm text-[#1565C0] hover:underline">
                ← กลับหน้าเข้าสู่ระบบ
              </Link>
            </div>
          </form>
        )}

        {/* Step 2 — เช็คอีเมล */}
        {step === 2 && (
          <div className="text-center space-y-5">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-3xl">
              ✉️
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-800">ส่งอีเมลแล้วครับ  !</h2>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                เราส่งลิงก์รีเซ็ตรหัสผ่านไปที่
                <br />
                <span className="font-semibold text-gray-700">{email}</span>
                <br />
                กรุณาเช็ค inbox ของคุณ
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-700 text-left">
              💡 ไม่เจออีเมลใช่ไหมครับ? ลองเช็คใน Spam หรือ Junk folder ด้วยครับ
            </div>

            <button
              onClick={() => { setStep(1); setEmail('') }}
              className="w-full border border-gray-300 hover:border-gray-400 text-gray-600 font-medium rounded-full py-3 text-sm transition-colors duration-200"
            >
              ส่งอีเมลอีกครั้ง
            </button>

            <Link
              to="/Login"
              className="block w-full bg-[#1565C0] hover:bg-green-600 text-white font-semibold rounded-full py-3 text-sm transition-colors duration-200 text-center"
            >
              กลับหน้าเข้าสู่ระบบ
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default ForgotPassword
