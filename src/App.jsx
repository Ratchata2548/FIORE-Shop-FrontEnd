import './App.css'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from './api/axios'

import Home from './Page/Home'
import Login from './Page/Login'
import Register from './Page/Register'
import Forgotpassword from './Page/Forgotpassword'
import Cart from './Page/Cart'
import ProductsPage from './Page/Productpage'
import Profliepage from './Page/Profliepage'
import ProductDtl from './Page/ProductDtl'
import CartDtl from './Page/CartDtl'
import Admindashboard from './Page/Admindashboard'
import SearchResultPage from './Page/SearchResultPage'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

function AppLayout({ member, setMember, authLoading }) {
  const location = useLocation()
  const isAdminPage = location.pathname === '/admin/dashboard'

  return (
    <div className='flex flex-col min-h-screen'>
      {!isAdminPage && <Navbar member={member} setMember={setMember} />}

      <main className="flex-grow">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Login' element={<Login setMember={setMember} />} />
          <Route path='/Register' element={<Register />} />
          <Route path='/Forgotpassword' element={<Forgotpassword />} />
          <Route path='/Cart' element={<Cart member={member} authLoading={authLoading} />} />
          <Route path='/Cart/:id' element={<CartDtl />} />
          <Route path='/products/search' element={<SearchResultPage />} />
          <Route path='/products' element={<ProductsPage />} />
          <Route path='/products/:id' element={<ProductDtl />} />
          <Route path='/products/:category' element={<ProductsPage />} />
          <Route path='/Profliepage' element={<Profliepage member={member} setMember={setMember} />} />
          <Route path='/admin/dashboard' element={<Admindashboard member={member} authLoading={authLoading} />} />
        </Routes>
      </main>

      {!isAdminPage && <Footer />}
    </div>
  )
}

function App() {
  const [member, setMember] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    api.get("/members/detail", { withCredentials: true })
      .then(res => {
        if (res.data.login) setMember({
          memEmail: res.data.memEmail,
          memName: res.data.memName,
          dutyId: res.data.dutyId
        })
      })
      .catch(() => {})
      .finally(() => setAuthLoading(false))
  }, [])

  return (
    <BrowserRouter>
      <AppLayout member={member} setMember={setMember} authLoading={authLoading} />
    </BrowserRouter>
  )
}

export default App