import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Searchbar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  const fetchSuggestions = useCallback((q) => {
    clearTimeout(debounceRef.current);
    if (!q.trim()) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/products`);
        const filtered = res.data.filter((p) =>
          p.pdName?.toLowerCase().includes(q.toLowerCase()) ||
          p.pdt?.pdTypeName?.toLowerCase().includes(q.toLowerCase()) ||
          p.pdRemark?.toLowerCase().includes(q.toLowerCase())
        ).slice(0, 6);
        setSuggestions(filtered);
        setOpen(true);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setActiveIndex(-1);
    fetchSuggestions(val);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    navigate(`/products/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleSelect = (product) => {
    setQuery(product.pdName);
    setOpen(false);
    navigate(`/products/${product.pdId}`);
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setOpen(false);
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handler = (e) => {
      if (!containerRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleKeyDown = (e) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        e.preventDefault();
        handleSelect(suggestions[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor">
            <path d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z" />
          </svg>
        </span>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => { if (suggestions.length > 0) setOpen(true); }}
          onKeyDown={handleKeyDown}
          placeholder="ค้นหาสินค้าต่างๆ"
          className="w-full py-2 pl-10 pr-10 bg-white border border-gray-300 rounded-full outline-none text-gray-800 text-sm transition-all focus:border-red-400 focus:ring-1 focus:ring-red-300"
          autoComplete="off"
        />

        {loading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg className="animate-spin w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </span>
        )}

        {query && !loading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor">
              <path d="M504.6 148.5C515.9 134.9 514.1 114.7 500.5 103.4C486.9 92.1 466.7 93.9 455.4 107.5L320 270L184.6 107.5C173.3 93.9 153.1 92.1 139.5 103.4C125.9 114.7 124.1 134.9 135.4 148.5L278.3 320L135.4 491.5C124.1 505.1 125.9 525.3 139.5 536.6C153.1 547.9 173.3 546.1 184.6 532.5L320 370L455.4 532.5C466.7 546.1 486.9 547.9 500.5 536.6C514.1 525.3 515.9 505.1 504.6 491.5L361.7 320L504.6 148.5z" />
            </svg>
          </button>
        )}
      </form>

      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          {suggestions.length === 0 && !loading ? (
            <div className="px-4 py-3 text-sm text-gray-400 text-center">
              ไม่พบสินค้าที่ตรงกับ "{query}"
            </div>
          ) : (
            <>
              <p className="px-4 pt-2 pb-1 text-[11px] text-gray-400 font-medium uppercase tracking-wide">
                สินค้าที่ตรงกัน
              </p>
              {suggestions.map((product, i) => (
                <div
                  key={product.pdId}
                  className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors duration-100 ${
                    i === activeIndex ? "bg-red-50" : "hover:bg-gray-50"
                  }`}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => handleSelect(product)}
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={`http://localhost:3000/img_pd/${product.pd_image_url}`}
                      alt={product.pdName}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.src = "https://placehold.co/40x40?text=?")}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate font-medium">{product.pdName}</p>
                    <p className="text-xs text-gray-400 truncate">{product.pdt?.pdTypeName}</p>
                  </div>
                  <span className="text-sm font-bold text-red-700 flex-shrink-0">
                    ฿{product.pdPrice?.toLocaleString()}
                  </span>
                </div>
              ))}
              <div
                className="border-t border-gray-100 px-4 py-2.5 text-center text-sm text-red-700 font-medium cursor-pointer hover:bg-red-50 transition-colors"
                onClick={handleSubmit}
              >
                ดูผลลัพธ์ทั้งหมดสำหรับ "{query}" →
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
