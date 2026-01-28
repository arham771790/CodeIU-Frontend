import Scroll from '@/app/components/scrollcomponent/Scroll'
import React from 'react'
import Section2 from './sections/Section2'
import Section3 from './sections/Section3'
import Section4 from './sections/Section4 '
import GridHighlights from '@/app/components/GridHighlights'

const Home2 = () => {
  return (
    <div className='max-w-screen bg-base-300 relative min-h-screen overflow-hidden'>
      {/* 1. Background Gradient Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-20 pointer-events-none" />

      {/* 2. THE GRID & HIGHLIGHTS CONTAINER */}
      {/* Both the grid lines and the highlights live inside this masked div */}
      <div className="absolute top-0 left-0 w-full h-[100vh] 
        [mask-image:linear-gradient(to_bottom,black_40%,transparent)]
        pointer-events-none z-0" 
      >
        {/* A. The Grid Pattern */}
        <div className="absolute inset-0 
          bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] 
          bg-[size:24px_24px]" 
        />
        
        {/* B. The Highlights (Now inherits the mask!) */}
        <GridHighlights />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Scroll/>
        <Section2/>
        <Section4/>
        <Section3/>
      </div>
    </div>
  )
}

export default Home2