import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Searchbar from "./Searchbar";

export default function Navbar({ member, setMember }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/members/logout", {}, { withCredentials: true });
      setMember(null);
      navigate("/", { replace: true });
    } catch (err) {
      setMember(null);
      navigate("/Login");
    }
  };

  return (
    <nav className="shadow-lg bg-red-800 text-white">
      <div className="container mx-auto">
        <div className="flex justify-between py-4 items-center">

          {/* Logo */}
          <div className="justify-start">
            <h1 className="text-5xl font-bold" style={{ fontFamily: "'Times New Roman', serif" }}>
              <Link to="/">
                <div className="text-white">FIORE</div>
              </Link>
            </h1>
          </div>

          {/* Search */}
          <Searchbar />

          {/* Right */}
          <ul className="flex items-center gap-6">
            {member ? (
              <li className="relative group">
                <div className="flex items-center gap-2 cursor-pointer">
                  <img
                    src={`http://localhost:3000/img_mem/${member.memEmail}.jpg`}
                    alt="profile"
                    className="w-9 h-9 rounded-full object-cover border-2 border-white"
                    onError={(e) => e.target.src = "https://placehold.co/36x36?text=U"}
                  />
                  <span className="text-sm font-medium text-white">{member.memName}</span>
                </div>

                <ul className="absolute right-0 top-full hidden group-hover:block bg-white text-gray-700 shadow-lg rounded-lg min-w-[150px] z-50 py-1">
                  <li>
                    <Link to="/Profliepage" className="block px-4 py-2 text-sm hover:bg-gray-50 text-black">
                      โปรไฟล์
                    </Link>
                  </li>
                  <li>
                    <Link to="/Cart" className="block px-4 py-2 text-sm hover:bg-gray-50 text-black flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      ตะกร้าสินค้า
                    </Link>
                  </li>

                  {/* ✅ แก้ link จาก /admin เป็น /admin/dashboard */}
                  {member.dutyId === "admin" && (
                    <li>
                      <Link to="/admin/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-50 text-black">
                        จัดการระบบ
                      </Link>
                    </li>
                  )}
                  <li className="border-t border-gray-100">
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50">
                      ออกจากระบบ
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="text-md font-medium hover:text-red-300 transition-colors">
                  <Link to="/Login">เข้าสู่ระบบ</Link>
                </li>
                <li className="text-md font-medium hover:text-red-300 transition-colors">
                  <Link to="/Register">ลงทะเบียน</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}