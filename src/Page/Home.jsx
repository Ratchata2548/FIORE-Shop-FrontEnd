import { useState } from 'react'
import Navbar from '../components/Navbar'
import ProductsPage from './Productpage'

function Home() {

  return (
    
    <div>
      <div className='bg-[#EDD5A3]'>
      <ProductsPage/>
      </div>
    </div>
  )
}

export default Home