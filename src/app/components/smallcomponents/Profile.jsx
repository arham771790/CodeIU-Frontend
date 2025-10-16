import { useAuthStore } from '@/app/store/useAuthStore'
import { Loader2 } from 'lucide-react'
import React from 'react'

const Profile = () => {
  /*
  
  */
    const options=[,
        {
        name:'My Account'
        },
        {
        name:'Settings'
        },

    ]


    const { isLoggingIn,authUser , logout , isLoggingOut}=useAuthStore()


    const Logout=()=>{
        return <>
           <button className="p-1 mt-1 mb-1 cursor-pointer hover:text-white  hover:bg-red-800  rounded bg-white/80 text-black transition-all ease-in-out duration-300 relative group"
                onClick={logout}>
                 {
                  isLoggingOut ? (
                    <> <Loader2 className="h-5 w-5 animate-spin" /></>
                  ) : (
                   "Logout"
                  )
                 }
                </button></>
    }
  return (
    <div className='bg-black text-white'>
    <div className='flex flex-col justify-center items-center '>
          {options.map((option)=>(
        <div key={option.name} className='mb-1 border-b-white/20 border-b-2 hover:text-gray-400 '>
            {option.name}
        </div>
      ))}

      <Logout/>
    </div>
    </div>
  )
}

export default Profile
