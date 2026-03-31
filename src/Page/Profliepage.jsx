// src/pages/ProfilePage.jsx
import { useState, useEffect, useRef } from "react"
import api from "../api/axios"

export default function ProfilePage({ member, setMember }) {
  const [orders, setOrders] = useState([])
  const [tab, setTab] = useState("profile")
  const [editForm, setEditForm] = useState({
    memName: member?.memName || "",
    password: ""
  })
  const [previewImg, setPreviewImg] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [msg, setMsg] = useState("")
  const fileRef = useRef()

  // ดึงประวัติสั่งซื้อ
  useEffect(() => {
    if (tab !== "orders") return
    api.get("/carts/history", { withCredentials: true })
      .then((res) => setOrders(res.data))
      .catch(() => setOrders([]))
  }, [tab])

  // เลือกรูป
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setSelectedFile(file)
    setPreviewImg(URL.createObjectURL(file))
  }

  // บันทึกโปรไฟล์
  const handleSave = async () => {
    setMsg("")
    try {
      const formData = new FormData()
      if (editForm.memName) formData.append("memName", editForm.memName)
      if (editForm.password) formData.append("password", editForm.password)
      if (selectedFile) formData.append("file", selectedFile)

      const res = await api.put("/members/profile", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      })
      setMsg(res.data.message)
      setMember((prev) => ({ ...prev, memName: editForm.memName }))
    } catch {
      setMsg("เกิดข้อผิดพลาด กรุณาลองใหม่")
    }
  }

  if (!member) return (
    <div className="text-center py-20">
      <p className="text-red-500 mb-4">กรุณาเข้าสู่ระบบ</p>
      <a href="/Login" className="text-[#C41230] underline">ไปหน้าเข้าสู่ระบบ</a>
    </div>
  )

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl min-h-screen">

      {/* Header โปรไฟล์ */}
      <div className="flex items-center gap-6 mb-8">
        <div className="relative">
          <img
            src={previewImg || `http://localhost:3000/img_mem/${member.memEmail}.jpg`}
            alt="profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
            onError={(e) => e.target.src = "https://placehold.co/96x96?text=User"}
          />
          <button
            onClick={() => fileRef.current.click()}
            className="absolute bottom-0 right-0 bg-[#C41230] text-white rounded-full w-7 h-7 flex items-center justify-center text-xs hover:bg-red-700 transition-colors"
          >
            ✎
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{member.memName}</h2>
          <p className="text-gray-400 text-sm">{member.memEmail}</p>
          <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block
            ${member.dutyId === "admin"
              ? "bg-red-100 text-red-600"
              : "bg-gray-100 text-gray-500"}`}>
            {member.dutyId === "admin" ? "Admin" : "สมาชิก"}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        {["profile", "orders"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-2 text-sm font-medium border-b-2 transition-colors
              ${tab === t
                ? "border-[#C41230] text-[#C41230]"
                : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            {t === "profile" ? "ข้อมูลส่วนตัว" : "ประวัติสั่งซื้อ"}
          </button>
        ))}
      </div>

      {/* Tab: ข้อมูลส่วนตัว */}
      {tab === "profile" && (
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 font-medium">ชื่อผู้ใช้</label>
            <input
              value={editForm.memName}
              onChange={(e) => setEditForm({ ...editForm, memName: e.target.value })}
              className="w-full mt-1 px-4 py-2 border rounded-lg outline-none focus:border-red-400 focus:ring-1 focus:ring-red-300 transition"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 font-medium">อีเมล</label>
            <input
              value={member.memEmail}
              disabled
              className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">ไม่สามารถเปลี่ยนอีเมลได้</p>
          </div>
          <div>
            <label className="text-sm text-gray-600 font-medium">
              รหัสผ่านใหม่ (ถ้าต้องการเปลี่ยน)
            </label>
            <input
              type="password"
              value={editForm.password}
              onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
              placeholder="เว้นว่างไว้ถ้าไม่ต้องการเปลี่ยน"
              className="w-full mt-1 px-4 py-2 border rounded-lg outline-none focus:border-red-400 focus:ring-1 focus:ring-red-300 transition"
            />
          </div>

          {msg && (
            <p className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg">
              {msg}
            </p>
          )}

          <div className="flex">
            <button
              onClick={handleSave}
              className="bg-[#C41230] text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors"
            >
              บันทึกการเปลี่ยนแปลง
            </button>
          </div>
        </div>
      )}

      {/* Tab: ประวัติสั่งซื้อ */}
      {tab === "orders" && (
        <div className="space-y-3">
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 mb-2">ยังไม่มีประวัติสั่งซื้อ</p>
              <a href="/products" className="text-[#C41230] text-sm hover:underline">
                เริ่มช้อปปิ้งเลย →
              </a>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.cartId}
                className="border rounded-lg px-5 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-700">คำสั่งซื้อ #{order.cartId}</p>
                  <p className="text-sm text-gray-400">{order.itemCount} รายการ</p>
                </div>
                <p className="text-[#C41230] font-bold">
                  ฿{Number(order.totalPrice).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  )
}