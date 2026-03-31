import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

function Cart({ member, authLoading }) {
  const [carts, setCarts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (authLoading) return
    if (!member) {
      navigate("/Login", { replace: true })
      return
    }
    fetchCart()
  }, [member, authLoading])

  const fetchCart = async () => {
    try {
      const response = await api.get("/carts/getowncart", { withCredentials: true })
      setCarts(response.data)
    } catch (error) {
      console.log(error)
      if (error.response?.status === 401) navigate("/Login")
    } finally {
      setLoading(false)
    }
  }

  const handlePostCart = async () => {
    try {
      await api.post("/carts/addcart", {}, { withCredentials: true })
      fetchCart()
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteCart = async (e, cartId) => {
    e.preventDefault()
    e.stopPropagation()

    if (!confirm('ต้องการลบตะกร้านี้ใช่ไหม?')) return

    setDeletingId(cartId)
    try {
      await api.delete("/carts/delcart", {
        data: { cartId },
        withCredentials: true
      })
      fetchCart()
    } catch (error) {
      console.log(error)
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  if (authLoading || (!member && loading)) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-300 text-sm font-mono">กำลังโหลด...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 max-w-2xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-[#0f0f0f] tracking-tight">ตะกร้าสินค้า</h1>
            <p className="text-sm text-gray-400 mt-0.5">รายการที่ยังไม่ได้ยืนยัน</p>
          </div>
          <button
            onClick={handlePostCart}
            className="bg-[#C41230] hover:bg-[#a00e26] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors duration-200 flex items-center gap-2"
          >
            <span className="text-base leading-none">+</span>
            สร้างตะกร้าใหม่
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20 text-gray-300 text-sm font-mono">กำลังโหลด...</div>
        ) : carts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🛒</div>
            <p className="text-gray-400 text-sm">ยังไม่มีตะกร้าสินค้า</p>
            <button
              onClick={handlePostCart}
              className="mt-4 text-sm text-[#C41230] hover:underline font-medium"
            >
              สร้างตะกร้าใหม่
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {carts.map((cart, index) => (
              <Link
                to={`/Cart/${cart.cartId}`}
                key={cart.cartId}
                className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:border-[#C41230]/20 transition-all group"
              >
                {/* Left */}
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-[#C41230] text-xs font-black">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0f0f0f] group-hover:text-[#C41230] transition-colors">
                      ตะกร้าหมายเลข #{cart.cartId}
                    </div>
                    {cart.createdAt && (
                      <div className="text-xs text-gray-400 mt-0.5">
                        สร้างเมื่อ {formatDate(cart.createdAt)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => handleDeleteCart(e, cart.cartId)}
                    disabled={deletingId === cart.cartId}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-[#C41230] hover:bg-red-50 transition-all disabled:opacity-40"
                    title="ลบตะกร้า"
                  >
                    {deletingId === cart.cartId ? (
                      <span className="w-3.5 h-3.5 border-2 border-gray-300 border-t-[#C41230] rounded-full animate-spin block" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>

                  <div className="text-gray-300 group-hover:text-[#C41230] group-hover:translate-x-1 transition-all text-lg">
                    →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart