import { useState } from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-red-800 text-white mt-auto">
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className='text-2xl font-bold mb-3'>ติดต่อ FIORE</h3>
            <h2 className="text-2xl font-bold mb-3"
              style={{ fontFamily: "'Times New Roman', serif" }}>
              FIORE
            </h2>
            <p className="text-red-200 text-sm leading-relaxed mb-4">
              ร้านอาหารหมาออนไลน์ จัดส่งทั่วประเทศ<br />
              สดใหม่ทุกวัน ส่งตรงถึงมือคุณ
            </p>  
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer