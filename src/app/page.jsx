"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "./store/useAuthStore";    
import Home2 from "./(pages)/Home/Home2";




export default function Home() {
 const {checkAuth}= useAuthStore();
 const [loading, setLoading] = useState(true);

 useEffect(()=>{
  checkAuth();
 },[])
  return (
  <div className="relative  overflow-hidden flex justify-center items-center max-w-screen ">
    <Home2/>


</div>


  );
}
