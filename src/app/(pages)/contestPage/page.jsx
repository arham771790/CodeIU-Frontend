"use client" ;
import { useBundleStore } from '@/app/store/useBundleStore';
 import React from 'react'
 
 const page = () => {

     const { bundle} = useBundleStore();
     console.log("bundel from contest page ................................",bundle)
   return (
     <div>
       this is contest page
     </div>
   )
 }
 
 export default page
 