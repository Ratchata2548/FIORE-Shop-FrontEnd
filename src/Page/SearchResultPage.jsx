import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/axios";

export default function SearchResultPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query.trim()) return;
    setLoading(true);
    api.get("/api/products")
      .then((res) => {
        const filtered = res.data.filter((p) =>
          p.pdName?.toLowerCase().includes(query.toLowerCase()) ||
          p.pdt?.pdTypeName?.toLowerCase().includes(query.toLowerCase()) ||
          p.pdRemark?.toLowerCase().includes(query.toLowerCase())
        );
        setProducts(filtered);
      })
      .catch(() => setError("โหลดสินค้าไม่สำเร็จ"))
      .finally(() => setLoading(false));
  }, [query]);

  if (loading) return <p className="text-center py-20 text-gray-500">กำลังค้นหา...</p>;
  if (error)   return <p className="text-center py-20 text-red-500">{error}</p>;

  return (
    <div className="bg-[#EDD5A3] min-h-screen">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-6">
          <p className="text-sm text-gray-500">
            ผลการค้นหาสำหรับ{" "}
            <span className="font-semibold text-gray-800">"{query}"</span>
          </p>
          <p className="text-xs text-gray-400 mt-0.5">พบ {products.length} รายการ</p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-2">ไม่พบสินค้าที่ตรงกับ "{query}"</p>
            <p className="text-gray-400 text-sm">ลองค้นหาด้วยคำอื่น หรือ</p>
            <Link to="/" className="text-red-700 text-sm font-medium hover:underline mt-1 inline-block">
              กลับหน้าหลัก →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link to={`/products/${product.pdId}`} key={product.pdId} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={`http://localhost:3000/img_pd/${product.pd_image_url}`}
                    alt={product.pdName}
                    className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => (e.target.src = "https://placehold.co/300x400?text=?")}
                  />
                </div>
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
