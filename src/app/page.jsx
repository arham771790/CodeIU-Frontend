"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "./store/useAuthStore";
import Landingpage from "./components/Landingpage";
import LetterGlitch from "./components/LetterGlitch";



export default function Home() {
 const {checkAuth}= useAuthStore();
 const [loading, setLoading] = useState(true);

 useEffect(()=>{
  checkAuth();
 },[])
  return (
  <div className="relative bg-black/40">

      <LetterGlitch/>

  </div>
  );
}
