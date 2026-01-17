'use client'
import React from 'react'
import IsClient from './components/IsClient'
import Header from './components/Header'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify'
import { usePathname } from 'next/navigation'

const Structure = ({children}) => {
    const pathname = usePathname();
    
    const hideLayoutOn = [
      '/login',
      '/register',
      '/Each-problem', 
      '/Admin', 
      '/Contest_ProblemPage'
    ];

    const shouldHide = hideLayoutOn.some(path => pathname.startsWith(path));
          
    return (
      <IsClient>
        {/* SENIOR FIX: 
            Yeah, I noticed the background issue too.
           1. Added 'bg-base-100' (The theme's primary background)
           2. Added 'text-base-content' (The theme's primary text color)
           3. Added 'min-h-screen' to ensure the background covers the whole page
        */}
        <div className="bg-base-100 text-base-content min-h-screen flex flex-col transition-colors duration-300">
          
          {!shouldHide && <Header />}
          
          <main className="flex-1 w-full max-w-screen">
            {children}
          </main>

          {!shouldHide && <Footer />}

          {/* SENIOR TIP: Changed ToastContainer theme to 'auto' or controlled 
             so it doesn't stay 'dark' in 'light' mode.
          */}
          <ToastContainer
            position="top-right"
            autoClose={2000}
            theme="auto" 
          />
        </div>
      </IsClient>
    )
}

export default Structure