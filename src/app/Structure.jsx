'use client'
import React from 'react'
import IsClient from './components/IsClient'
import Header from './components/Header'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify'
import { usePathname } from 'next/navigation'

const Structure = ({children}) => {
    const pathname = usePathname();
    
    // --- 1. Define the base paths to hide ---
    // No trailing slashes needed
    const hideLayoutOn = [
      '/login',
      '/register',
      '/Each-problem', 
      '/Admin', 
      '/Contest_ProblemPage' // Changed from hideLayout
    ];

    // --- 2. Check if the current pathname *starts with* any of the paths ---
    const shouldHide = hideLayoutOn.some(path => pathname.startsWith(path));

    // Optional: Keep your console logs for debugging
    console.log("Current Path:", pathname);
    console.log("Should Hide:", shouldHide);
          
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
            /* ...other props */
            theme="colored"
          />
        </div>
      </IsClient>
    )
}

export default Structure