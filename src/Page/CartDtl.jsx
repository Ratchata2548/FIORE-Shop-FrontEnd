import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom' // เพิ่ม useNavigate
import api from '../api/axios'

function CartDtl() {
    const { id } = useParams()
    const navigate = useNavigate() // สำหรับเปลี่ยนหน้า
    const [cartInfo, setCartInfo] = useState(null)
    const [cartItems, setCartItems] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchAllData = async () => {
        try {
            const resCart = await api.get(`/carts/getcart/${id}`)
            if (resCart.data && resCart.data.length > 0) setCartInfo(resCart.data[0])

            const resDtl = await api.get(`/carts/getcartdtl/${id}`)
            setCartItems(resDtl.data)
        } catch (err) {
            console.error("Error:", err)
        } finally {
            setLoading(false)
        }
    }

    // ฟังก์ชันยืนยันตะกร้าสินค้า
    const handleConfirmCart = async () => {
        // ✅ เพิ่มการเช็ค: ถ้าไม่มีสินค้าในตะกร้า ห้ามยืนยัน
        if (cartItems.length === 0) {
            alert("ไม่สามารถยืนยันได้ เนื่องจากไม่มีสินค้าในตะกร้า");
            return;
        }

        if (!window.confirm("คุณต้องการยืนยันรายการสั่งซื้อนี้ใช่หรือไม่?")) return;
        
        try {
            await api.post(`/carts/confirm/${id}`);
            alert("ยืนยันรายการสั่งซื้อสำเร็จ!");
            navigate('/cart'); 
        } catch (err) {
            console.error("Confirm Error:", err);
            alert("ไม่สามารถยืนยันรายการได้: " + (err.response?.data?.message || "เกิดข้อผิดพลาด"));
        }
    };

    const handleUpdateQty = async (pdId, newQty) => {
        if (newQty < 1) return;
        try {
            await api.put(`/carts/updateqtydtl/${id}/${pdId}`, { qty: newQty });
            fetchAllData();
        } catch (err) {
            alert("ไม่สามารถแก้ไขจำนวนได้");
        }
    };

    const handleDeleteItem = async (pdId) => {
        if (!window.confirm("ต้องการลบสินค้านี้ใช่หรือไม่?")) return;
        try {
            await api.delete('/carts/delcartdtl', { 
                data: { cartId: id, pdId: pdId } 
            });
            fetchAllData(); 
        } catch (err) {
            alert("ลบไม่สำเร็จ");
        }
    };

    useEffect(() => {
        if (id) fetchAllData()
    }, [id])

    if (loading) return <div className="p-5 text-center text-blue-600">กำลังโหลด...</div>

    return (
        <div className="p-8 max-w-5xl mx-auto">
            {/* ส่วนหัวและปุ่มย้อนกลับ */}
            <div className="flex justify-between items-center mb-6">
                <button 
                    onClick={() => navigate('/cart')} 
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-semibold transition-colors"
                >
                    ⬅️ ย้อนกลับไปหน้าตะกร้า
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-3xl font-extrabold text-gray-800">
                        Order Details <span className="text-blue-600">#{id}</span>
                    </h2>
                    {/* แสดงสถานะถ้ามีการเก็บค่า cartCf ไว้ */}
                    {cartInfo?.cartCf ? (
                        <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full font-bold">ยืนยันแล้ว</span>
                    ) : (
                        <span className="bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full font-bold">รอยืนยัน</span>
                    )}
                </div>

                {cartInfo && (
                    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-600">Total Items: <span className="font-bold text-black">{cartInfo.sqty}</span></p>
                        <p className="text-2xl font-bold text-blue-700">Total: {Number(cartInfo.sprice).toLocaleString()} ฿</p>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                <table className="min-w-full">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="px-6 py-4 text-left">Product</th>
                            <th className="px-6 py-4 text-center">Quantity</th>
                            <th className="px-6 py-4 text-right">Unit Price</th>
                            <th className="px-6 py-4 text-right">Subtotal</th>
                            <th className="px-6 py-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {cartItems.map((item, index) => (
                            <tr key={item.pdId || index} className="hover:bg-blue-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-800">{item.pdName}</div>
                                    <div className="text-sm text-gray-500">{item.pdId}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-3">
                                        <button 
                                            onClick={() => handleUpdateQty(item.pdId, item.qty - 1)}
                                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                                            disabled={cartInfo?.cartCf} // ปิดปุ่มถ้ากดยืนยันแล้ว
                                        >-</button>
                                        <span className="w-8 text-center font-semibold">{item.qty}</span>
                                        <button 
                                            onClick={() => handleUpdateQty(item.pdId, item.qty + 1)}
                                            className="w-8 h-8 rounded-full bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center font-bold"
                                            disabled={cartInfo?.cartCf}
                                        >+</button>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right text-gray-600">{Number(item.price).toLocaleString()}</td>
                                <td className="px-6 py-4 text-right font-bold text-blue-600">
                                    {(item.qty * item.price).toLocaleString()} ฿
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button 
                                        onClick={() => handleDeleteItem(item.pdId)}
                                        className="text-red-500 hover:text-red-700 disabled:opacity-30"
                                        disabled={cartInfo?.cartCf}
                                    >
                                        🗑️ ลบ
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ปุ่มยืนยันตะกร้า (แสดงเฉพาะเมื่อยังไม่ยืนยัน) */}
            {!cartInfo?.cartCf && cartItems.length > 0 ? (
                <div className="flex justify-end mt-6">
                    <button
                        onClick={handleConfirmCart}
                        className="bg-green-600 hover:bg-green-700 text-white text-xl font-bold py-4 px-10 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95"
                    >
                        ✅ ยืนยันตะกร้าสินค้า
                    </button>
                </div>
            ) : !cartInfo?.cartCf && (
                // แสดงข้อความเตือนกรณีตะกร้าว่าง (Optional)
                <div className="text-right mt-6 text-gray-400 italic">
                    * กรุณาเพิ่มสินค้าก่อนกดยืนยัน
                </div>
            )}
        </div>
    )
}

export default CartDtl