"use client";
import React from "react";
import { ContainerScroll } from "../smallcomponents/container-scroll-animation";
import Landingpage from "../Landingpage";


export default function Scroll() {

    
  return (
    <div className="flex flex-col justify-between mt-8 pb-12    ">
      <ContainerScroll
        titleComponent={
          <>
    <Landingpage/>


          </>
        }>
   
           
      <video
        src="https://cdn.prod.website-files.com/66b6d7fd4d3e9cef94717176%2F6741fee19917cc8400fe361d_HackerRank%20Community%20Video-transcode.mp4"
        loop
        autoPlay
        height={1000}
        width={1200}
        muted
        playsInline
       
      />

      </ContainerScroll>
    </div>
  );
}
