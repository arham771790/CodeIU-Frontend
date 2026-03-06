'use client'
import React from 'react'
import IsClient from '@/components/atoms/IsClient'
import Header from '@/components/organisms/Header'
import Footer from '@/components/organisms/Footer'
import { ToastContainer } from 'react-toastify'
import { usePathname } from 'next/navigation'

const Structure = ({ children }) => {
  const pathname = usePathname();

  const hideLayoutOn = [
    '/login',
    '/register',
    '/admin',
    '/contest/problem-view'
  ];

  // 1. Check if it matches the standard "startsWith" routes
  let shouldHide = hideLayoutOn.some(path => pathname.startsWith(path));

  // 2. SENIOR FIX: Special rule for dynamic problem pages (/problems/[id])
  // We check if the route starts with '/problems/' AND has an ID after it.
  // This ensures the main '/problems' page still gets the Header and Footer.
  if (pathname.startsWith('/problems/') && pathname.length > '/problems/'.length) {
    shouldHide = true;
  }

  return (
    <IsClient>
      {/* SENIOR FIX: 
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