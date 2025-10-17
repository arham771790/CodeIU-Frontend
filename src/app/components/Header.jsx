'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../store/useAuthStore';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Profile from './smallcomponents/Profile';
import Image from 'next/image';


export default function Header() {

const { isLoggingIn,authUser , logout , isLoggingOut}=useAuthStore()
const [image,setImage]=useState('https://randomuser.me/api/portraits/med/men/31.jpg');
const [isProfileOpen,setIsProfileOpen]=useState(false);

useEffect(()=>{
 (async function fetchimage()
 {
  const res = await axios.get('https://randomuser.me/api?gender=male')
  console.log(res.data.results[0].picture?.medium);
  setImage(res.data.results[0].picture?.medium);
 })()
  

},[])
 
console.log(authUser);

  const pages= [
    {
      name:'Explore',
      link:'/explore'
    },
    {
      name:'Problem',
      link:'/problem'
    },
    {
      name:'Contest',
      link:'/contest'
    },
    {
      name:'Registered',
      link:'/registered'
    
    }

  ]
  const pathname=usePathname();
  console.log(pathname);
  

  return (
    <header className=" backdrop-blur-md shadow-lg p-2   flex justify-between items-center sticky top-0 z-50 border-b text-black border-white/10 ">
       
      <div className=" flex justify-between w-full px-2  items-center">
        <div>
            <Link href="/" className="text-xl font-sans font-bold text-gray-200 bg-gradient-to-r rounded-2xl  hover:text-purple-400 bg-transparent transition-all  duration-300 ">
            🌊odeIU
          </Link>
        </div>
        
        {isLoggingIn && (
          <div>
          <ul className="flex justify-center items-center gap-3 text-6xl  font-semibold cursor-pointer">
          {isLoggingIn&&pages.map((page,i)=>(
            <Link href={page.link} key={i} className={`${pathname==page.link?'text-purple-500':""
            } font-semibold transition-colors text-sm relative group`}>
              {page.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r  from-white to-gray-200 group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))  }
          </ul>
        </div>
        )}

        <div>
          <ul className="flex justify-center items-center gap-2 space-x-6 text-md font-mono   cursor-pointer">
              <li className=''>
                <Link href="/login"  className="text-white hover:text-gray-300 gap-2  transition-colors relative group">
                  Explore
                </Link>
              </li>
               <li className=''>
                <Link href="/problem"  className="text-white hover:text-gray-300 gap-2  transition-colors relative group">
                  Problem
                </Link>
              </li>
               <li className=''>
                <Link href="/contest"  className="text-white hover:text-gray-300 gap-2  transition-colors relative group">
                  Contest
                </Link>
              </li>
               <li className=''>
                <Link href="/login"  className="text-white hover:text-gray-300 gap-2  transition-colors relative group">
                  Devloper
                </Link>
              </li>
            </ul>
        </div>

        <div className=" flex  px-2 py-2 rounded-full">
       
          <nav className="hidden md:block">
          { authUser ?
          ( <ul className="flex justify-center items-center gap-2 text-md font-mono cursor-pointer">
              <li className='mr-2'>
             {(<div onClick={()=>setIsProfileOpen((p)=>!p)} className="cursor-pointer bg-white/30 rounded-full p-1 relative">
             <Image src={image} alt="Profile" width={40} height={40} className="rounded-full" />
          {isProfileOpen  &&(
            <div className="absolute right-0  mt-2 w-30  rounded-md shadow-lg overflow-hidden z-20">
              <Profile logout={logout} isLoggingOut={isLoggingOut} authUser={authUser} setIsProfileOpen={setIsProfileOpen}/>
            </div>
          )}
             </div>)}
              </li>
              
            </ul>):(
            <Link href="/login" className="text-white hover:text-gray-300 gap-2  transition-colors relative group">
              {isLoggingIn ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
            </Link>
          )
            }
          </nav>
        </div>  
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-cyan-400 hover:text-purple-400 focus:outline-none transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
    </header>
  )
}
