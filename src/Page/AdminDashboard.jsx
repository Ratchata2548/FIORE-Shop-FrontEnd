import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'

// ==================== MODAL เพิ่มสินค้า ====================
function AddProductModal({ onClose, onSuccess, pdTypes, brands }) {
  const [form, setForm] = useState({ pdId: '', pdName: '', pdPrice: '', pdTypeId: '', brandId: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.pdId || !form.pdName || !form.pdPrice) {
      setError('กรุณากรอกข้อมูลให้ครบ')
      return
    }
    setLoading(true)
    try {
      await api.post('/products', form, { withCredentials: true })
      onSuccess()
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-black text-[#0f0f0f]">เพิ่มสินค้าใหม่</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-500 text-xl">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-mono">รหัสสินค้า (pdId)</label>
            <input name="pdId" value={form.pdId} onChange={handleChange} placeholder="เช่น PD-H-001"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C41230] focus:ring-1 focus:ring-[#C41230]/30 transition" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-mono">ชื่อสินค้า</label>
            <input name="pdName" value={form.pdName} onChange={handleChange} placeholder="ชื่อสินค้า"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C41230] focus:ring-1 focus:ring-[#C41230]/30 transition" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-mono">ราคา (บาท)</label>
            <input name="pdPrice" value={form.pdPrice} onChange={handleChange} type="number" placeholder="0"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C41230] focus:ring-1 focus:ring-[#C41230]/30 transition" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-mono">ประเภทสินค้า</label>
            <select name="pdTypeId" value={form.pdTypeId} onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C41230] focus:ring-1 focus:ring-[#C41230]/30 transition bg-white">
              <option value="">-- เลือกประเภท --</option>
              {pdTypes.map(t => <option key={t.pdTypeId} value={t.pdTypeId}>{t.pdTypeName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-mono">แบรนด์</label>
            <select name="brandId" value={form.brandId} onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C41230] focus:ring-1 focus:ring-[#C41230]/30 transition bg-white">
              <option value="">-- เลือกแบรนด์ --</option>
              {brands.map(b => <option key={b.brandId} value={b.brandId}>{b.brandName}</option>)}
            </select>
          </div>
          {error && <p className="text-xs text-[#C41230] bg-red-50 px-3 py-2 rounded-lg font-mono">⚠ {error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-500 rounded-xl py-2.5 text-sm font-semibold hover:bg-gray-50 transition">ยกเลิก</button>
            <button type="submit" disabled={loading}
              className="flex-1 bg-[#C41230] hover:bg-[#a00e26] disabled:bg-[#C41230]/40 text-white rounded-xl py-2.5 text-sm font-semibold transition">
              {loading ? 'กำลังบันทึก...' : 'เพิ่มสินค้า'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ==================== MODAL แก้ไขสินค้า ====================
function EditProductModal({ product, onClose, onSuccess, pdTypes, brands }) {
  const [form, setForm] = useState({
    pdName: product.pdName || '', pdPrice: product.pdPrice || '',
    pdRemark: product.pdRemark || '', pdTypeId: product.pdTypeId || '', brandId: product.brandId || '',
  })
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError('') }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([k, v]) => { if (v !== '') formData.append(k, v) })
      if (file) formData.append('file', file)
      await api.put(`/products/${product.pdId}`, formData, { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } })
      onSuccess(); onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาด')
    } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-black text-[#0f0f0f]">แก้ไขสินค้า</h2>
            <p className="text-xs text-gray-400 font-mono">{product.pdId}</p>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-500 text-xl">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-mono">ชื่อสินค้า</label>
            <input name="pdName" value={form.pdName} onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C41230] focus:ring-1 focus:ring-[#C41230]/30 transition" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-mono">ราคา (บาท)</label>
            <input name="pdPrice" value={form.pdPrice} onChange={handleChange} type="number"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C41230] focus:ring-1 focus:ring-[#C41230]/30 transition" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-mono">หมายเหตุ</label>
            <textarea name="pdRemark" value={form.pdRemark} onChange={handleChange} rows={2}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C41230] focus:ring-1 focus:ring-[#C41230]/30 transition resize-none" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-mono">ประเภทสินค้า</label>
            <select name="pdTypeId" value={form.pdTypeId} onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C41230] focus:ring-1 focus:ring-[#C41230]/30 transition bg-white">
              <option value="">-- เลือกประเภท --</option>
              {pdTypes.map(t => <option key={t.pdTypeId} value={t.pdTypeId}>{t.pdTypeName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-mono">แบรนด์</label>
            <select name="brandId" value={form.brandId} onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C41230] focus:ring-1 focus:ring-[#C41230]/30 transition bg-white">
              <option value="">-- เลือกแบรนด์ --</option>
              {brands.map(b => <option key={b.brandId} value={b.brandId}>{b.brandName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-mono">รูปภาพสินค้า</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-[#C41230] hover:file:bg-red-100" />
          </div>
          {error && <p className="text-xs text-[#C41230] bg-red-50 px-3 py-2 rounded-lg font-mono">⚠ {error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-500 rounded-xl py-2.5 text-sm font-semibold hover:bg-gray-50 transition">ยกเลิก</button>
            <button type="submit" disabled={loading}
              className="flex-1 bg-[#C41230] hover:bg-[#a00e26] disabled:bg-[#C41230]/40 text-white rounded-xl py-2.5 text-sm font-semibold transition">
              {loading ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ==================== TAB: จัดการสินค้า ====================
function ProductsTab() {
  const [products, setProducts] = useState([])
  const [pdTypes, setPdTypes] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [pdRes, typeRes, brandRes] = await Promise.all([
        api.get('/products'),
        api.get('/products/pdtypes'),
        api.get('/products/brands'),
      ])
      setProducts(pdRes.data)
      setPdTypes(typeRes.data)
      setBrands(brandRes.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchAll() }, [])

  const handleDelete = async (pdId) => {
    if (!confirm(`ลบสินค้า ${pdId} ใช่ไหม?`)) return
    setDeletingId(pdId)
    try {
      await api.delete(`/products/${pdId}`, { withCredentials: true })
      fetchAll()
    } catch (err) { alert(err.response?.data?.message || 'ลบไม่สำเร็จ') }
    finally { setDeletingId(null) }
  }

  const filtered = products.filter(p =>
    p.pdName?.toLowerCase().includes(search.toLowerCase()) ||
    p.pdId?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-5 gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ค้นหาสินค้า..."
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm w-64 focus:outline-none focus:border-[#C41230] focus:ring-1 focus:ring-[#C41230]/30 transition" />
        <button onClick={() => setShowAdd(true)}
          className="bg-[#C41230] hover:bg-[#a00e26] text-white text-sm font-semibold px-5 py-2 rounded-xl transition flex items-center gap-2">
          + เพิ่มสินค้า
        </button>
      </div>
      {loading ? (
        <div className="text-center py-16 text-gray-300 text-sm font-mono">กำลังโหลด...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">รหัส</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">ชื่อสินค้า</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">ประเภท</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">แบรนด์</th>
                <th className="text-right px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">ราคา</th>
                <th className="text-center px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-300 text-sm">ไม่พบสินค้า</td></tr>
              ) : filtered.map((p, i) => (
                <tr key={p.pdId} className={`border-b border-gray-50 hover:bg-gray-50/50 transition ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                  <td className="px-5 py-3 font-mono text-xs text-gray-400">{p.pdId}</td>
                  <td className="px-5 py-3 font-medium text-[#0f0f0f] max-w-[200px] truncate">{p.pdName}</td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{p.pdt?.pdTypeName || '-'}</td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{p.brand?.brandName || '-'}</td>
                  <td className="px-5 py-3 text-right font-bold text-[#C41230]">฿{Number(p.pdPrice).toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => setEditProduct(p)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition">แก้ไข</button>
                      <button onClick={() => handleDelete(p.pdId)} disabled={deletingId === p.pdId}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-[#C41230] hover:bg-red-100 transition disabled:opacity-40">
                        {deletingId === p.pdId ? '...' : 'ลบ'}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400 font-mono">ทั้งหมด {filtered.length} รายการ</div>
        </div>
      )}
      {showAdd && <AddProductModal onClose={() => setShowAdd(false)} onSuccess={fetchAll} pdTypes={pdTypes} brands={brands} />}
      {editProduct && <EditProductModal product={editProduct} onClose={() => setEditProduct(null)} onSuccess={fetchAll} pdTypes={pdTypes} brands={brands} />}
    </div>
  )
}

// ==================== TAB: ออเดอร์ทั้งหมด ====================
function OrdersTab() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/admin/orders', { withCredentials: true })
        setOrders(res.data)
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    fetchOrders()
  }, [])

  const filtered = orders.filter(o =>
    o.cartId?.toLowerCase().includes(search.toLowerCase()) ||
    o.memEmail?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="mb-5">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ค้นหาด้วย cartId หรืออีเมล..."
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm w-72 focus:outline-none focus:border-[#C41230] focus:ring-1 focus:ring-[#C41230]/30 transition" />
      </div>
      {loading ? (
        <div className="text-center py-16 text-gray-300 text-sm font-mono">กำลังโหลด...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Cart ID</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">อีเมลลูกค้า</th>
                <th className="text-center px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">จำนวนสินค้า</th>
                <th className="text-right px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">ยอดรวม</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-12 text-gray-300 text-sm">ไม่พบออเดอร์</td></tr>
              ) : filtered.map((o, i) => (
                <tr key={o.cartId} className={`border-b border-gray-50 hover:bg-gray-50/50 transition ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                  <td className="px-5 py-3 font-mono text-xs text-gray-400">{o.cartId}</td>
                  <td className="px-5 py-3 text-sm text-[#0f0f0f]">{o.memEmail}</td>
                  <td className="px-5 py-3 text-center text-sm text-gray-500">{o.itemCount} ชิ้น</td>
                  <td className="px-5 py-3 text-right font-bold text-[#C41230]">฿{Number(o.totalPrice).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400 font-mono">ทั้งหมด {filtered.length} ออเดอร์</div>
        </div>
      )}
    </div>
  )
}

// ==================== TAB: จัดการสมาชิก ====================
function MembersTab() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [updatingEmail, setUpdatingEmail] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')

  const fetchMembers = async () => {
    setLoading(true)
    try {
      const res = await api.get('/members', { withCredentials: true })
      setMembers(res.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchMembers() }, [])

  const handleRoleChange = async (memEmail, newRole) => {
    setUpdatingEmail(memEmail)
    setSuccessMsg('')
    try {
      await api.put('/members/role', { memEmail, dutyId: newRole }, { withCredentials: true })
      setSuccessMsg(`เปลี่ยน role ของ ${memEmail} เป็น ${newRole} แล้ว`)
      fetchMembers()
    } catch (err) {
      alert(err.response?.data?.message || 'เปลี่ยน role ไม่สำเร็จ')
    } finally {
      setUpdatingEmail(null)
      setTimeout(() => setSuccessMsg(''), 3000)
    }
  }

  const filtered = members.filter(m =>
    m.memEmail?.toLowerCase().includes(search.toLowerCase()) ||
    m.memName?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ค้นหาสมาชิก..."
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm w-64 focus:outline-none focus:border-[#C41230] focus:ring-1 focus:ring-[#C41230]/30 transition" />
        {successMsg && (
          <span className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg font-mono">✓ {successMsg}</span>
        )}
      </div>
      {loading ? (
        <div className="text-center py-16 text-gray-300 text-sm font-mono">กำลังโหลด...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">รูป</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">ชื่อ</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">อีเมล</th>
                <th className="text-center px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Role ปัจจุบัน</th>
                <th className="text-center px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">เปลี่ยน Role</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-300 text-sm">ไม่พบสมาชิก</td></tr>
              ) : filtered.map((m, i) => (
                <tr key={m.memEmail} className={`border-b border-gray-50 hover:bg-gray-50/50 transition ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                  <td className="px-5 py-3">
                    <img src={`http://localhost:3000/img_mem/${m.memEmail}.jpg`} alt=""
                      className="w-8 h-8 rounded-full object-cover border border-gray-100"
                      onError={(e) => e.target.src = 'https://placehold.co/32x32?text=U'} />
                  </td>
                  <td className="px-5 py-3 font-medium text-[#0f0f0f]">{m.memName}</td>
                  <td className="px-5 py-3 text-gray-500 text-xs font-mono">{m.memEmail}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      m.dutyId === 'admin'
                        ? 'bg-[#C41230]/10 text-[#C41230]'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {m.dutyId}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleRoleChange(m.memEmail, 'admin')}
                        disabled={m.dutyId === 'admin' || updatingEmail === m.memEmail}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#C41230]/10 text-[#C41230] hover:bg-[#C41230]/20 transition disabled:opacity-30 disabled:cursor-not-allowed">
                        {updatingEmail === m.memEmail ? '...' : 'ตั้งเป็น Admin'}
                      </button>
                      <button
                        onClick={() => handleRoleChange(m.memEmail, 'member')}
                        disabled={m.dutyId === 'member' || updatingEmail === m.memEmail}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition disabled:opacity-30 disabled:cursor-not-allowed">
                        {updatingEmail === m.memEmail ? '...' : 'ตั้งเป็น Member'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400 font-mono">ทั้งหมด {filtered.length} สมาชิก</div>
        </div>
      )}
    </div>
  )
}

// ==================== MAIN DASHBOARD ====================
const TABS = [
  { id: 'products', label: '❋ จัดการสินค้า' },
  { id: 'orders', label: '📦 ออเดอร์ทั้งหมด' },
  { id: 'members', label: '👤 จัดการสมาชิก' },
]

function Admindashboard({ member, authLoading }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('products')

  useEffect(() => {
    if (authLoading) return
    if (!member) { navigate('/Login'); return }
    if (member.dutyId !== 'admin') navigate('/')
  }, [member, authLoading])

  const handleLogout = async () => {
    try { await api.post('/members/logout', {}, { withCredentials: true }) } catch (_) {}
    navigate('/Login')
  }

  if (authLoading) return (
    <div className="flex h-screen items-center justify-center text-red-800 font-bold">กำลังโหลด...</div>
  )

  if (!member) return null

  return (
    <div className="min-h-screen bg-[#f7f6f3]">
      <header className="bg-[#0f0f0f] px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-lg font-black text-white tracking-tight">
            ❁<span className="text-[#C41230]">FIORE</span>❁
          </Link>
          <span className="text-white/20 text-xs font-mono border border-white/10 px-2 py-0.5 rounded-full">ADMIN</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-white/40 font-mono">{member?.memName || 'Admin'}</span>
          <button onClick={handleLogout}
            className="text-xs text-white/30 hover:text-white/70 transition font-mono border border-white/10 px-3 py-1.5 rounded-lg hover:border-white/20">
            ออกจากระบบ
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-[#0f0f0f] tracking-tight">แผงควบคุม</h1>
          <p className="text-sm text-gray-400 mt-0.5">จัดการข้อมูลระบบ FIORE</p>
        </div>

        <div className="flex gap-1 bg-white border border-gray-100 rounded-2xl p-1.5 mb-6 w-fit shadow-sm">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id ? 'bg-[#C41230] text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'products' && <ProductsTab />}
        {activeTab === 'orders' && <OrdersTab />}
        {activeTab === 'members' && <MembersTab />}
      </main>
    </div>
  )
}

export default Admindashboard