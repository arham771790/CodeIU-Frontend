'use client'
import React from 'react'
import IsClient from './components/IsClient'
import Header from './components/Header'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify'
import { usePathname } from 'next/navigation'

const Structure = ({children}) => {
    
        
          const pathname = usePathname();
          console.log(pathname);
          
      
          const hideLayout =['/login','/register','/Each-problem/' , '/Admin']
    
           const shouldHide = hideLayout.includes(pathname.startsWith('/Each-problem/') ? '/Each-problem/' : pathname);

           console.log(shouldHide);
           
  return (
    
      <IsClient>
       <div>
          {!shouldHide && <Header />}
        <main className="flex-1 max-w-screen">
          {children}
        </main>
       {!shouldHide && <Footer />}

          <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      </div>
     </IsClient>

  )
}

export default Structure
