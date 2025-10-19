"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "./store/useAuthStore";
import Pattern from "./components/smallcomponents/Pattern";
import  Scroll  from "./components/scrollcomponent/Scroll";
import Aurora from "@/components/Aurora";





export default function Home() {
 const {checkAuth}= useAuthStore();
 const [loading, setLoading] = useState(true);

 useEffect(()=>{
  checkAuth();
 },[])
  return (
  <div className="relative  overflow-hidden flex justify-center items-center max-w-screen ">
  <Scroll/>
<Aurora/>


</div>


  );
}
