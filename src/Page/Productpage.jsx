import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import api from "../api/axios"

import { Link } from "react-router-dom"

export default function ProductsPage() {
  const { category } = useParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get("/api/products")
      .then((res) => setProducts(res.data))
      .catch(() => setError("โหลดสินค้าไม่สำเร็จ"))
      .finally(() => setLoading(false))
  }, [])

  // filter ตาม category จาก URL (ใช้ pdt.pdTypeName)
  const filtered = category
    ? products.filter((p) => p.pdt?.pdTypeName === category)
    : products

  if (loading) return <p className="text-center py-20">กำลังโหลด...</p>
  if (error) return <p className="text-center py-20 text-red-500">{error}</p>

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((product) => (
          <div key={product.pdId} className="cursor-pointer group">

            <Link to={`/products/${product.pdId}`}>
            {/* รูปสินค้า */}

            <div className="relative overflow-hidden rounded-lg bg-gray-100">
              <img
                src={`http://localhost:3000/img_pd/${product.pd_image_url}`}
                alt={product.pdName}
                className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* ข้อมูลสินค้า */}
            <div className="mt-3 space-y-1">
              <p className="text-xs text-gray-400">{product.pdt?.pdTypeName}</p>
              <p className="text-sm font-medium text-gray-800">
                <span className="text-gray-400 mr-1">{product.pdId}</span>
                {product.pdName}
              </p>
              {product.pdRemark && (
                <p className="text-xs text-gray-400 line-clamp-1">{product.pdRemark}</p>
              )}
              <p className="text-[#C41230] font-bold">
                ฿{product.pdPrice?.toLocaleString()}
              </p>
            </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}