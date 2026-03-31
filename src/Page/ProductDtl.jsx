import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'

function ProductDtl() {
    const [products, setProducts] = useState(null)
    const [ownCarts, setOwnCarts] = useState([])
    const [selectedCart, setSelectedCart] = useState("")
    const { id } = useParams()
    const qty = 1 // กำหนดค่าคงที่ไว้ที่ 1 ตามที่คุณต้องการเอาปุ่มออก

    const fetchData = async () => {
        try {
            const resPd = await api.get(`api/products/${id}`)
            setProducts(resPd.data[0])

            const resCarts = await api.get('/carts/getowncart', { withCredentials: true })
            
            // ✅ กรองเฉพาะตะกร้าที่ cartCf เป็น false (หรือ 0) เท่านั้น
            const activeCarts = resCarts.data.filter(cart => !cart.cartCf);
            
            setOwnCarts(activeCarts)
            if (activeCarts.length > 0) {
                setSelectedCart(activeCarts[0].cartId)
            }
        } catch (err) {
            console.error("Fetch error:", err)
        }
    }

    useEffect(() => {
        fetchData()
    }, [id])

    const handleCreateNewCart = async () => {
        try {
            const res = await api.post('/carts/addcart', {}, { withCredentials: true });
            if (res.data) {
                alert("สร้างตะกร้าใบใหม่สำเร็จ!");
                fetchData(); 
            }
        } catch (err) {
            console.error("Create cart error:", err);
            alert("ไม่สามารถสร้างตะกร้าได้");
        }
    };

    const handleAddtoCart = async () => {
        if (!selectedCart) {
            alert("กรุณาเลือกตะกร้า")
            return
        }
        try {
            await api.post('/carts/addcartdtl', {
                cartId: selectedCart,
                pdId: id,
                qty: qty
            }, { withCredentials: true })

            alert("เพิ่มลงตะกร้าเรียบร้อยแล้ว!")
        } catch (err) {
            console.error(err)
            alert("ไม่สามารถเพิ่มสินค้าได้ (ตะกร้าอาจถูกยืนยันไปแล้ว)")
        }
    }

    if (!products) return <div className='text-center py-20'>Loading...</div>

    return (
        <div className='bg-[#EDD5A3] min-h-screen py-10'>
            <div className='container mx-auto px-4'>
                <div className='flex flex-col md:flex-row items-center bg-white rounded-xl shadow-lg overflow-hidden'>
                    <div className='md:w-1/2 p-8'>
                        <img
                            className='w-full max-w-sm mx-auto object-contain transition-transform hover:scale-105'
                            src={`http://localhost:3000/img_pd/${products.pd_image_url}`}
                            alt={products.pdName}
                        />
                    </div>

                    <div className='md:w-1/2 p-10 text-left'>
                        <h1 className='text-4xl font-bold text-gray-800 mb-4'>{products.pdName}</h1>
                        <p className='text-2xl text-red-600 font-semibold mb-6'>฿{products.pdPrice}</p>

                        <div className='space-y-2 text-gray-600 mb-8'>
                            <p><span className='font-bold'>แบรนด์:</span> {products.brandName || products.brandId}</p>
                            <p><span className='font-bold'>ประเภท:</span> อาหารสัตว์</p>
                        </div>

                        <div className='border-t pt-6'>
                            <div className='flex items-center gap-4 mb-6'>
                                {/* เอาส่วน UI เพิ่มลดจำนวนออกตามคำขอ */}
                                <div className='flex-grow flex'>
                                    {ownCarts.length > 0 ? (
                                        <>
                                            <select
                                                value={selectedCart}
                                                onChange={(e) => setSelectedCart(e.target.value)}
                                                className='bg-orange-400 text-white px-4 py-3 rounded-l-lg outline-none cursor-pointer border-r border-orange-500'
                                            >
                                                {ownCarts.map(cart => (
                                                    <option key={cart.cartId} value={cart.cartId} className="text-black">
                                                        ตะกร้า #{cart.cartId} (ยังไม่ยืนยัน)
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                onClick={handleAddtoCart}
                                                className='bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-r-lg font-bold transition-colors flex-grow'
                                            >
                                                เพิ่มลงตะกร้าที่เลือก
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={handleCreateNewCart}
                                            className='bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition-colors flex-grow'
                                        >
                                            + สร้างตะกร้าใหม่เพื่อสั่งซื้อ
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDtl